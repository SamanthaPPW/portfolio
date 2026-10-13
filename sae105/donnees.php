<?php
$pageTitle = 'Données';
$extraHead = '<link rel="stylesheet" href="https://cdn.datatables.net/1.13.7/css/jquery.dataTables.css">';
require 'header.php';
?>
  <main>
    <h1>LIEUX INCONTOURNABLES A VISITER</h1>
    <div id="containertableau">
    <?php
    // Déclaration du fichier et de son chemin
    $fichier = 'datas/table.json';
    // Lecture du fichier JSON
    $tablieuxJSON = file_get_contents($fichier);
    // Décodage JSON en tableau PHP
    $tablieuxPHP = json_decode($tablieuxJSON, true);
    // Vérification et parcours des données
    echo '<table id="tableau">';
      echo '<thead>';
        echo '<tr>';
          echo '<th>ID</th>';
          echo '<th>Lieu de visite</th>';
          echo '<th>Prix (en £)</th>';
          echo '<th>Date de Création</th>';
          echo '<th>Restaurant le plus proche</th>';
          echo '<th>Horaires</th>';
          echo '<th>Distance à pied du centre</th>';
          echo '</tr>';
        echo '</thead>';
      echo '<tbody>';
        foreach ($tablieuxPHP as $lieu) {
          echo '<tr>';
          echo '<td>'.$lieu['id'].'</td>';
          echo '<td>'.$lieu['Lieu de visite'].'</td>';
          echo '<td>'.$lieu['Prix (en £)'].'</td>';
          echo '<td>'.$lieu['Date de Creation'].'</td>';
          echo '<td>'.$lieu['Restaurant le plus proche'].'</td>';
          echo '<td>'.$lieu['Horaires'].'</td>';
          echo '<td>'.$lieu['Distance a pied du centre'].'</td>';
          echo '</tr>';
        }
        echo '</tbody>';
      echo '</table>';
    ?>
    </div>
    <br>
    <h1>TOUS LES LIEUX SONT AUTOUR DE LONDRES</h1>
  </main>

  <?php
  // Appel du Pied de Page
  require('footer.php');
  ?>

  <script src="https://code.jquery.com/jquery-3.7.0.js"></script>
  <script src="https://cdn.datatables.net/1.13.7/js/jquery.dataTables.js"></script>
  <script>
    $(document).ready(function () {
        $('#tableau').DataTable({
            paging: true,
            scrollY: 500,
            pageLength: 10,
            scrollCollapse: true,
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/French.json'
            }
        });
    });
    document.querySelectorAll('.paginate_button').forEach(button => {
    button.style.color = "#b6cdff";
});

  </script>
