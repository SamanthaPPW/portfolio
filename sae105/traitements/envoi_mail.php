<?php
session_start();
$_SESSION['information'] = '';

// Vérification des données du formulaire
$affichage_retour = '';
$erreurs = 0;

// Nettoyage : on retire les retours à la ligne (anti-injection d'en-têtes) et les espaces
function champ($nom) {
    return trim(str_replace(["\r", "\n"], ' ', $_POST[$nom] ?? ''));
}

$nom     = champ('nom');
$prenom  = champ('prenom');
$email   = champ('email');
$demande = champ('demande');
$message = trim($_POST['message'] ?? '');

// Vérification du champ nom
if ($nom === '') {
    $affichage_retour .= 'Le champ NOM est obligatoire<br>';
    $erreurs++;
}

// Vérification du champ prénom
if ($prenom === '') {
    $affichage_retour .= 'Le champ PRÉNOM est obligatoire<br>';
    $erreurs++;
}

// Vérification de l'adresse mail
if ($email === '') {
    $affichage_retour .= 'Le champ EMAIL est obligatoire<br>';
    $erreurs++;
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $affichage_retour .= 'Adresse mail incorrecte<br>';
    $erreurs++;
}

// Vérification du champ demande (seulement les 3 valeurs prévues)
$motifs = [
    'info'   => 'les informations sur les différents lieux de Londres.',
    'guide'  => 'une visite guidée à Londres.',
    'voyage' => 'comment voyager à Londres.',
];
if (!isset($motifs[$demande])) {
    $affichage_retour .= 'Le champ DEMANDE est obligatoire<br>';
    $erreurs++;
}

// Si aucune erreur, on envoie les e-mails
if ($erreurs == 0) {
    $nom = ucfirst(mb_substr($nom, 0, 60));
    $prenom = ucfirst(mb_substr($prenom, 0, 60));
    $message = mb_substr($message, 0, 3000);

    // Tout ce qui vient du visiteur est échappé avant d'aller dans un e-mail HTML
    $h_nom = htmlspecialchars($nom);
    $h_prenom = htmlspecialchars($prenom);
    $h_email = htmlspecialchars($email);
    $h_message = $message !== '' ? nl2br(htmlspecialchars($message)) : '<em>(pas de message)</em>';
    $demande_message = $motifs[$demande];

    // Mail de contact (pour moi)
    $subject_contact = 'SAE105 : demande de ' . $prenom . ' ' . $nom;
    $message_contact = "
    <html>
    <body style='background-color: #f4f4f4; padding: 20px;'>
        <div style='background-color: #ffffff; padding: 20px; border-radius: 5px;'>
            <h1 style='color: #333;'>Demande de contact</h1>
            <p><strong>Nom :</strong> $h_nom</p>
            <p><strong>Prénom :</strong> $h_prenom</p>
            <p><strong>Email :</strong> $h_email</p>
            <p><strong>Motif de la demande :</strong> $demande</p>
            <p><strong>Message :</strong><br>$h_message</p>
        </div>
    </body>
    </html>";

    // L'expéditeur est le site (sinon le mail passe pour usurpé) ; on répond au visiteur via Reply-To
    $headers_contact = "From: mmi24f08@mmi-troyes.fr\r\n";
    $headers_contact .= "Reply-To: $email\r\n";
    $headers_contact .= "Content-Type: text/html; charset=UTF-8\r\n";

    $email_dest_contact = "mmi24f08@mmi-troyes.fr";

    if (mail($email_dest_contact, $subject_contact, $message_contact, $headers_contact)) {
        // Mail de confirmation (pour le visiteur)
        $subject_confirmation = 'Confirmation pour ' . $prenom . ' ' . $nom;
        $message_confirmation = "
        <html>
        <body style='background-color:#c0c3dd; padding: 20px;'>
            <div style='background-color: #ffffff; padding: 20px; border-radius: 5px;'>
                <h1 style='color: #333;'>Confirmation de réception</h1>
                <p>Bonjour $h_prenom $h_nom !<br>Nous vous confirmons la réception de votre demande concernant $demande_message Nous vous recontacterons dans les plus brefs délais.</p>
            </div>
        </body>
        </html>";

        $headers_confirmation = "From: mmi24f08@mmi-troyes.fr\r\n";
        $headers_confirmation .= "Reply-To: noreply@mmi-troyes.fr\r\n";
        $headers_confirmation .= "Content-Type: text/html; charset=UTF-8\r\n";

        if (mail($email, $subject_confirmation, $message_confirmation, $headers_confirmation)) {
            $affichage_retour = '<span class="success">Votre demande a bien été envoyée.</span>';
        } else {
            $affichage_retour = '<span class="error">Votre demande a été envoyée, mais l\'e-mail de confirmation n\'a pas pu partir.</span>';
        }
    } else {
        // On n'affiche pas l'erreur technique au visiteur, on la garde dans les logs
        error_log('SAE105 mail : ' . (error_get_last()['message'] ?? 'erreur inconnue'));
        $affichage_retour = '<span class="error">Échec de l\'envoi du message. Réessayez plus tard.</span>';
    }
} else {
    $affichage_retour = '<span class="error">Veuillez corriger les erreurs suivantes :<br>' . $affichage_retour . '</span>';
}

// Stockage du message dans la session et redirection
$_SESSION['information'] = $affichage_retour;
header('Location: ../contact.php');
exit();
