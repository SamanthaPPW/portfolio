<?php
session_start();
require __DIR__ . '/includes/i18n.php';
require __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Identifiants SMTP hors du dépôt git (voir includes/config.example.php)
$config = require __DIR__ . '/includes/config.local.php';

function back(): void
{
    header('Location: index.php#contact');
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    back();
}

// Pot de miel : un humain ne voit pas ce champ, un robot le remplit
if (!empty($_POST['website'])) {
    $_SESSION['success'] = t('form.ok');
    back();
}

$name    = trim($_POST['name'] ?? '');
$email   = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $email === '' || $message === '') {
    $_SESSION['error'] = t('form.err.empty');
    back();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $_SESSION['error'] = t('form.err.email');
    back();
}

$name    = mb_substr(str_replace(["\r", "\n"], ' ', $name), 0, 100);
$message = mb_substr($message, 0, 5000);

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = $config['smtp_host'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $config['smtp_user'];
    $mail->Password   = $config['smtp_pass'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = $config['smtp_port'];
    $mail->CharSet    = 'UTF-8';
    $mail->isHTML(false);

    // 1. Le message du visiteur, vers moi
    $mail->setFrom($config['smtp_user'], 'Portfolio');
    $mail->addAddress($config['inbox']);
    $mail->addReplyTo($email, $name);
    $mail->Subject = "Portfolio : message de $name";
    $mail->Body    = "Nom : $name\nEmail : $email\nLangue : $lang\n\n$message";
    $mail->send();

    // 2. Accusé de réception au visiteur. Volontairement sans recopier le message :
    // sinon n'importe qui pourrait faire envoyer un texte libre depuis mon adresse.
    $mail->clearAddresses();
    $mail->clearReplyTos();
    $mail->addAddress($email, $name);
    $mail->Subject = t('mail.subject');
    $mail->Body    = sprintf(t('mail.body'), $name);
    $mail->send();

    $_SESSION['success'] = t('form.ok');
} catch (Exception $e) {
    error_log('Portfolio mail: ' . $mail->ErrorInfo);
    $_SESSION['error'] = t('form.err.send');
}

back();
