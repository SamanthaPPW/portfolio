<?php
session_start(); // Assurez-vous que la session est démarrée

// Vérification de sélection d'un fichier
if (!empty($_FILES['image'])) {
    $image_nom = $_FILES['image']['name'];
    $image_type = $_FILES['image']['type'];
    $image_taille = $_FILES['image']['size'];
    $image_temporaire = $_FILES['image']['tmp_name'];
    $image_error = $_FILES['image']['error'];
} else {
    $_SESSION['information'] = 'Erreur : Vous devez sélectionner un fichier';
    header('Location: ../galerie.php');
    exit();
}

// Début Vérification de la conformité
$affichage_erreurs = '';
$erreurs = 0;

// Test si pas d'erreur de sélection
if ($image_error == 0) {
    // Taille maximale : 5 Mo
    if ($image_taille > 5 * 1024 * 1024) {
        $affichage_erreurs .= 'Erreur : l\'image dépasse 5 Mo<br>';
        $erreurs++;
    }

    // Test format du fichier en fonction de l'extension
    if ($image_type != 'image/jpeg') {
        $affichage_erreurs .= 'Erreur : le fichier n\'est pas au format jpeg ou extension invalide<br>';
        $erreurs++;
    }

    // Test format du fichier avec la fonction exif_imagetype
    if (exif_imagetype($image_temporaire) != IMAGETYPE_JPEG) {
        $affichage_erreurs .= 'Erreur : ce fichier n\'est pas une image jpeg<br>';
        $erreurs++;
    }
} else {
    $affichage_erreurs = 'Erreur : Impossible de télécharger le fichier, erreur de sélection<br>';
    $erreurs++;
}

// On affiche les erreurs
if ($erreurs != 0) {
    $_SESSION['information'] = $affichage_erreurs;
} else {
    // On récupère le nombre de fichiers dans images/galerie
    $nbFichiers = -2; // Le dossier contient deux fichiers cachés . et ..
    $dossier = opendir("../images/galerie");
    while ($fichier = readdir($dossier)) {
        $nbFichiers++;
    }
    closedir($dossier); // On ferme le dossier après lecture

    // On renomme le fichier - imageN.jpg
    $image_num = $nbFichiers + 1;
    $image_nom = 'image' . $image_num . '.jpg';

    // On fixe le nom complet de la destination (chemin relatif/imageN.jpg)
    $destination = "../images/galerie/" . $image_nom;

    // On déplace le fichier dans son emplacement définitif
    if (move_uploaded_file($image_temporaire, $destination)) {
        $_SESSION['information'] = 'Téléchargement terminé avec succès';
    } else {
        $_SESSION['information'] = 'Erreur : Erreur de téléchargement<br>';
    }
}

// Redirection vers galerie.php
header('Location: ../galerie.php');
exit();
?>