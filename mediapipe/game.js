import { PoseLandmarker, FilesetResolver, DrawingUtils }
  from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs";

const video = document.getElementById("webcam");
const canvas = document.getElementById("overlay");
const ctx = canvas.getContext("2d");
const piste = document.getElementById("piste");
const pctx = piste.getContext("2d");
const consigne = document.getElementById("consigne");
const menu = document.getElementById("menu");
const titreMenu = document.getElementById("titre-menu");
const dessin = new DrawingUtils(ctx);

const BPM = 120;
const TEMPS = 60000 / BPM;      // durée d'un temps (500 ms)
const INTERVALLE = TEMPS * 4;   // une pose tous les 4 temps
const TOLERANCE = 25;           // écart max en degrés
const FRAMES_POUR_VALIDER = 5;  // images correctes pour valider une pose
const ANTICIPATION = 4000;      // une pose apparaît 4 s avant son moment
const AVANT = 1000;             // on peut la valider 1 s avant…
const APRES = 600;              // …et jusqu'à 0,6 s après
const NB_POSES = 20;            // longueur de la chorégraphie
const ZONE_X = 70;              // position de la zone de validation sur la piste

const P = {
  epauleG: 11, epauleD: 12,
  coudeG: 13, coudeD: 14,
  poignetG: 15, poignetD: 16,
  hancheG: 23, hancheD: 24,
  genouG: 25, genouD: 26,
  chevilleG: 27, chevilleD: 28,
};

// "debout: true" = pose qui utilise les jambes, seulement en mode debout
const POSES = [
  { nom: "Bras en T",        angles: { epauleG: 90,  epauleD: 90,  coudeG: 180, coudeD: 180 } },
  { nom: "Bras en l'air",    angles: { epauleG: 170, epauleD: 170, coudeG: 180, coudeD: 180 } },
  { nom: "Biceps",           angles: { epauleG: 90,  epauleD: 90,  coudeG: 60,  coudeD: 60  } },
  { nom: "Bras gauche levé", angles: { epauleG: 170, epauleD: 15,  coudeG: 180, coudeD: 180 } },
  { nom: "Bras droit levé",  angles: { epauleG: 15,  epauleD: 170, coudeG: 180, coudeD: 180 } },
  { nom: "Disco ↗",          angles: { epauleG: 15,  epauleD: 135, coudeG: 180, coudeD: 180 } },
  { nom: "Squat",            angles: { epauleG: 90,  epauleD: 90,  genouG: 110, genouD: 110 }, debout: true },
  { nom: "Genou levé",       angles: { epauleG: 170, epauleD: 170, genouG: 90,  genouD: 175 }, debout: true },
];

const NOTES = [
  { texte: "Parfait !", erreurMax: 10, points: 3, couleur: "#facc15" },
  { texte: "Super !",   erreurMax: 17, points: 2, couleur: "#22c55e" },
  { texte: "Bien",      erreurMax: 25, points: 1, couleur: "#38bdf8" },
];

let poseLandmarker;
let modeJeu = null;
let enCours = false;
let audio = null;
let choregraphie = [];
let score = 0;
let combo = 0;
let retour = null;        // note affichée brièvement sur la piste
let dernierCorps = null;  // pour le mode enregistrement

// ============================================================
//  Calcul des angles
// ============================================================
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
    : [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28];
  return pointsRequis.every((i) => c[i] && c[i].visibility > 0.4);
}

// écart moyen en degrés, ou null si un angle dépasse la tolérance
function erreurPose(joueur, pose) {
  const ecarts = Object.keys(pose.angles).map((k) => Math.abs(joueur[k] - pose.angles[k]));
  if (ecarts.some((e) => e > TOLERANCE)) return null;
  return ecarts.reduce((a, b) => a + b, 0) / ecarts.length;
}

// ============================================================
//  Musique : un beat simple généré avec Web Audio
// ============================================================
function son(quand, frequence, duree, volume) {
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.frequency.setValueAtTime(frequence, quand);
  osc.frequency.exponentialRampToValueAtTime(frequence / 3, quand + duree);
  gain.gain.setValueAtTime(volume, quand);
  gain.gain.exponentialRampToValueAtTime(0.001, quand + duree);
  osc.connect(gain).connect(audio.destination);
  osc.start(quand);
  osc.stop(quand + duree);
}

function lancerMusique(delai, nbTemps) {
  audio = new AudioContext();
  const debut = audio.currentTime + delai / 1000;
  for (let i = 0; i < nbTemps; i++) {
    const t = debut + (i * TEMPS) / 1000;
    son(t, 150, 0.25, 0.8);                           // boum à chaque temps
    son(t + TEMPS / 2000, 3000, 0.05, 0.08);           // petit "tss" entre deux
    if (i % 4 === 0) son(t, 880, 0.3, 0.25);           // "ding" sur chaque pose
  }
}

// ============================================================
//  Dessin du petit bonhomme qui montre la pose
// ============================================================
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
  ligne({ x, y }, bassin); // dos
  if (modeJeu !== "assis") {
    // plus le genou est plié, plus il part sur le côté
    const plieG = (180 - (angles.genouG ?? 180)) / 90;
    const plieD = (180 - (angles.genouD ?? 180)) / 90;
    const genouG = { x: x - t * (0.08 + 0.2 * plieG), y: y + t * 0.85 };
    const genouD = { x: x + t * (0.08 + 0.2 * plieD), y: y + t * 0.85 };
    ligne(bassin, genouG); ligne(genouG, { x: x - t * 0.15, y: y + t * 1.1 });
    ligne(bassin, genouD); ligne(genouD, { x: x + t * 0.15, y: y + t * 1.1 });
  }
  ligne(epauleG, coudeG); ligne(coudeG, mainG);
  ligne(epauleD, coudeD); ligne(coudeD, mainD);
  c.stroke();

  c.beginPath(); // tête
  c.arc(x, y - t * 0.18, t * 0.13, 0, Math.PI * 2);
  c.stroke();
}

// ============================================================
//  Chorégraphie
// ============================================================
function creerChoregraphie(nb, debut) {
  const disponibles = POSES.filter((p) => modeJeu === "debout" || !p.debout);
  const etapes = [];
  let precedente = null;
  for (let i = 0; i < nb; i++) {
    let pose;
    do {
      pose = disponibles[Math.floor(Math.random() * disponibles.length)];
    } while (pose === precedente); // pas deux fois la même d'affilée
    precedente = pose;
    // la première pose tombe après 4 temps d'intro
    etapes.push({ pose, temps: debut + (i + 1) * INTERVALLE, etat: "attente", compteur: 0 });
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
      combo = 0;
      retour = { texte: "Raté 😅", couleur: "#ef4444", fin: maintenant + 800 };
      continue;
    }

    const erreur = anglesJoueur ? erreurPose(anglesJoueur, e.pose) : null;
    if (erreur === null) continue;
    e.compteur++;
    if (e.compteur >= FRAMES_POUR_VALIDER) {
      const note = NOTES.find((n) => erreur <= n.erreurMax);
      e.etat = "reussie";
      e.couleur = note.couleur;
      combo++;
      score += note.points * (combo >= 5 ? 2 : 1); // points doublés à partir de 5 d'affilée
      retour = { texte: note.texte, couleur: note.couleur, fin: maintenant + 800 };
    }
  }
}

function dessinerPiste(maintenant) {
  pctx.clearRect(0, 0, piste.width, piste.height);

  // zone de validation, qui pulse au rythme
  const pulse = 1 - ((maintenant - choregraphie[0].temps + INTERVALLE * 10) % TEMPS) / TEMPS;
  pctx.fillStyle = `rgba(255, 255, 255, ${0.1 + pulse * 0.15})`;
  pctx.fillRect(ZONE_X - 60, 5, 120, piste.height - 10);

  for (const e of choregraphie) {
    const dt = e.temps - maintenant;
    if (dt > ANTICIPATION || dt < -800) continue; // hors de la piste
    const x = ZONE_X + (dt / ANTICIPATION) * (piste.width - ZONE_X - 40);
    const couleur = e.etat === "reussie" ? e.couleur
                  : e.etat === "ratee"   ? "#ef4444"
                  : "#ffffff";
    dessinerBonhomme(pctx, e.pose.angles, x, 35, 70, couleur);
  }

  if (retour && maintenant < retour.fin) {
    pctx.fillStyle = retour.couleur;
    pctx.font = "bold 20px system-ui";
    pctx.fillText(retour.texte, ZONE_X + 75, 28);
  }
}

// ============================================================
//  Boucle de jeu
// ============================================================
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

  const prochaine = choregraphie.find((e) => e.etat === "attente");
  if (!prochaine) return finDuJeu();

  if (maintenant < choregraphie[0].temps - INTERVALLE) {
    consigne.textContent = "Prépare-toi…";
  } else if (!angles) {
    consigne.textContent = modeJeu === "debout" ? "Recule, on doit voir tout ton corps !" : "Mets-toi bien face à la caméra";
  } else {
    const texteCombo = combo >= 2 ? ` · Combo x${combo}` : "";
    consigne.textContent = `Score : ${score}${texteCombo} · Prochaine : ${prochaine.pose.nom}`;
  }

  requestAnimationFrame(boucle);
}

function finDuJeu() {
  enCours = false;
  audio.close();
  const reussies = choregraphie.filter((e) => e.etat === "reussie").length;
  const max = NB_POSES * NOTES[0].points * 2;
  const etoiles = "⭐".repeat(Math.ceil((score / max) * 5)) || "…";
  consigne.textContent = `Fin ! ${reussies} / ${NB_POSES} poses réussies`;
  titreMenu.textContent = `Score : ${score}  ${etoiles}  — Rejouer ?`;
  menu.style.display = "flex";
}

function demarrerJeu(mode) {
  if (enCours) return;
  enCours = true;
  modeJeu = mode;
  score = 0;
  combo = 0;
  retour = null;
  menu.style.display = "none";

  const delai = 1000; // petite pause avant que la musique démarre
  choregraphie = creerChoregraphie(NB_POSES, performance.now() + delai);
  lancerMusique(delai, (NB_POSES + 2) * 4);
  requestAnimationFrame(boucle);
}

// ============================================================
//  Mode enregistrement : appuie sur "r", tu as 3 s pour prendre la pose
// ============================================================
document.addEventListener("keydown", (e) => {
  if (e.key !== "r") return;
  console.log("Enregistrement dans 3 s…");
  setTimeout(() => {
    if (!dernierCorps) return console.log("Personne détectée");
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
  consigne.textContent = "Prêt ! Choisis ton mode";
  menu.style.display = "flex";
}

document.getElementById("btn-assis").addEventListener("click", () => demarrerJeu("assis"));
document.getElementById("btn-debout").addEventListener("click", () => demarrerJeu("debout"));

init().catch((err) => {
  console.error(err);
  consigne.textContent = "Erreur, regarde la console (F12)";
});
