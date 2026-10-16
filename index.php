<?php
session_start();
require __DIR__ . '/includes/i18n.php';
?>
<!DOCTYPE html>
<html lang="<?= $lang ?>">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="<?= t('meta.desc') ?>" />
    <meta name="author" content="Samantha PPW" />
    <title><?= t('meta.title') ?></title>
    <link rel="icon" type="image/x-icon" href="assets/favicon.ico" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
    <link href="styles/styles.css" rel="stylesheet" />
</head>
<body>

    <a href="#work" class="skip-link"><?= t('skip') ?></a>

    <!-- HEADER / NAV -->
    <header class="site-header">
        <nav class="navbar" aria-label="<?= t('nav.aria') ?>">
            <div class="nav-container">
                <a href="#" class="nav-brand">Samantha PPW</a>
                <button class="nav-toggle" id="navToggle"
                        aria-label="<?= t('nav.open') ?>" aria-controls="navMenu"
                        data-label-open="<?= t('nav.open') ?>" data-label-close="<?= t('nav.close') ?>">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <ul class="nav-menu" id="navMenu">
                    <li><a href="#work"><?= t('nav.projects') ?></a></li>
                    <li><a href="#about"><?= t('nav.about') ?></a></li>
                    <li><a href="#contact"><?= t('nav.contact') ?></a></li>
                    <li class="lang-switch" role="group" aria-label="<?= t('lang.label') ?>">
                        <a href="?lang=fr" lang="fr" hreflang="fr"<?= $lang === 'fr' ? ' aria-current="true"' : '' ?>>FR</a>
                        <span aria-hidden="true">/</span>
                        <a href="?lang=en" lang="en" hreflang="en"<?= $lang === 'en' ? ' aria-current="true"' : '' ?>>EN</a>
                    </li>
                </ul>
            </div>
        </nav>
    </header>

    <main>

    <!-- HERO -->
    <section class="hero">
        <div class="hero-container">
            <div class="hero-content">
                <h1>Samantha PPW</h1>
                <p class="hero-subtitle"><?= t('hero.sub') ?></p>
                <p class="hero-description"><?= t('hero.desc') ?></p>
                <div class="hero-cta">
                    <a href="#work" class="btn btn-primary"><?= t('hero.projects') ?></a>
                    <a href="assets/CV.pdf" target="_blank" rel="noopener" class="btn btn-secondary"><?= t('hero.cv') ?></a>
                </div>
            </div>
            <div class="hero-side">
                <img src="assets/Samphoto.jpg" alt="<?= t('hero.img.alt') ?>" class="hero-image" width="400" height="400" />
            </div>
        </div>
    </section>

    <!-- PROJETS WEB -->
    <section class="section" id="work">
        <div class="container">
            <div class="section-header">
                <h2><?= t('work.title') ?></h2>
                <p><?= t('work.intro') ?></p>
            </div>

            <div class="projects-grid">

                <!-- PENDERIE -->
                <article class="project-card">
                    <div class="project-image">
                        <img src="assets/img/penderie.png" alt="<?= t('pend.img.alt') ?>" width="600" height="400" loading="lazy" />
                    </div>
                    <div class="project-content">
                        <div class="project-meta">
                            <span class="meta-tag">Symfony</span>
                            <span class="meta-tag meta-tag-status"><?= t('pend.tag') ?></span>
                        </div>
                        <h3><?= t('pend.title') ?></h3>
                        <p><?= t('pend.desc') ?></p>
                        <dl class="project-facts">
                            <div><dt><?= t('label.context') ?></dt><dd><?= t('pend.context') ?></dd></div>
                            <div><dt><?= t('label.role') ?></dt><dd><?= t('pend.role') ?></dd></div>
                            <div><dt><?= t('label.tech') ?></dt><dd><?= t('pend.tech') ?></dd></div>
                            <div><dt><?= t('label.challenge') ?></dt><dd><?= t('pend.challenge') ?></dd></div>
                            <div><dt><?= t('label.status') ?></dt><dd><?= t('pend.status') ?></dd></div>
                        </dl>
                        <div class="project-actions">
                            <!-- À activer quand la démo est en ligne :
                            <a href="URL-DEMO" target="_blank" rel="noopener" class="link-arrow">Demo →</a> -->
                            <!-- <a href="https://github.com/SamanthaPPW/REPO-PENDERIE" target="_blank" rel="noopener" class="link-arrow">GitHub →</a> -->
                        </div>
                    </div>
                </article>

                <!-- MEDIAPIPE DANCE GAME -->
                <article class="project-card project-reverse">
                    <div class="project-image">
                        <img src="assets/img/mediapipe.webp" alt="<?= t('mp.img.alt') ?>" width="600" height="400" loading="lazy" />
                    </div>
                    <div class="project-content">
                        <div class="project-meta">
                            <span class="meta-tag">MediaPipe</span>
                            <span class="meta-tag"><?= t('mp.tag') ?></span>
                        </div>
                        <h3><?= t('mp.title') ?></h3>
                        <p><?= t('mp.desc') ?></p>
                        <dl class="project-facts">
                            <div><dt><?= t('label.context') ?></dt><dd><?= t('mp.context') ?></dd></div>
                            <div><dt><?= t('label.role') ?></dt><dd><?= t('mp.role') ?></dd></div>
                            <div><dt><?= t('label.tech') ?></dt><dd><?= t('mp.tech') ?></dd></div>
                            <div><dt><?= t('label.challenge') ?></dt><dd><?= t('mp.challenge') ?></dd></div>
                        </dl>
                        <div class="project-actions">
                            <a href="https://samanthappw.fr/mediapipe/index.html" target="_blank" rel="noopener" class="link-arrow"><?= t('link.game') ?></a>
                            <a href="https://lnkd.in/p/ensxu3y9" target="_blank" rel="noopener" class="link-arrow"><?= t('link.post') ?></a>
                        </div>
                    </div>
                </article>

                <!-- GLOBAL FRAMES -->
                <article class="project-card">
                    <div class="project-image">
                        <img src="assets/img/globalframes.png" alt="<?= t('gf.img.alt') ?>" width="600" height="400" loading="lazy" />
                    </div>
                    <div class="project-content">
                        <div class="project-meta">
                            <span class="meta-tag">Front-end</span>
                            <span class="meta-tag"><?= t('gf.tag') ?></span>
                        </div>
                        <h3><?= t('gf.title') ?></h3>
                        <p><?= t('gf.desc') ?></p>
                        <dl class="project-facts">
                            <div><dt><?= t('label.context') ?></dt><dd><?= t('gf.context') ?></dd></div>
                            <div><dt><?= t('label.role') ?></dt><dd><?= t('gf.role') ?></dd></div>
                            <div><dt><?= t('label.tech') ?></dt><dd><?= t('gf.tech') ?></dd></div>
                            <div><dt><?= t('label.challenge') ?></dt><dd><?= t('gf.challenge') ?></dd></div>
                        </dl>
                        <div class="project-actions">
                            <a href="https://globalframes.capython.com" target="_blank" rel="noopener" class="link-arrow"><?= t('link.site') ?></a>
                            <!-- <a href="https://github.com/SamanthaPPW/REPO-GLOBALFRAMES" target="_blank" rel="noopener" class="link-arrow">GitHub →</a> -->
                        </div>
                    </div>
                </article>

                <!-- SAE105 -->
                <article class="project-card project-reverse">
                    <div class="project-image">
                        <img src="assets/img/sae105.png" alt="<?= t('sae.img.alt') ?>" width="600" height="400" loading="lazy" />
                    </div>
                    <div class="project-content">
                        <div class="project-meta">
                            <span class="meta-tag">PHP / MySQL</span>
                            <span class="meta-tag"><?= t('sae.tag') ?></span>
                        </div>
                        <h3><?= t('sae.title') ?></h3>
                        <p><?= t('sae.desc') ?></p>
                        <dl class="project-facts">
                            <div><dt><?= t('label.context') ?></dt><dd><?= t('sae.context') ?></dd></div>
                            <div><dt><?= t('label.role') ?></dt><dd><?= t('sae.role') ?></dd></div>
                            <div><dt><?= t('label.tech') ?></dt><dd><?= t('sae.tech') ?></dd></div>
                            <div><dt><?= t('label.challenge') ?></dt><dd><?= t('sae.challenge') ?></dd></div>
                        </dl>
                        <div class="project-actions">
                            <a href="sae105/index.php" class="link-arrow"><?= t('link.project') ?></a>
                            <!-- <a href="https://github.com/SamanthaPPW/REPO-SAE105" target="_blank" rel="noopener" class="link-arrow">GitHub →</a> -->
                        </div>
                    </div>
                </article>

                <!-- TETRIS -->
                <article class="project-card">
                    <div class="project-image">
                        <img src="assets/img/tetris.png" alt="<?= t('tet.img.alt') ?>" width="600" height="400" loading="lazy" />
                    </div>
                    <div class="project-content">
                        <div class="project-meta">
                            <span class="meta-tag">JavaScript</span>
                        </div>
                        <h3><?= t('tet.title') ?></h3>
                        <p><?= t('tet.desc') ?></p>
                        <dl class="project-facts">
                            <div><dt><?= t('label.context') ?></dt><dd><?= t('tet.context') ?></dd></div>
                            <div><dt><?= t('label.tech') ?></dt><dd><?= t('tet.tech') ?></dd></div>
                            <div><dt><?= t('label.challenge') ?></dt><dd><?= t('tet.challenge') ?></dd></div>
                        </dl>
                        <div class="project-actions">
                            <a href="tetris/index.html" class="link-arrow"><?= t('link.play') ?></a>
                            <!-- <a href="https://github.com/SamanthaPPW/REPO-TETRIS" target="_blank" rel="noopener" class="link-arrow">GitHub →</a> -->
                        </div>
                    </div>
                </article>

            </div>
        </div>
    </section>

    <!-- À PROPOS -->
    <section class="section section-dark" id="about">
        <div class="container">
            <div class="about-grid">
                <div class="about-content">
                    <h2><?= t('about.title') ?></h2>
                    <p><?= t('about.p1') ?></p>
                    <p><?= t('about.p2') ?></p>
                    <p><?= t('about.p3') ?></p>
                    <div class="about-cta">
                        <a href="assets/CV.pdf" target="_blank" rel="noopener" class="btn btn-primary"><?= t('about.cv') ?></a>
                        <a href="#contact" class="btn btn-secondary"><?= t('about.contact') ?></a>
                    </div>
                </div>

                <div class="skills-section">
                    <h3><?= t('skills.title') ?></h3>
                    <div class="skills-group">
                        <h4><?= t('skills.front') ?></h4>
                        <ul class="skill-list">
                            <li>HTML</li>
                            <li>CSS / SCSS</li>
                            <li>JavaScript</li>
                            <li>Vue.js</li>
                            <li>Bootstrap</li>
                        </ul>
                    </div>
                    <div class="skills-group">
                        <h4><?= t('skills.back') ?></h4>
                        <ul class="skill-list">
                            <li>PHP</li>
                            <li>MySQL</li>
                            <li>Symfony</li>
                        </ul>
                    </div>
                    <div class="skills-group">
                        <h4><?= t('skills.tools') ?></h4>
                        <ul class="skill-list">
                            <li>Git</li>
                            <li>GitHub</li>
                            <li>VS Code</li>
                            <li>Figma</li>
                            <li>Adobe</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CONTACT -->
    <section class="section" id="contact">
        <div class="container">
            <div class="section-header">
                <h2><?= t('contact.title') ?></h2>
                <p><?= t('contact.intro') ?></p>
            </div>

            <div class="contact-grid">
                <div class="contact-info">
                    <h3><?= t('contact.direct') ?></h3>
                    <p>
                        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        <a href="mailto:samantha.ppw@gmail.com">samantha.ppw@gmail.com</a>
                    </p>
                    <p>
                        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        <?= t('contact.location') ?>
                    </p>
                    <p><a href="https://linkedin.com/in/samantha-pacheco-pires-wiss-b67a972b8" target="_blank" rel="noopener">LinkedIn</a></p>
                    <p><a href="https://github.com/SamanthaPPW" target="_blank" rel="noopener">GitHub</a></p>
                </div>

                <div class="contact-form-wrapper">
                    <?php if (isset($_SESSION['error'])): ?>
                        <p class="form-alert alert-error" role="alert"><?= htmlspecialchars($_SESSION['error']); unset($_SESSION['error']); ?></p>
                    <?php endif; ?>
                    <?php if (isset($_SESSION['success'])): ?>
                        <p class="form-alert alert-success" role="status"><?= htmlspecialchars($_SESSION['success']); unset($_SESSION['success']); ?></p>
                    <?php endif; ?>

                    <form method="POST" action="traitement_formulaire.php" class="contact-form">
                        <div class="form-group">
                            <label for="name"><?= t('form.name') ?></label>
                            <input id="name" name="name" type="text" autocomplete="name" required />
                        </div>
                        <div class="form-group">
                            <label for="email"><?= t('form.email') ?></label>
                            <input id="email" name="email" type="email" autocomplete="email" required />
                        </div>
                        <div class="form-group">
                            <label for="message"><?= t('form.message') ?></label>
                            <textarea id="message" name="message" rows="6" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary w-100"><?= t('form.send') ?></button>
                    </form>
                </div>
            </div>
        </div>
    </section>

    </main>

    <!-- FOOTER -->
    <footer class="site-footer">
        <div class="container">
            <div class="footer-content">
                <div>
                    <strong>Samantha PPW</strong>
                    <p><?= t('footer.role') ?></p>
                </div>
                <div>
                    <p><a href="#work"><?= t('nav.projects') ?></a> · <a href="#about"><?= t('nav.about') ?></a> · <a href="#contact"><?= t('nav.contact') ?></a></p>
                </div>
                <div>
                    <p><?= t('footer.built') ?></p>
                </div>
            </div>
        </div>
    </footer>

    <!-- ECOINDEX -->
    <button type="button" id="ecoindex_toggle_button" aria-label="<?= t('eco.button') ?>">A</button>
    <aside class="ecoindex" id="ecoindex_sidebar" aria-label="<?= t('eco.aside') ?>">
        <h2><?= t('eco.title') ?></h2>
        <div id="ecoindex_notes">
            <p id="ecoindex_lettre">A</p>
            <p id="ecoindex_score"><?= t('eco.score') ?></p>
        </div>
        <p><strong><?= t('eco.avg') ?></strong> 50-65</p>
        <h3><?= t('eco.what') ?></h3>
        <p><?= t('eco.p1') ?></p>
        <p><?= t('eco.p2') ?></p>
        <p><a href="https://www.ecoindex.fr" target="_blank" rel="noopener"><?= t('eco.more') ?></a></p>
        <p class="credits"><?= t('eco.test') ?></p>
    </aside>

    <script>
    // Burger + EcoIndex : script autonome, ne dépend d'aucun autre fichier JS.
    (function () {
        var navToggle = document.getElementById('navToggle');
        var navMenu = document.getElementById('navMenu');

        if (navToggle && navMenu) {
            var labelOpen = navToggle.getAttribute('data-label-open');
            var labelClose = navToggle.getAttribute('data-label-close');
            var setMenu = function (open) {
                navMenu.classList.toggle('active', open);
                navToggle.setAttribute('aria-expanded', String(open));
                navToggle.setAttribute('aria-label', open ? labelClose : labelOpen);
            };
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.addEventListener('click', function () {
                setMenu(!navMenu.classList.contains('active'));
            });
            navMenu.querySelectorAll('a[href^="#"]').forEach(function (link) {
                link.addEventListener('click', function () { setMenu(false); });
            });
        }

        var ecoButton = document.getElementById('ecoindex_toggle_button');
        var ecoPanel = document.getElementById('ecoindex_sidebar');

        if (ecoButton && ecoPanel) {
            var setEco = function (open) {
                ecoPanel.classList.toggle('active', open);
                ecoButton.setAttribute('aria-expanded', String(open));
            };
            ecoButton.setAttribute('aria-expanded', 'false');
            ecoButton.addEventListener('click', function (event) {
                event.stopPropagation();
                setEco(!ecoPanel.classList.contains('active'));
            });
            document.addEventListener('click', function (event) {
                if (!ecoPanel.contains(event.target)) setEco(false);
            });
            document.addEventListener('keydown', function (event) {
                if (event.key === 'Escape') setEco(false);
            });
        }
    })();
    </script>
</body>
</html>