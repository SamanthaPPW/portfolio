<?php
session_start();
require __DIR__ . '/includes/i18n.php';

// Retour du formulaire de contact (une seule lecture, puis on vide)
$flash = null;
if (isset($_SESSION['error'])) {
    $flash = ['ko', $_SESSION['error']];
} elseif (isset($_SESSION['success'])) {
    $flash = ['ok', $_SESSION['success']];
}
unset($_SESSION['error'], $_SESSION['success']);
?>
<!DOCTYPE html>
<html lang="<?= $lang ?>">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title><?= t('meta.title') ?></title>
    <meta name="description" content="<?= t('meta.desc') ?>" />
    <meta name="author" content="Samantha PPW" />
    <meta name="theme-color" content="#06061a" />
    <meta property="og:title" content="<?= t('meta.title') ?>" />
    <meta property="og:description" content="<?= t('meta.desc') ?>" />
    <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cdefs%3E%3ClinearGradient id='g'%3E%3Cstop stop-color='%2300d9ff'/%3E%3Cstop offset='1' stop-color='%23ff006e'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='32' height='32' rx='7' fill='%2306061a'/%3E%3Cpath d='M8 11l6 5-6 5' fill='none' stroke='url(%23g)' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M16 22h8' stroke='%23ff006e' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E" />
    <link rel="stylesheet" href="css/styles.css" />
    <script>try{JSON.parse(localStorage.getItem("a11y")||"[]").forEach(function(c){document.documentElement.classList.add("a11y-"+c)})}catch(e){}</script>
    <script src="js/scripts.js" defer></script>
</head>
<body>
<a href="#main" class="skip"><?= t('skip') ?></a>

<header class="top">
    <a href="#main" class="brand" aria-label="Samantha PPW">samantha<span>.ppw</span></a>
    <nav aria-label="<?= t('nav.aria') ?>">
        <ul class="nav">
            <li><a href="#stage"><?= t('nav.stage') ?></a></li>
            <li><a href="#projets"><?= t('nav.projects') ?></a></li>
            <li><a href="#stack"><?= t('nav.stack') ?></a></li>
            <li><a href="#parcours"><?= t('nav.path') ?></a></li>
            <li><a href="#contact"><?= t('nav.contact') ?></a></li>
        </ul>
    </nav>
    <p class="lang" role="group" aria-label="<?= t('lang.label') ?>">
        <a href="?lang=fr" hreflang="fr" lang="fr"<?= $lang === 'fr' ? ' aria-current="true"' : '' ?>>FR</a>
        <a href="?lang=en" hreflang="en" lang="en"<?= $lang === 'en' ? ' aria-current="true"' : '' ?>>EN</a>
    </p>
</header>

<main id="main">

<!-- HERO -->
<section class="hero" aria-labelledby="hero-title">
    <div class="hero-text">
        <p class="status"><?= t('hero.status') ?></p>
        <h1 id="hero-title"><span class="h1-first">Samantha</span> <span class="h1-last">PPW</span></h1>
        <p class="roles"><?= t('hero.lead') ?> <span class="ticker" aria-label="<?= t('hero.roles.aria') ?>"><span aria-hidden="true">back-end</span><span aria-hidden="true">devops</span><span aria-hidden="true">front-end</span></span></p>
        <p class="hero-desc"><?= t('hero.desc') ?></p>
        <p class="cta">
            <a href="#projets" class="btn btn-main"><?= t('hero.cta.projects') ?></a>
            <a href="assets/CV.pdf" class="btn" target="_blank" rel="noopener"><?= t('hero.cta.cv') ?></a>
        </p>
    </div>

    <div class="term" id="term">
        <p class="term-bar"><?= t('term.title') ?></p>
        <div class="term-out" id="termOut" role="log" aria-live="polite"><p><?= t('term.welcome') ?></p></div>
        <form class="term-in" id="termForm" autocomplete="off">
            <label for="termIn" class="prompt"><span class="sr"><?= t('term.label') ?></span>~$</label>
            <input id="termIn" type="text" spellcheck="false" autocapitalize="off" placeholder="<?= t('term.placeholder') ?>" />
        </form>
    </div>
    <p class="hint"><?= t('hero.hint') ?></p>
</section>

<!-- STAGE -->
<section class="sec" id="stage" aria-labelledby="stage-title">
    <header class="sec-head">
        <p class="req"><b>GET</b> /stage <i>200 OK</i></p>
        <h2 id="stage-title"><?= t('stage.title') ?></h2>
    </header>
    <div class="split">
        <div class="prose" data-reveal>
            <p class="big"><?= t('stage.intro') ?></p>
            <p><?= t('stage.p1') ?></p>
            <p><?= t('stage.p2') ?></p>
            <p><?= t('stage.p3') ?></p>
        </div>
        <figure class="code card" data-reveal>
            <figcaption><?= t('stage.file') ?></figcaption>
<pre><code><span class="k">stage</span>:
  <span class="k"><?= t('yml.duration') ?></span>: <span class="s"><?= t('yml.weeks') ?></span>
  <span class="k"><?= t('yml.start') ?></span>: <span class="s"><?= t('yml.may') ?></span>
  <span class="k"><?= t('yml.where') ?></span>: <span class="s"><?= t('yml.places') ?></span>
  <span class="k"><?= t('yml.roles') ?></span>:
    - <span class="s">back-end</span>   <span class="c"><?= t('yml.c.back') ?></span>
    - <span class="s">devops</span>     <span class="c"><?= t('yml.c.ops') ?></span>
    - <span class="s">front-end</span>  <span class="c"><?= t('yml.c.front') ?></span>
  <span class="k"><?= t('yml.status') ?></span>: <span class="n">open_to_work</span></code></pre>
        </figure>
    </div>
</section>

<!-- PROJETS -->
<section class="sec" id="projets" aria-labelledby="work-title">
    <header class="sec-head">
        <p class="req"><b>GET</b> /projets <i>200 OK</i></p>
        <h2 id="work-title"><?= t('work.title') ?></h2>
        <p><?= t('work.intro') ?></p>
    </header>

    <div class="projects">
        <article class="card project" data-reveal>
            <svg class="art art-pend" viewBox="0 0 240 160" aria-hidden="true" focusable="false">
                <path class="pd-rail" d="M12 22H228" />
                <g transform="translate(50 22)"><g class="pd-sw">
                    <path class="pd-hook" d="M0 8V1a4 4 0 1 1 4-4M0 8L-18 18H18Z" />
                    <path class="f-m" d="M-16 18-24 26-19 33-14 29V64H14V29L19 33 24 26 16 18Z" />
                </g></g>
                <g transform="translate(100 22)"><g class="pd-sw">
                    <path class="pd-hook" d="M0 8V1a4 4 0 1 1 4-4M0 8L-18 18H18Z" />
                    <path class="f-b" d="M-10 18-12 34-26 78H26L12 34 10 18Z" />
                </g></g>
                <g transform="translate(150 22)"><g class="pd-sw">
                    <path class="pd-hook" d="M0 8V1a4 4 0 1 1 4-4M0 8L-18 18H18Z" />
                    <path class="f-v" d="M-14 18H14L16 76H4L0 36-4 76H-16Z" />
                </g></g>
                <g transform="translate(200 22)"><g class="pd-sw">
                    <path class="pd-hook" d="M0 8V1a4 4 0 1 1 4-4M0 8L-18 18H18Z" />
                    <path class="f-m" d="M-16 18-22 80H22L16 18 5 20 0 52-5 20Z" />
                </g></g>
            </svg>
            <p class="p-top"><span class="p-num">01</span><span class="badge wip"><?= t('status.wip') ?></span></p>
            <h3><?= t('pend.title') ?></h3>
            <p class="layers" aria-label="<?= t('layers.aria') ?>"><i class="on">front</i><i class="on">back</i><i>ops</i></p>
            <p><?= t('pend.desc') ?></p>
            <p class="fact"><b><?= t('label.role') ?></b> <?= t('pend.role') ?></p>
            <p class="fact"><b><?= t('label.challenge') ?></b> <?= t('pend.challenge') ?></p>
            <p class="tech">Symfony 7.4 · Vue.js · MySQL · shadcn</p>
        </article>

        <article class="card project" data-reveal>
            <svg class="art art-port" viewBox="0 0 200 160" aria-hidden="true" focusable="false">
                <rect class="pl f-b" x="20" y="24" width="60" height="6" rx="3" />
                <rect class="pl f-m" x="32" y="38" width="88" height="6" rx="3" />
                <rect class="pl f-v" x="32" y="52" width="52" height="6" rx="3" />
                <rect class="pl f-b" x="44" y="66" width="70" height="6" rx="3" />
                <rect class="pl f-m" x="44" y="80" width="40" height="6" rx="3" />
                <rect class="pl f-v" x="32" y="94" width="96" height="6" rx="3" />
                <rect class="pl f-b" x="20" y="108" width="30" height="6" rx="3" />
                <rect class="pl-cursor f-m" x="56" y="106" width="3" height="10" />
                <g class="pl-badge">
                    <circle cx="158" cy="116" r="22" />
                    <text x="158" y="125" text-anchor="middle">A</text>
                </g>
            </svg>
            <p class="p-top"><span class="p-num">02</span><span class="badge live"><?= t('status.live') ?></span></p>
            <h3><?= t('port.title') ?></h3>
            <p class="layers" aria-label="<?= t('layers.aria') ?>"><i class="on">front</i><i class="on">back</i><i class="on">ops</i></p>
            <p><?= t('port.desc') ?></p>
            <p class="fact"><b><?= t('label.role') ?></b> <?= t('port.role') ?></p>
            <p class="fact"><b><?= t('label.challenge') ?></b> <?= t('port.challenge') ?></p>
            <p class="tech">PHP · PHPMailer · JavaScript · CSS · Linux</p>
            <a class="go" href="https://github.com/SamanthaPPW" target="_blank" rel="noopener"><?= t('link.source') ?></a>
        </article>

        <article class="card project" data-reveal>
            <svg class="art art-gf" viewBox="0 0 200 160" aria-hidden="true" focusable="false">
                <defs>
                    <g id="gfFrame">
                        <rect class="gf-hole" x="12" y="53" width="7" height="4" rx="1" />
                        <rect class="gf-hole" x="31" y="53" width="7" height="4" rx="1" />
                        <rect class="gf-hole" x="12" y="103" width="7" height="4" rx="1" />
                        <rect class="gf-hole" x="31" y="103" width="7" height="4" rx="1" />
                        <rect class="gf-pic" x="3" y="61" width="44" height="38" rx="2" />
                        <circle class="f-m" cx="36" cy="70" r="4" />
                        <path class="f-b" d="M6 96 20 76 30 88 36 81 45 96Z" />
                    </g>
                </defs>
                <g class="gf-strip">
                    <rect class="gf-band" x="0" y="48" width="300" height="64" />
                    <use href="#gfFrame" /><use href="#gfFrame" x="50" /><use href="#gfFrame" x="100" />
                    <use href="#gfFrame" x="150" /><use href="#gfFrame" x="200" /><use href="#gfFrame" x="250" />
                </g>
                <path class="gf-finder" d="M58 36H44V50M142 36H156V50M58 124H44V110M142 124H156V110" />
                <circle class="gf-rec" cx="18" cy="18" r="4" />
                <text class="gf-label" x="27" y="21">REC · MTL</text>
            </svg>
            <p class="p-top"><span class="p-num">03</span><span class="badge live"><?= t('status.live') ?></span></p>
            <h3><?= t('gf.title') ?></h3>
            <p class="layers" aria-label="<?= t('layers.aria') ?>"><i class="on">front</i><i>back</i><i>ops</i></p>
            <p><?= t('gf.desc') ?></p>
            <p class="fact"><b><?= t('label.role') ?></b> <?= t('gf.role') ?></p>
            <p class="fact"><b><?= t('label.challenge') ?></b> <?= t('gf.challenge') ?></p>
            <p class="tech">HTML · SCSS · JavaScript · Bootstrap</p>
            <a class="go" href="https://globalframes.capython.com" target="_blank" rel="noopener"><?= t('link.site') ?></a>
        </article>

        <article class="card project" data-reveal>
            <svg class="art art-travel" viewBox="0 0 200 160" aria-hidden="true" focusable="false">
                <g class="tr-clouds">
                    <ellipse cx="36" cy="40" rx="16" ry="5" /><ellipse cx="46" cy="36" rx="9" ry="5" />
                    <ellipse cx="112" cy="22" rx="14" ry="4" /><ellipse cx="120" cy="19" rx="7" ry="4" />
                </g>
                <path class="tr-trail" d="M-10 120Q90 40 210 30" />
                <g class="f-b">
                    <rect x="150" y="62" width="22" height="98" />
                    <path d="M147 63H175L161 30Z" />
                    <rect x="160" y="16" width="2" height="16" />
                    <path d="M116 160V114h4v6h4v-6h4v6h4v-6h4v6h4v-6h4v6h4v-6h2v46Z" />
                </g>
                <circle class="tr-clock" cx="161" cy="77" r="8" />
                <path class="tr-hand tr-h" d="M161 77V72" />
                <path class="tr-hand tr-m" d="M161 77V70" />
                <g class="tr-plane"><path class="f-m" d="M-12 -1H8Q14 0 8 2H-12ZM-2 0-9-10H-5L4 0ZM-2 1-9 11H-5L4 1ZM-12 0-15-6H-12L-9 0Z" /></g>
            </svg>
            <p class="p-top"><span class="p-num">04</span></p>
            <h3><?= t('sae.title') ?></h3>
            <p class="layers" aria-label="<?= t('layers.aria') ?>"><i class="on">front</i><i class="on">back</i><i>ops</i></p>
            <p><?= t('sae.desc') ?></p>
            <p class="fact"><b><?= t('label.role') ?></b> <?= t('sae.role') ?></p>
            <p class="fact"><b><?= t('label.challenge') ?></b> <?= t('sae.challenge') ?></p>
            <p class="tech">HTML · CSS · PHP</p>
            <a class="go" href="sae105/index.php"><?= t('link.project') ?></a>
        </article>

        <article class="card project" data-reveal>
            <svg class="art art-tetris" viewBox="0 0 100 170" aria-hidden="true" focusable="false">
                <g class="tt-row f-b">
                    <rect x="0" y="160" width="9" height="9" rx="1.5" /><rect x="10" y="160" width="9" height="9" rx="1.5" />
                    <rect x="20" y="160" width="9" height="9" rx="1.5" /><rect x="70" y="160" width="9" height="9" rx="1.5" />
                    <rect x="80" y="160" width="9" height="9" rx="1.5" /><rect x="90" y="160" width="9" height="9" rx="1.5" />
                </g>
                <g class="tt-stack f-v">
                    <rect x="0" y="150" width="9" height="9" rx="1.5" /><rect x="10" y="150" width="9" height="9" rx="1.5" />
                    <rect x="0" y="140" width="9" height="9" rx="1.5" /><rect x="90" y="150" width="9" height="9" rx="1.5" />
                </g>
                <g class="tt-i f-m">
                    <rect x="30" y="0" width="9" height="9" rx="1.5" /><rect x="40" y="0" width="9" height="9" rx="1.5" />
                    <rect x="50" y="0" width="9" height="9" rx="1.5" /><rect x="60" y="0" width="9" height="9" rx="1.5" />
                </g>
                <g class="tt-t f-b">
                    <rect x="40" y="0" width="9" height="9" rx="1.5" /><rect x="50" y="0" width="9" height="9" rx="1.5" />
                    <rect x="60" y="0" width="9" height="9" rx="1.5" /><rect x="50" y="10" width="9" height="9" rx="1.5" />
                </g>
            </svg>
            <p class="p-top"><span class="p-num">05</span></p>
            <h3><?= t('tet.title') ?></h3>
            <p class="layers" aria-label="<?= t('layers.aria') ?>"><i class="on">front</i><i>back</i><i>ops</i></p>
            <p><?= t('tet.desc') ?></p>
            <p class="fact"><b><?= t('label.role') ?></b> <?= t('tet.role') ?></p>
            <p class="fact"><b><?= t('label.challenge') ?></b> <?= t('tet.challenge') ?></p>
            <p class="tech">JavaScript · HTML · CSS</p>
            <a class="go" href="tetris/index.html?lang=<?= $lang ?>"><?= t('link.play') ?></a>
        </article>
    </div>
</section>

<!-- STACK -->
<section class="sec" id="stack" aria-labelledby="stack-title">
    <header class="sec-head">
        <p class="req"><b>GET</b> /stack <i>200 OK</i></p>
        <h2 id="stack-title"><?= t('stack.title') ?></h2>
        <p><?= t('stack.intro') ?></p>
    </header>
    <dl class="layers-map" data-reveal>
        <div class="tier t-client"><dt><?= t('stack.client') ?></dt><dd>HTML · CSS / SCSS · JavaScript · Bootstrap · <?= t('stack.a11y') ?> · UX/UI · Figma</dd></div>
        <div class="tier t-server"><dt><?= t('stack.server') ?></dt><dd>PHP · Symfony · SQL / MySQL · Python · PHPMailer / SMTP</dd></div>
        <div class="tier t-ops"><dt><?= t('stack.ops') ?></dt><dd>Git · GitHub · Docker · Linux · <?= t('stack.deploy') ?> · <?= t('stack.eco') ?></dd></div>
        <div class="tier t-next"><dt><?= t('stack.next') ?></dt><dd>Vue.js · CI/CD (GitHub Actions)</dd></div>
    </dl>
</section>

<!-- PARCOURS -->
<section class="sec" id="parcours" aria-labelledby="path-title">
    <header class="sec-head">
        <p class="req"><b>GET</b> /parcours <i>200 OK</i></p>
        <h2 id="path-title"><?= t('path.title') ?></h2>
        <p><?= t('path.intro') ?></p>
    </header>
    <div class="split split-path">
        <div class="about" data-reveal>
            <img src="assets/Samphoto.webp" alt="<?= t('path.img.alt') ?>" class="portrait" width="400" height="400" loading="lazy" decoding="async" />
            <p><?= t('path.p1') ?></p>
            <p><?= t('path.p2') ?></p>
            <p class="langs"><b><?= t('path.langs') ?></b> <?= t('path.langs.list') ?></p>
        </div>
        <ol class="log card" data-reveal>
            <li class="head"><b>HEAD</b> <?= t('log.0') ?></li>
            <li><b>3d8a6c2</b> feat(symfony): <?= t('log.1') ?></li>
            <li><b>9f4b1d7</b> feat(shopify): <?= t('log.2') ?></li>
            <li><b>e05b7f1</b> feat(mtl): <?= t('log.3') ?></li>
            <li><b>c94d0a2</b> feat(js): <?= t('log.4') ?></li>
            <li><b>7b2e410</b> feat(php): <?= t('log.5') ?></li>
            <li><b>a1f3c9e</b> init: <?= t('log.6') ?></li>
        </ol>
    </div>
</section>

<!-- CONTACT -->
<section class="sec" id="contact" aria-labelledby="contact-title">
    <header class="sec-head">
        <p class="req"><b>POST</b> /contact <i>201</i></p>
        <h2 id="contact-title"><?= t('contact.title') ?></h2>
        <p><?= t('contact.intro') ?></p>
    </header>
    <div class="split split-contact">
        <form method="post" action="traitement_formulaire.php" class="card req-form" id="contactForm" data-reveal>
            <?php if ($flash): ?>
            <p class="flash flash-<?= $flash[0] ?>" role="<?= $flash[0] === 'ok' ? 'status' : 'alert' ?>"><?= htmlspecialchars($flash[1]) ?></p>
            <?php endif; ?>
            <p class="req-line">POST /contact HTTP/1.1</p>
            <label for="f-name"><?= t('form.name') ?>:</label>
            <input id="f-name" name="name" type="text" autocomplete="name" required maxlength="100" />
            <label for="f-email"><?= t('form.email') ?>:</label>
            <input id="f-email" name="email" type="email" autocomplete="email" required maxlength="150" />
            <label for="f-msg"><?= t('form.message') ?>:</label>
            <textarea id="f-msg" name="message" rows="5" required maxlength="5000"></textarea>
            <label class="hp" aria-hidden="true"><?= t('form.honeypot') ?> <input name="website" tabindex="-1" autocomplete="off" /></label>
            <button type="submit" class="btn btn-main"><?= t('form.send') ?></button>
        </form>
        <ul class="links" data-reveal>
            <li><a href="mailto:samantha.ppw@gmail.com">samantha.ppw@gmail.com</a></li>
            <li><a href="https://linkedin.com/in/samantha-pacheco-pires-wiss-b67a972b8" target="_blank" rel="noopener">LinkedIn</a></li>
            <li><a href="https://github.com/SamanthaPPW" target="_blank" rel="noopener">GitHub</a></li>
            <li><a href="assets/CV.pdf" target="_blank" rel="noopener"><?= t('hero.cta.cv') ?></a></li>
            <li><?= t('contact.location') ?></li>
        </ul>
    </div>
</section>

</main>

<footer class="foot">
    <p>© 2026 Samantha PPW · <?= t('footer.built') ?></p>
    <a href="#main"><?= t('footer.top') ?> ↑</a>
</footer>

<button type="button" class="a11y-btn" id="a11yBtn" aria-label="<?= t('a11y.button') ?>" aria-expanded="false" aria-controls="a11y"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="4.5" r="2.2" /><path d="M4 8.5 12 10l8-1.5M12 10v5m0 0-3.5 6.5M12 15l3.5 6.5" /></svg></button>
<button type="button" class="eco-btn" id="ecoBtn" aria-label="<?= t('eco.button') ?>" aria-expanded="false" aria-controls="eco" hidden>A</button>
<script type="application/json" id="i18n"><?= json_encode([
    'lang' => $lang,
    'eco'  => [
        'title' => t('eco.title'), 'live' => t('eco.live'), 'dom' => t('eco.dom'),
        'req' => t('eco.req'), 'size' => t('eco.size'), 'score' => t('eco.score'),
        'more' => t('eco.more'), 'close' => t('eco.close'),
    ],
    'a11y' => [
        'title' => t('a11y.title'), 'big' => t('a11y.big'), 'contrast' => t('a11y.contrast'),
        'calm' => t('a11y.calm'), 'dys' => t('a11y.dys'), 'links' => t('a11y.links'),
        'reset' => t('a11y.reset'), 'note' => t('a11y.note'), 'close' => t('eco.close'),
    ],
    'bug' => [
        'label' => t('bug.label'), 'fixed' => t('bug.fixed'), 'hint' => t('bug.hint'),
        'done' => t('bug.done'), 'cta' => t('bug.cta'),
    ],
], JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP) ?></script>
</body>
</html>
