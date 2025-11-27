<?php
  session_start();
  include 'ecoindex.html';
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="styles/styles.css">
  

  <title>Portfolio - Samantha Pacheco-Pires Wiss</title>
</head>
<body>

<main>
  <section id="accueil">
    <div class="container">
      
      <img src="assets/bg-img.png" alt="Background Image" id="bg-image">

      <h1 class="white">Samantha PACHECO-PIRES WISS</h1>
      <p class="white">Développeuse FullStack junior.</p>
      <div class="buttons">
      <a href="#aboutme" class="btn">Qui je suis</a>
        <a href="#projets" class="btn">Voir mes projets</a>
        <a href="#competences" class="btn">Mes compétences</a>
        <a href="#contact" class="btn">Me contacter</a>
      </div>
    </div>
  </section>

  <section id="aboutme">
  <h1>À Propos de Moi</h1>
  <div class="aboutme-container">
    <div class="left-column">
      <a href="assets/CV-Samantha.pdf" target="_blank" class="cv-thumbnail">
        <img src="assets/img/cv.png" alt="Voir mon CV" />
      </a>
      <a href="https://www.linkedin.com/in/samantha-pacheco-pires-wiss-b67a972b8/" target="_blank" rel="noopener noreferrer">
        <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg" alt="LinkedIn" class="linkedin-icon" />
      </a>
    </div>
    <div class="right-column">
      <p>Je m'appelle Samantha, en première année de BUT MMI. Dans le cadre de mes études, j'ai pu me familiariser avec les technologies liées au web.</p>
      <p>En plus du web, je suis douée en Python, où je développe des petits jeux simples (un jeu Mario, un jeu Flappy Bird, un pendu).</p>
      <p>Mais le développement web n'est pas ma seule passion ! J'aime aussi l'audiovisuel, la cuisine et le sport !</p>
    </div>
  </div>
</section>




  <section id="projets">
    <h2>Mes Projets</h2>
    <div class="projets">
      <div class="projet">
        <a href="http://185.216.26.179/tetris">
        <h3>Tetris</h3>
        <p>Jeu de tetris réalisé grâce à JavaScript</p>
        <p>Voir Plus</p>
          <img src="assets/img/tetris.png" alt="Page tetris" class="projet-image">
        </a>
      </div>

      <div class="projet">
        <a href="https://mmi24f08.sae203.ovh">
        <h3>SAE203</h3>
        <p>Site web responsive utilisant une base de donnée réalisé lors d'un projet de cours</p>
        <p>Voir Plus</p>
          <img src="assets/img/sae203.png" alt="Site de la SAE203" class="projet-image">
        </a>
      </div>

      <div class="projet">
        <a href="http://185.216.26.179/doodlejump">
        <h3>DoodleJump</h3>
        <p>Jeu de DoodleJump réalisé grâce à JavaScript</p>
        <p>Voir Plus</p>
          <img src="assets/img/doodlejump.png" alt="Page doodlejump" class="projet-image">
        </a>
      </div>
      <div class="projet">
        <a href="#projet">
        <h3>Python</h3>
        <p>Micro applications faites en python</p>
        <p>Voir Plus</p>
          <img src="assets/img/python.png" alt="Page python" class="projet-image">
        </a>
      </div>

    </div>
  </section>

  <section id="competences">
    <h2>Mes Compétences</h2>
    <div class="competences">
      <div class="competence">
        <h3>Développement Frontend</h3>
        <p>HTML, CSS, JavaScript, React.js</p>
      </div>
      <div class="competence">
        <h3>Développement Backend</h3>
        <p>Node.js, Python (Flask), PHP, Docker</p>
      </div>
      <div class="competence">
        <h3>Base de données</h3>
        <p>MySQL</p>
      </div>
      <div class="competence">
        <h3>Applications</h3>
        <p>Python (Kivy, PyGame, Tkinter)</p>
      </div>
      <br>
      <p>Je peux utiliser également d'autres langages de programmations tel que le C# et Java.</p>
    </div>
  </section>

  <section id="contact">
  <?php 
if (isset($_SESSION['error'])) { 
    echo '<p class="error">' . $_SESSION['error'] . '</p>';
    unset($_SESSION['error']); 
}
if (isset($_SESSION['success'])) {
    echo '<p class="success">' . $_SESSION['success'] . '</p>';
    unset($_SESSION['success']); 
}
?>
    <h2>Contactez-moi</h2>
    <form method="POST" action="traitement_formulaire.php">
      <label for="nom">Nom :</label>
      <input type="text" id="nom" name="name" required>

      <label for="email">Email :</label>
      <input type="email" id="email" name="email" required>

      <label for="message">Message :</label>
      <textarea id="message" name="message" required></textarea>

      <button type="submit" class="btn" id="envoie">Envoyer</button>
    </form>
  </section>

  <footer>
    &copy; 2025 Samantha Pacheco-Pires Wiss - Tous droits réservés
  </footer>
</main>

</body>
</html>
