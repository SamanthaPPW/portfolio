import { PoseLandmarker, FilesetResolver, DrawingUtils }
  from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs";

const video = document.getElementById("webcam");
const canvas = document.getElementById("overlay");
const ctx = canvas.getContext("2d");
const piste = document.getElementById("piste");
const pctx = piste.getContext("2d");
const consigne = document.getElementById("consigne");
const dessin = new DrawingUtils(ctx);

const TOLERANCE = 25;           // écart max en degrés
const FRAMES_POUR_VALIDER = 5;  // images correctes pour valider une pose
const ANTICIPATION = 4000;      // une pose apparaît 4 s avant son moment
const AVANT = 1000;             // on peut la valider 1 s avant…
const APRES = 600;              // …et jusqu'à 0,6 s après
const INTERVALLE = 2500;        // temps entre deux poses
const NB_POSES = 20;            // longueur de la chorégraphie
const ZONE_X = 70;              // position de la zone de validation sur la 

let modeJeu = null;

const P = {
  epauleG: 11, epauleD: 12,
  coudeG: 13, coudeD: 14,
  poignetG: 15, poignetD: 16,
  hancheG: 23, hancheD: 24,
  genouG: 25, genouD: 26,
  chevilleG: 27, chevilleD: 28,
};

const POSES = [
  { nom: "Bras en T",        angles: { epauleG: 90,  epauleD: 90,  coudeG: 180, coudeD: 180 } },
  { nom: "Bras en l'air",    angles: { epauleG: 170, epauleD: 170, coudeG: 180, coudeD: 180 } },
  { nom: "Biceps",           angles: { epauleG: 90,  epauleD: 90,  coudeG: 60,  coudeD: 60  } },
  { nom: "Bras gauche levé", angles: { epauleG: 170, epauleD: 15,  coudeG: 180, coudeD: 180 } },
  { nom: "Bras droit levé",  angles: { epauleG: 15,  epauleD: 170, coudeG: 180, coudeD: 180 } },
];

let poseLandmarker;
let choregraphie = [];
let score = 0;
let retour = null;        // "Parfait !" / "Raté" affiché brièvement
let dernierCorps = null;  // pour le mode enregistrement

function point(corps, i) {
  // conversion en pixels pour ne pas déformer les angles
  return { x: corps[i].x * video.videoWidth, y: corps[i].y * video.videoHeight };
}

function angle(corps, ia, ib, ic) {
  const a = point(corps, ia), b = point(corps, ib), c = point(corps, ic);
  const ab = Math.atan2(a.y - b.y, a.x - b.x);
  const cb = Math.atan2(c.y - b.y, c.x - b.x);
  let deg = Math.abs(((ab - cb) * 180) / Math.PI);
  return deg > 180 ? 360 - deg : deg;
}

function anglesDuCorps(c) {
  return {
    epauleG: angle(c, P.hancheG, P.epauleG, P.coudeG),
    epauleD: angle(c, P.hancheD, P.epauleD, P.coudeD),
    coudeG:  angle(c, P.epauleG, P.coudeG, P.poignetG),
    coudeD:  angle(c, P.epauleD, P.coudeD, P.poignetD),
    genouG:  angle(c, P.hancheG, P.genouG, P.chevilleG),
    genouD:  angle(c, P.hancheD, P.genouD, P.chevilleD),
  };
}

function corpsVisible(c) {
  const pointsRequis = modeJeu === "assis" 
    ? [11, 12, 13, 14, 15, 16] 
    : [11, 12, 13, 14, 15, 16, 23, 24];
  
  return pointsRequis.every((i) => c[i] && c[i].visibility > 0.4);
}

function poseCorrecte(joueur, pose) {
  return Object.keys(pose.angles).every((k) => {
    if (modeJeu === "assis" && (k.startsWith("genou") || k.startsWith("cheville") || k.startsWith("hanche"))) {
      return true; 
    }
    return Math.abs(joueur[k] - pose.angles[k]) < TOLERANCE;
  });
}

function dessinerBonhomme(c, angles, x, y, t, couleur) {
  const rad = (d) => (d * Math.PI) / 180;
  const epG = rad(angles.epauleG ?? 15), epD = rad(angles.epauleD ?? 15);
  const coG = rad(angles.coudeG ?? 180), coD = rad(angles.coudeD ?? 180);
  const bras = t * 0.35, avantBras = t * 0.3;

  const epauleG = { x: x - t * 0.2, y };
  const epauleD = { x: x + t * 0.2, y };
  const bassin = { x, y: y + t * 0.6 };

  const dirG = Math.atan2(Math.cos(epG), -Math.sin(epG));
  const coudeG = { x: epauleG.x + Math.cos(dirG) * bras, y: epauleG.y + Math.sin(dirG) * bras };
  const dirAvG = dirG + (Math.PI - coG);
  const mainG = { x: coudeG.x + Math.cos(dirAvG) * avantBras, y: coudeG.y + Math.sin(dirAvG) * avantBras };

  const dirD = Math.atan2(Math.cos(epD), Math.sin(epD));
  const coudeD = { x: epauleD.x + Math.cos(dirD) * bras, y: epauleD.y + Math.sin(dirD) * bras };
  const dirAvD = dirD - (Math.PI - coD);
  const mainD = { x: coudeD.x + Math.cos(dirAvD) * avantBras, y: coudeD.y + Math.sin(dirAvD) * avantBras };

  c.strokeStyle = couleur;
  c.lineWidth = 4;
  c.lineCap = "round";
  c.beginPath();
  const ligne = (a, b) => { c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); };
  ligne(epauleG, epauleD);
  ligne({ x, y }, bassin); // Dos
  if (modeJeu !== "assis") {
    ligne(bassin, { x: x - t * 0.15, y: y + t * 1.1 });
    ligne(bassin, { x: x + t * 0.15, y: y + t * 1.1 });
  }
  ligne(epauleG, coudeG); ligne(coudeG, mainG);
  ligne(epauleD, coudeD); ligne(coudeD, mainD);
  c.stroke();

  c.beginPath(); // tête
  c.arc(x, y - t * 0.18, t * 0.13, 0, Math.PI * 2);
  c.stroke();
}

function creerChoregraphie(nb) {
  const debut = performance.now() + 3000; // 3 s pour se préparer
  const etapes = [];
  let precedente = null;
  for (let i = 0; i < nb; i++) {
    let pose;
    do {
      pose = POSES[Math.floor(Math.random() * POSES.length)];
    } while (pose === precedente); // pas deux fois la même d'affilée
    precedente = pose;
    etapes.push({ pose, temps: debut + i * INTERVALLE, etat: "attente", compteur: 0 });
  }
  return etapes;
}

function verifierEtapes(maintenant, anglesJoueur) {
  for (const e of choregraphie) {
    if (e.etat !== "attente") continue;
    const dt = maintenant - e.temps;

    if (dt < -AVANT) continue; // trop tôt, pas encore son tour
    if (dt > APRES) {          // trop tard
      e.etat = "ratee";
      retour = { texte: "Raté 😅", fin: maintenant + 800 };
      continue;
    }

    if (anglesJoueur && poseCorrecte(anglesJoueur, e.pose)) e.compteur++;
    if (e.compteur >= FRAMES_POUR_VALIDER) {
      e.etat = "reussie";
      score++;
      retour = { texte: "Parfait ! 🎉", fin: maintenant + 800 };
    }
  }
}

function dessinerPiste(maintenant) {
  pctx.clearRect(0, 0, piste.width, piste.height);

  // zone de validation
  pctx.fillStyle = "rgba(255, 255, 255, 0.15)";
  pctx.fillRect(ZONE_X - 60, 5, 120, piste.height - 10);

  for (const e of choregraphie) {
    const dt = e.temps - maintenant;
    if (dt > ANTICIPATION || dt < -800) continue; // hors de la piste
    const x = ZONE_X + (dt / ANTICIPATION) * (piste.width - ZONE_X - 40);
    const couleur = e.etat === "reussie" ? "#22c55e"
                  : e.etat === "ratee"   ? "#ef4444"
                  : "#ffffff";
    dessinerBonhomme(pctx, e.pose.angles, x, 35, 70, couleur);
  }

  if (retour && maintenant < retour.fin) {
    pctx.fillStyle = "#fff";
    pctx.font = "bold 20px system-ui";
    pctx.fillText(retour.texte, ZONE_X + 75, 28);
  }
}

function boucle() {
  const maintenant = performance.now();
  const corps = poseLandmarker.detectForVideo(video, maintenant).landmarks[0];
  const angles = corps && corpsVisible(corps) ? anglesDuCorps(corps) : null;

  verifierEtapes(maintenant, angles);

  // squelette du joueur
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (corps) {
    dernierCorps = corps;
    dessin.drawConnectors(corps, PoseLandmarker.POSE_CONNECTIONS, { color: "#ffffff", lineWidth: 4 });
    dessin.drawLandmarks(corps, { color: "#ffffff", radius: 3 });
  }

  dessinerPiste(maintenant);

  const fini = choregraphie.every((e) => e.etat !== "attente");
  consigne.textContent = fini
    ? `Fin ! Score : ${score} / ${choregraphie.length}`
    : `Score : ${score}`;

  requestAnimationFrame(boucle);
}

// ============================================================
//  Mode enregistrement : appuie sur "r", tu as 3 s pour prendre la pose
// ============================================================
document.addEventListener("keydown", (e) => {
  if (e.key !== "r") return;
  console.log("Enregistrement dans 3 s…");
  setTimeout(() => {
    if (!dernierCorps) return console.log("Personne détecté");
    const angles = Object.fromEntries(
      Object.entries(anglesDuCorps(dernierCorps)).map(([k, v]) => [k, Math.round(v)])
    );
    console.log(JSON.stringify(angles));
  }, 3000);
});

// ============================================================
//  Initialisation
// ============================================================
async function demarrerWebcam() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { width: { ideal: 1280 }, height: { ideal: 720 } },
  });
  video.srcObject = stream;
  await new Promise((r) => (video.onloadedmetadata = r));
  await video.play();
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
}

async function chargerDetecteur() {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
  );
  poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
      delegate: "GPU",
    },
    runningMode: "VIDEO",
    numPoses: 1,
  });
}

async function init() {
  await demarrerWebcam();
  await chargerDetecteur();
  
  consigne.textContent = "Prêt !";
  
  document.getElementById("menu").style.display = "flex";
}

document.getElementById("btn-assis").addEventListener("click", () => demarrerJeu("assis"));
document.getElementById("btn-debout").addEventListener("click", () => demarrerJeu("debout"));

function demarrerJeu(mode) {
  modeJeu = mode;
  document.getElementById("menu").style.display = "none";
  choregraphie = creerChoregraphie(NB_POSES);
  requestAnimationFrame(boucle);
}

init().catch((err) => {
  console.error(err);
  consigne.textContent = "Erreur, regarde la console (F12)";
});
