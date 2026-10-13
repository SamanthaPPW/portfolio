<?php
// Chaque page définit $pageTitle (et éventuellement $extraHead) avant d'inclure ce fichier.
$pageTitle = $pageTitle ?? 'Journal de voyage à Londres';
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Journal de voyage : 7 jours à Londres pendant les vacances de Noël.">
  <title><?= htmlspecialchars($pageTitle) ?> · Journal de voyage à Londres</title>
  <link rel="icon" type="image/png" href="images/favicon.png">
  <link rel="stylesheet" href="css/styles.css">
  <?= $extraHead ?? '' ?>
</head>
<body>
<header>
  <h1 id="h1header1">Journal de voyage à Londres</h1>
  <h2 id="h2header1">7 jours dans la capitale britannique</h2>
  <div id="page-actuelle-container">
    <?php
    // Noms affichés pour chaque page
    $pageNames = [
        'index' => 'Accueil',
        'donnees' => 'Données',
        'galerie' => 'Galerie',
        'contact' => 'Contact',
        'partenaires' => 'Partenaires',
        'credits' => 'Crédits'
    ];

    // Nom de la page actuelle, sans l'extension .php
    $currentPageKey = str_replace('.php', '', basename($_SERVER['PHP_SELF']));
    $pageDisplayName = $pageNames[$currentPageKey] ?? ucfirst($currentPageKey);

    echo 'Page actuelle : <div id="page-actuelle">' . htmlspecialchars($pageDisplayName) . '</div>';
    ?>
  </div>

  <a title="Retour à l'accueil" href="index.php"><img id="logo" src="images/logo.svg" alt="Logo de Londres"></a>
  <button type="button" id="navheader" aria-expanded="false" aria-controls="sidebar">Navigation</button>
  <div id="viewport">
    <div id="sidebar">
      <header><a href="#" title="Navigation du site">Navigation du site</a></header>
        <nav aria-label="Navigation principale">
          <ul>
          <?php $currentPage = basename($_SERVER['PHP_SELF']); ?>
          <!-- Classe "active" sur la page actuelle -->
          <li><a href="index.php" title="Page d'accueil" class="<?= ($currentPage === 'index.php') ? 'active' : '' ?>">Accueil</a></li>
          <li><a href="donnees.php" title="Page de données" class="<?= ($currentPage === 'donnees.php') ? 'active' : '' ?>">Données</a></li>
          <li><a href="galerie.php" title="Page de galerie" class="<?= ($currentPage === 'galerie.php') ? 'active' : '' ?>">Galerie</a></li>
          <li><a href="contact.php" title="Page de contact" class="<?= ($currentPage === 'contact.php') ? 'active' : '' ?>">Contact</a></li>
          <li><a href="partenaires.php" title="Page des partenaires" class="<?= ($currentPage === 'partenaires.php') ? 'active' : '' ?>">Partenaires</a></li>
          </ul>
        </nav>
    </div>
  </div>
  <script src="js/bouton.js"></script>
</header>
