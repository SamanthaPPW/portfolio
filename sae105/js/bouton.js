// Ouvre / ferme le menu de navigation
var navButton = document.getElementById('navheader');
var sidebar = document.getElementById('sidebar');

navButton.addEventListener('click', function () {
  var open = sidebar.classList.toggle('visible');
  navButton.setAttribute('aria-expanded', String(open));
});
