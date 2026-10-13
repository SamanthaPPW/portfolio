<?php
// Gestion des langues : FR (par défaut) et EN.
// À inclure APRÈS session_start().

const SUPPORTED_LANGS = ['fr', 'en'];

function detect_lang(): string
{
    // 1. Choix explicite : ?lang=en
    if (isset($_GET['lang']) && in_array($_GET['lang'], SUPPORTED_LANGS, true)) {
        $_SESSION['lang'] = $_GET['lang'];
    }

    // 2. Choix mémorisé pendant la session
    if (!empty($_SESSION['lang']) && in_array($_SESSION['lang'], SUPPORTED_LANGS, true)) {
        return $_SESSION['lang'];
    }

    // 3. Langue du navigateur (anglais seulement si c'est la première préférence)
    $accept = strtolower($_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? '');
    return substr($accept, 0, 2) === 'en' ? 'en' : 'fr';
}

$lang = detect_lang();

// On charge le français comme base, puis la langue choisie par-dessus :
// si une clé manque en anglais, le français s'affiche au lieu d'une clé brute.
$strings = require __DIR__ . '/../lang/fr.php';
if ($lang !== 'fr') {
    $strings = array_merge($strings, require __DIR__ . '/../lang/' . $lang . '.php');
}

function t(string $key): string
{
    global $strings;
    return $strings[$key] ?? $key;
}
