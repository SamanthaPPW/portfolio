<?php
session_start();
$pageTitle = 'Galerie';
require 'header.php';
?>

<main>
    <h1>Galerie</h1>
    <div>
        <form id="fichier" action="traitements/upload_image.php" method="post" enctype="multipart/form-data">
            <label for="imageform">Choisir un fichier (JPEG, 5 Mo max)</label>
            <input type="file" name="image" id="imageform" accept="image/jpeg" required />
            <input class="envoie" type="submit" value="Télécharger" />
        </form>

        <?php
        if (isset($_SESSION['information']) && $_SESSION['information'] != '') {
            $class = strpos($_SESSION['information'], 'Erreur') !== false ? 'error' : 'success';
            echo '<p class="' . $class . '">' . $_SESSION['information'] . '</p>';
            unset($_SESSION['information']); // Suppression du message après affichage
        }
        ?>
    </div>

    <div class="imagegal">
    <?php
    $nbFichiers = -2; // Le dossier contient deux fichiers cachés . et ..
    $dossier = opendir("images/galerie");
    while ($fichier = readdir($dossier)) {
        $nbFichiers++;
    }
    closedir($dossier); // On ferme le dossier après lecture

    $i = 1; // On initialise i à 1
    while ($i <= $nbFichiers) {
        echo '<div class="containergal">';
        echo '<div class="sectionimagegal">'; 
        echo '<img src="images/galerie/image' . $i . '.jpg" alt="Photo de Londres n°' . $i . '" loading="lazy" decoding="async">';
        echo '</div>';
        echo '</div>'; 
        
        $i++;
    }
    ?>
</div>
</main>

<?php
require ('footer.php');
?>