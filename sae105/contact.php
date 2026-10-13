<?php
session_start();
$pageTitle = 'Contact';
require 'header.php';
?>

<main>
<h1>Contact</h1>
<h2> Vous souhaitez nous contacter ? Envoyez-nous un message en remplissant le formulaire ci-dessous. Nous vous répondrons dans les plus bref délais. </h2>
<div id="formu">
<form action="traitements/envoi_mail.php" method="post">
  <div id="np">
    <div class="champs">
      <label for="prenom">Prénom : <span>*</span></label>
      <input type="text" id="prenom" name="prenom" required placeholder="John">
    </div>

    <div class="champs">
      <label for="nom">Nom : <span>*</span></label>
      <input type="text" id="nom" name="nom" required placeholder="Doe">
    </div>
  </div>

  <label for="email">Email : <span>*</span></label>
  <input type="email" id="email" name="email" placeholder="nom@domaine.fr" required>

  <label for="message">Message :</label>
  <textarea id="message" name="message" placeholder="Votre message..." maxlength="3000"></textarea>
  <p id="motif">Quel est le motif de demande ? <span>*</span></p>
<input type="radio" id="info" name="demande" value="info" class="radio-input" required>
<label for="info" class="radio-label">Informations sur les lieux</label><br>

<input type="radio" id="guide" name="demande" value="guide" class="radio-input">
<label for="guide" class="radio-label">Visite guidée</label><br>

<input type="radio" id="voyage" name="demande" value="voyage" class="radio-input">
<label for="voyage" class="radio-label">Comment voyager à Londres ?</label>

  <input class="envoie" type="submit" value="Envoyer">

  <p id="obli">Les champs marqués d'un * sont obligatoires.</p>
  <?php
if (isset($_SESSION['information'])) {
echo '<p role="status">'.$_SESSION['information'].'</p>'."\n";
unset($_SESSION['information']);
}
?>
</form>
</div>
</main>


<?php
// Appel du Pied de Page
require ('footer.php');
?>
