<?php
  session_start();
  include 'ecoindex.html';
?>

<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Samantha Pacheco-Pires Wiss - Portfolio</title>
  <link rel="stylesheet" href="styles/styles.css">
</head>
<body>
  <header id="accueil">
    <nav id="main-nav">
      <ul>
        <li><a href="#accueil">Accueil</a></li>
        <li><a href="#aboutme">À propos de moi</a></li>
        <li><a href="#projets">Projets</a></li>
        <li><a href="#contact">Contact</a></li>
        <li><a href="#">Portfolio vidéaste</a></li>
      </ul>
    </nav>

    <div class="hero">
      <img src="assets/bg-img.png" alt="Image de fond" id="bg-image">
      <div id="hero-buttons" class="hero-buttons" aria-hidden="false">
        <a href="#aboutme" class="hero-btn">À propos de moi</a>
        <a href="#projets" class="hero-btn">Projets</a>
        <a href="#contact" class="hero-btn">Contact</a>
        <a href="#" class="hero-btn">Portfolio vidéaste</a>
      </div>
    </div>
  </header>

<main>
  <section id="aboutme">
    <h1> Bonjour, Je suis Samantha !</h1>
    <div id="aboutme-container">
    <div id="grid-left">
      <h2>Cliquez sur mon CV pour le voir en détail !</h2>
      <a href="assets/CV Actualisé.pdf" target="_blank" id="cv-thumbnail">
        <img src="assets/img/cvactu.jpg" alt="Voir mon CV"/>
      </a>
    
    </div>
    <div id="grid-right">
  <h2>À propos de moi</h2>
  <p>
    Je suis actuellement en 2ᵉ année de BUT MMI. 
    Je m'intéresse aux technologies web, au design, au marketing digital et je suis passionnée par le développement back-end tout en adorant le front-end.
  </p>
  <p>
    Je suis de nature très curieuse, et j'aime beaucoup apprendre toutes sortes de choses. 
  </p>
  <p>
    En dehors du web, j'ai travaillé à McDonald's pendant une partie de mes études. Cela m'a permis de développer mes compétences en travail d'équipe, en gestion du temps et en service à la clientèle, en plus qu'entrer dans le monde professionnel.
  </p>

  <h3>Mes expériences</h3>
  <p>
    J'ai également travaillé sur de petites applications et jeux vidéos, ce qui m'a permis d'améliorer mes compétences en Python, Godot4 et JavaScript.
  </p>
  <p>
    Je suis entrain d'apprendre Symfony grâce à la création d'une applis d'emplois du temps ultra-personnalisable et je me forme aussi en ReactJS Native pour le développement mobile.
  </p>
  <p>
    Je pars étudier à Montréal, Canada, de janvier 2026 à juin 2026 afin de développer ma culture hors Europe, ainsi que d'y effectuer un stage de 4 semaines dans une agence sur place.
  </p>

  <h3>Mes autres passions</h3>
    <p>
    En dehors du développement, je suis passionnée par la vidéo, la cuisine et le sport !
  </p>
  <p>
    Pour la vidéo, vous pouvez consulter mon <a href="#">portfolio vidéaste</a>.
  </p>

  <a href="https://www.linkedin.com/in/samantha-pacheco-pires-wiss-b67a972b8/" target="_blank" rel="noopener noreferrer">
    <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg" alt="LinkedIn" id="linkedin-icon" />
  </a>
</div>
  </section>

  <section id="projets-container">
    <h1>Mes Projets</h1>
    <div id="projets">
      <div class="projet">
  <h3>Jeux en Javascripts</h3>
  <nav>
    <ul>
      <li><a href="#">Tetris</a></li>
      <li><a href="#">DoodleJump</a></li>
  </nav>
  </div>

      <div class="projet">
        <h3>Petits sites webs</h3>
        <nav>
          <ul>
            <li><a href="#">Site projet de cours sur la cuisine</a></li>
            <li><a href="#">Site de production de podcast</a></li>
            <li><a href="#">Intégration site de Dataviz</a></li>
          </ul>
        </nav>
      </div>

      <div class="projet">
        <h3>Applications en Python</h3>
        <nav>
          <ul>
            <li><a href="#">Jeu du pendu</a></li>
            <li><a href="#">Jeu Flappy Bird</a></li>
            <li><a href="#">Autoclicker personnalisable</a></li>
            <li><a href="#">Générateur de mot de passe</a></li>
          </ul>
        </nav>
      </div>
      <div class="projet">
        <h3>Projet Apprentissage Symfony</h3>
        <nav>
          <ul>
            <li><a href="#">Agenda personnalisable en ligne</a></li>
            <li><a href="#">Site de cours sur les jeux de société</a></li>
          </ul>
        </nav>
      </div>
    </div>
  </section>
    <section id="competences-container">
    <h2>Mes Compétences</h2>
    <div id="competences">
      <div class="competence">
        <h3>Développement Frontend</h3>
        <p>HTML, CSS, SCSS, JavaScript, JSON.</p>
        <p> Apprentissage ReactJS Native et TypeScript</p>
      </div>
      <div class="competence">
        <h3>Développement Backend</h3>
        <p>Python (Flask), PHP, Docker. </p>
        <p>Apprentissage Node.js et Symfony</p>
      </div>
      <div class="competence">
        <h3>Base de données</h3>
        <p>MySQL, MongoSQL</p>
      </div>
      <div class="competence">
        <h3>Applications</h3>
        <p>Python (Kivy, PyGame, Tkinter), Godot4 </p>
      </div>
      <br>
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
    <h2>Vous souhaitez me contacter ?</h2>
    <form method="POST" action="traitement_formulaire.php">
      <label for="nom">Nom :</label>
      <input type="text" id="nom" name="name" required placeholder="Votre nom...">
  
      <label for="email">Email :</label>
      <input type="email" id="email" name="email" required placeholder="Votre email...">
  
      <label for="message">Message :</label>
      <textarea id="message" name="message" required placeholder="Votre message..."></textarea>
  
      <button type="submit" class="btn" id="envoie">Envoyer</button>
    </form>
  </section>
</main>
<footer>
    &copy; 2025 Samantha Pacheco-Pires Wiss - Tous droits réservés
</footer>

<script src="scripts/main.js"></script>
</body>
</html>