// Portfolio Samantha PPW : terminal, navigation, EcoIndex en direct.
// Aucune dépendance, aucune requête supplémentaire.
(function () {
    'use strict';

    document.documentElement.classList.add('js');

    var I18N = JSON.parse(document.getElementById('i18n').textContent);
    var FR = I18N.lang === 'fr';
    var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Animations coupées par le système OU par le panneau d'accessibilité
    function calm() { return motionQuery.matches || document.documentElement.classList.contains('a11y-calm'); }

    /* ======================================================
       Progression de lecture + lien actif dans la nav
       ====================================================== */
    var top = document.querySelector('.top');
    var ticking = false;

    function onScroll() {
        var max = document.documentElement.scrollHeight - innerHeight;
        top.style.setProperty('--p', max > 0 ? (scrollY / max).toFixed(4) : 0);
        ticking = false;
    }
    addEventListener('scroll', function () {
        if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
    onScroll();

    var navLinks = document.querySelectorAll('.nav a');

    if ('IntersectionObserver' in window) {
        var sectionObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                navLinks.forEach(function (a) {
                    var on = a.getAttribute('href') === '#' + entry.target.id;
                    a.classList.toggle('on', on);
                    if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        document.querySelectorAll('.sec').forEach(function (s) { sectionObs.observe(s); });

        var revealObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    revealObs.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px' });
        document.querySelectorAll('[data-reveal]').forEach(function (el) { revealObs.observe(el); });
    } else {
        document.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('in'); });
    }

    /* ======================================================
       Spotlight : la lumière suit le pointeur sur les cartes
       ====================================================== */
    document.addEventListener('pointermove', function (e) {
        var card = e.target.closest && e.target.closest('.card');
        if (!card) return;
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });

    /* ======================================================
       EcoIndex mesuré en direct (formule officielle ecoindex.fr)
       ====================================================== */
    var Q_DOM = [0, 47, 75, 159, 233, 298, 358, 417, 476, 537, 603, 674, 753, 843, 949, 1076, 1237, 1459, 1801, 2479, 594601];
    var Q_REQ = [0, 2, 15, 25, 34, 42, 49, 56, 63, 70, 78, 86, 95, 105, 117, 130, 147, 170, 205, 281, 3920];
    var Q_SIZE = [0, 1.37, 144.7, 319.53, 479.46, 631.97, 783.38, 937.91, 1098.62, 1265.47, 1448.32, 1648.27, 1876.08, 2142.06, 2465.37, 2866.31, 3401.59, 4155.73, 5400.08, 8037.54, 223212.26];
    var GRADES = [[80, 'A', '#3ddc84'], [70, 'B', '#9be15d'], [55, 'C', '#ffd27a'], [40, 'D', '#ffb347'], [25, 'E', '#ff8a4c'], [10, 'F', '#ff5f57'], [-1, 'G', '#ff2d55']];

    function quantile(q, v) {
        for (var i = 1; i < q.length; i++) {
            if (v < q[i]) return i - 1 + (v - q[i - 1]) / (q[i] - q[i - 1]);
        }
        return q.length - 1;
    }

    function measureEco() {
        var nav = performance.getEntriesByType('navigation')[0];
        var res = performance.getEntriesByType('resource');
        var bytes = nav ? (nav.transferSize || nav.encodedBodySize || 0) : 0;
        res.forEach(function (r) { bytes += r.transferSize || r.encodedBodySize || 0; });

        var dom = document.getElementsByTagName('*').length - document.querySelectorAll('svg *').length;
        var req = res.length + 1;
        var kb = bytes / 1024;
        var score = Math.round(100 - 5 * (3 * quantile(Q_DOM, dom) + 2 * quantile(Q_REQ, req) + quantile(Q_SIZE, kb)) / 6);
        var g = GRADES.find(function (x) { return score > x[0]; });
        return { dom: dom, req: req, kb: kb, score: score, grade: g[1], color: g[2] };
    }

    var ecoBtn = document.getElementById('ecoBtn');
    var ecoPanel = null;

    function el(tag, cls, text) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text != null) n.textContent = text;
        return n;
    }

    function paintEcoButton(m) {
        ecoBtn.textContent = m.grade;
        ecoBtn.style.setProperty('--eco', m.color);
    }

    function openEco(open) {
        if (open && !ecoPanel) {
            ecoPanel = el('div', 'eco-panel');
            ecoPanel.id = 'eco';
            ecoPanel.setAttribute('role', 'dialog');
            ecoPanel.setAttribute('aria-label', I18N.eco.title);
            ecoPanel.innerHTML =
                '<button type="button" class="eco-close"></button>' +
                '<h2></h2><p class="eco-grade"><b></b><span></span></p>' +
                '<dl><div><dt></dt><dd></dd></div><div><dt></dt><dd></dd></div><div><dt></dt><dd></dd></div></dl>' +
                '<p></p><p><a href="https://www.ecoindex.fr" target="_blank" rel="noopener"></a></p>';
            var close = ecoPanel.querySelector('.eco-close');
            close.textContent = '×';
            close.setAttribute('aria-label', I18N.eco.close);
            close.addEventListener('click', function () { openEco(false); ecoBtn.focus(); });
            ecoPanel.querySelector('h2').textContent = I18N.eco.title;
            ecoPanel.querySelectorAll('p')[1].textContent = I18N.eco.live;
            ecoPanel.querySelector('a').textContent = I18N.eco.more;
            var dts = ecoPanel.querySelectorAll('dt');
            dts[0].textContent = I18N.eco.dom;
            dts[1].textContent = I18N.eco.req;
            dts[2].textContent = I18N.eco.size;
            document.body.appendChild(ecoPanel);
        }
        if (!ecoPanel) return;
        if (open && typeof openA11y === 'function') openA11y(false);
        if (open) {
            var m = measureEco();
            paintEcoButton(m);
            ecoPanel.style.setProperty('--eco', m.color);
            ecoPanel.querySelector('.eco-grade b').textContent = m.grade;
            ecoPanel.querySelector('.eco-grade span').textContent = I18N.eco.score + ' ' + m.score + '/100';
            var dds = ecoPanel.querySelectorAll('dd');
            dds[0].textContent = m.dom;
            dds[1].textContent = m.req;
            dds[2].textContent = m.kb.toFixed(0) + ' Ko';
        }
        ecoPanel.hidden = !open;
        ecoBtn.setAttribute('aria-expanded', String(open));
    }

    ecoBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        openEco(!ecoPanel || ecoPanel.hidden);
    });
    document.addEventListener('click', function (e) {
        if (ecoPanel && !ecoPanel.hidden && !ecoPanel.contains(e.target)) openEco(false);
    });

    function whenLoaded(fn) {
        if (document.readyState === 'complete') setTimeout(fn, 0);
        else addEventListener('load', function () { setTimeout(fn, 0); });
    }
    whenLoaded(function () {
        paintEcoButton(measureEco());
        ecoBtn.hidden = false;
    });

    /* ======================================================
       Accessibilité : réglages gardés dans le navigateur
       ====================================================== */
    var A11Y_OPTS = ['big', 'contrast', 'calm', 'dys', 'links'];
    var a11yBtn = document.getElementById('a11yBtn');
    var a11yPanel = null;
    var root = document.documentElement;

    function saveA11y() {
        var on = A11Y_OPTS.filter(function (o) { return root.classList.contains('a11y-' + o); });
        try { localStorage.setItem('a11y', JSON.stringify(on)); } catch (e) { /* stockage indisponible : tant pis */ }
    }

    function openA11y(open) {
        if (open && !a11yPanel) {
            a11yPanel = el('div', 'a11y-panel');
            a11yPanel.id = 'a11y';
            a11yPanel.setAttribute('role', 'dialog');
            a11yPanel.setAttribute('aria-label', I18N.a11y.title);

            var close = el('button', 'eco-close', '×');
            close.type = 'button';
            close.setAttribute('aria-label', I18N.a11y.close);
            close.addEventListener('click', function () { openA11y(false); a11yBtn.focus(); });
            a11yPanel.appendChild(close);
            a11yPanel.appendChild(el('h2', null, I18N.a11y.title));

            var list = el('ul');
            A11Y_OPTS.forEach(function (opt) {
                var b = el('button', null, I18N.a11y[opt]);
                b.type = 'button';
                b.setAttribute('aria-pressed', String(root.classList.contains('a11y-' + opt)));
                b.addEventListener('click', function () {
                    var on = root.classList.toggle('a11y-' + opt);
                    b.setAttribute('aria-pressed', String(on));
                    saveA11y();
                });
                var li = el('li');
                li.appendChild(b);
                list.appendChild(li);
            });
            a11yPanel.appendChild(list);

            var reset = el('button', 'a11y-reset', I18N.a11y.reset);
            reset.type = 'button';
            reset.addEventListener('click', function () {
                A11Y_OPTS.forEach(function (o) { root.classList.remove('a11y-' + o); });
                list.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
                saveA11y();
            });
            a11yPanel.appendChild(reset);
            a11yPanel.appendChild(el('p', null, I18N.a11y.note));
            document.body.appendChild(a11yPanel);
        }
        if (!a11yPanel) return;
        if (open) openEco(false);
        a11yPanel.hidden = !open;
        a11yBtn.setAttribute('aria-expanded', String(open));
        if (open) a11yPanel.querySelector('li button').focus();
    }

    a11yBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        openA11y(!a11yPanel || a11yPanel.hidden);
    });
    document.addEventListener('click', function (e) {
        if (a11yPanel && !a11yPanel.hidden && !a11yPanel.contains(e.target)) openA11y(false);
    });

    /* Easter egg : la photo tourne au clic, s'arrête au clic suivant */
    var portrait = document.querySelector('.portrait');
    if (portrait) {
        portrait.addEventListener('click', function () {
            if (calm()) return;
            portrait.classList.toggle('spin');
        });
    }

    /* ======================================================
       Mini-jeu : 5 bugs se cachent dans la page
       ====================================================== */
    var BUG_SPOTS = [
        ['.hero-text', 'right:6%;top:2%'],
        ['.code', 'right:12%;top:62%'],
        ['#projets .project:nth-child(5)', 'left:58%;top:1.1rem'],
        ['.t-ops', 'right:5%;top:22%'],
        ['.log', 'right:7%;bottom:10%']
    ];
    var BUG_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><ellipse cx="12" cy="14.5" rx="5" ry="6.5"/><circle cx="12" cy="6.5" r="3"/><path fill="none" d="M7 11 3 9M7 15H3M7 18.5 4 21.5M17 11l4-2M17 15h4M17 18.5l3 3M10.5 4 8.5 1.5M13.5 4l2-2.5"/></svg>';
    var bugsFound = 0;
    var toast = null;
    var toastTimer = 0;

    function showToast(html, win) {
        if (!toast) {
            toast = el('div', 'toast');
            toast.setAttribute('role', 'status');
            document.body.appendChild(toast);
        }
        toast.className = 'toast' + (win ? ' win' : '');
        toast.innerHTML = html;
        toast.hidden = false;
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toast.hidden = true; }, win ? 9000 : 3500);
    }

    function sparkle(x, y, count) {
        if (calm()) return;
        for (var i = 0; i < count; i++) {
            var s = el('span', 'spark', '✦');
            var angle = (i / count) * Math.PI * 2;
            var dist = 30 + Math.random() * (count > 8 ? 90 : 30);
            s.style.left = x + 'px';
            s.style.top = y + 'px';
            s.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
            s.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
            document.body.appendChild(s);
            setTimeout(s.remove.bind(s), 1000);
        }
    }

    BUG_SPOTS.forEach(function (spot) {
        var host = document.querySelector(spot[0]);
        if (!host) return;
        if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
        var bug = el('button', 'bug');
        bug.type = 'button';
        bug.tabIndex = -1;
        bug.title = I18N.bug.label;
        bug.setAttribute('aria-hidden', 'true');
        bug.style.cssText = spot[1];
        bug.innerHTML = BUG_SVG;
        bug.addEventListener('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            bug.classList.add('squashed');
            setTimeout(bug.remove.bind(bug), 500);
            bugsFound++;
            var total = BUG_SPOTS.length;
            if (bugsFound < total) {
                sparkle(e.clientX, e.clientY, 6);
                showToast('<b>fix #' + bugsFound + '</b> ' + I18N.bug.fixed + ' · ' + bugsFound + '/' + total, false);
            } else {
                sparkle(e.clientX, e.clientY, 18);
                showToast('<b>' + total + '/' + total + ' ✓</b> ' + I18N.bug.done + ' <a href="#contact">' + I18N.bug.cta + ' →</a>', true);
            }
        });
        host.appendChild(bug);
    });

    /* ======================================================
       Terminal
       ====================================================== */
    var out = document.getElementById('termOut');
    var form = document.getElementById('termForm');
    var input = document.getElementById('termIn');

    var SECTIONS = {
        '~': 'main', stage: 'stage', internship: 'stage', projets: 'projets', projects: 'projets',
        stack: 'stack', parcours: 'parcours', journey: 'parcours', contact: 'contact'
    };

    var TXT = FR ? {
        help: [
            ['whoami', 'qui je suis'],
            ['stage', 'le stage que je cherche'],
            ['projets', 'ce que j’ai construit'],
            ['stack', 'mes technos, par couche'],
            ['contact', 'me joindre'],
            ['cv', 'ouvrir mon CV'],
            ['cd <section>', 'aller à une section'],
            ['eco', 'mesurer l’EcoIndex de cette page'],
            ['tetris', 'faire une pause'],
            ['lang en', 'switch to English'],
            ['hello', 'dire bonjour'],
            ['jeu', 'inconnu'],
            ['bugs', 'où en est la chasse aux bugs'],
            ['clear', 'vider le terminal']
        ],
        helpFoot: 'Astuce : Tab complète, ↑ ↓ parcourent l’historique. Et il y a peut-être une commande sudo…',
        whoami: 'Samantha PPW, développeuse full-stack basée à Troyes.\nJe vise un stage en back-end, DevOps ou front-end.',
        projects: 'Projets',
        goto: 'cd projets pour les voir en grand.',
        stackLines: [['client', 'HTML · CSS/SCSS · JavaScript · Bootstrap · UX/UI'], ['serveur', 'PHP · Symfony · SQL/MySQL · Python'], ['ops', 'Git · GitHub · Docker · Linux · SFTP'], ['next', 'Vue.js · CI/CD']],
        hello: 'kikou :)',
        gameHelp: 'Espace, ↑ ou un tap pour sauter · Échap pour quitter',
        gameRetry: 'Espace pour rejouer',
        gameBye: 'Partie terminée. Meilleur score : ',
        gameAria: 'Mini-jeu : un dinosaure saute par-dessus des cactus',
        bugsLeft: 'bugs corrigés : ',
        cv: 'Ouverture de CV.pdf…',
        cdErr: 'cd : section inconnue. Sections : stage, projets, stack, parcours, contact',
        unknown: 'commande introuvable : ',
        tryHelp: ' (tape help)',
        sudoNo: 'samantha n’est pas dans le fichier sudoers. Cet incident sera signalé.\n(indice : sudo hire-me)',
        sudoPwd: '[sudo] mot de passe pour recruteur : ********',
        sudoOk: '✓ Accès accordé. Ouverture de POST /contact avec un brouillon…',
        draft: 'Bonjour Samantha,\n\nNous aimerions vous proposer un stage de 18 semaines à partir du 12 avril 2027.\n\n',
        rm: 'Permission refusée. Joli essai.',
        exit: 'Il n’y a pas de sortie, seulement des stages.',
        ecoHead: 'EcoIndex de cette page, mesuré maintenant :',
        ecoDom: 'éléments DOM', ecoReq: 'requêtes', ecoSize: 'transférés',
        ecoNote: 'Plus tu tapes de commandes, plus le DOM grossit. Fais « clear » pour rester en A.',
        tetris: 'Chargement de Tetris…',
        langSame: 'Déjà en français.'
    } : {
        help: [
            ['whoami', 'who I am'],
            ['stage', 'the internship I’m after'],
            ['projects', 'what I built'],
            ['stack', 'my tech, by layer'],
            ['contact', 'reach me'],
            ['cv', 'open my résumé'],
            ['cd <section>', 'jump to a section'],
            ['eco', 'measure this page’s EcoIndex'],
            ['tetris', 'take a break'],
            ['lang fr', 'passer en français'],
            ['hello', 'say hi'],
            ['game', 'unknown'],
            ['bugs', 'bug hunt progress'],
            ['clear', 'clear the terminal']
        ],
        helpFoot: 'Tip: Tab completes, ↑ ↓ browse history. And there might be a sudo command…',
        whoami: 'Samantha PPW, full-stack developer based in Troyes, France.\nAiming for a back-end, DevOps or front-end internship.',
        projects: 'Projects',
        goto: 'cd projects to see them full size.',
        stackLines: [['client', 'HTML · CSS/SCSS · JavaScript · Bootstrap · UX/UI'], ['server', 'PHP · Symfony · SQL/MySQL · Python'], ['ops', 'Git · GitHub · Docker · Linux · SFTP'], ['next', 'Vue.js · CI/CD']],
        hello: 'hiya :)',
        gameHelp: 'Space, ↑ or tap to jump · Esc to quit',
        gameRetry: 'Space to play again',
        gameBye: 'Game over. Best score: ',
        gameAria: 'Mini-game: a dinosaur jumps over cacti',
        bugsLeft: 'bugs fixed: ',
        cv: 'Opening CV.pdf…',
        cdErr: 'cd: unknown section. Sections: stage, projects, stack, journey, contact',
        unknown: 'command not found: ',
        tryHelp: ' (type help)',
        sudoNo: 'samantha is not in the sudoers file. This incident will be reported.\n(hint: sudo hire-me)',
        sudoPwd: '[sudo] password for recruiter: ********',
        sudoOk: '✓ Access granted. Opening POST /contact with a draft…',
        draft: 'Hello Samantha,\n\nWe would like to offer you an 18-week internship starting on April 12, 2027.\n\n',
        rm: 'Permission denied. Nice try.',
        exit: 'There is no exit, only internships.',
        ecoHead: 'This page’s EcoIndex, measured right now:',
        ecoDom: 'DOM elements', ecoReq: 'requests', ecoSize: 'transferred',
        ecoNote: 'The more commands you type, the bigger the DOM. Run “clear” to stay in A.',
        tetris: 'Loading Tetris…',
        langSame: 'Already in English.'
    };

    var PROJECTS = [
        ['01', 'Penderie', 'Symfony 7.4 · Vue.js · MySQL'],
        ['02', FR ? 'Ce portfolio' : 'This portfolio', 'PHP · JS · Linux · EcoIndex A'],
        ['03', 'Global Frames', 'HTML · SCSS · JS · Bootstrap'],
        ['04', FR ? 'Carnet de voyage' : 'Travel journal', 'HTML · CSS · PHP'],
        ['05', 'Tetris', 'JavaScript']
    ];

    var YAML = FR
        ? 'stage:\n  durée: 18 semaines\n  début: 12 avril 2027\n  lieu: [France, Union européenne]\n  postes: [back-end, devops, front-end]\n  statut: open_to_work'
        : 'internship:\n  duration: 18 weeks\n  start: 2027-04-12\n  location: [France, European Union]\n  roles: [back-end, devops, front-end]\n  status: open_to_work';

    function print(text, cls) {
        var p = el('p', cls, text);
        out.appendChild(p);
        return p;
    }

    function printLink(label, href, external) {
        var p = el('p');
        var a = el('a', null, label);
        a.href = href;
        if (external) { a.target = '_blank'; a.rel = 'noopener'; }
        p.appendChild(a);
        out.appendChild(p);
    }

    function pad(s, n) { while (s.length < n) s += ' '; return s; }

    function scrollTo(id) {
        var target = document.getElementById(id);
        if (target) target.scrollIntoView({ behavior: calm() ? 'auto' : 'smooth' });
    }

    /* ======================================================
       Commande secrète « jeu » : un dino façon hors-ligne,
       dessiné dans un <canvas> à l'intérieur du terminal
       ====================================================== */
    var DINO = [
        '      ########',
        '      ## #####',
        '      ########',
        '      ########',
        '      #####   ',
        '      ######  ',
        '#    #####    ',
        '##  #######   ',
        '### ##### #   ',
        '#########     ',
        ' ########     ',
        '  ######      '
    ];
    var LEGS = [
        ['   ## ##      ', '   #   #      ', '   ##  ##     '],
        ['   ##  #      ', '   #   ##     ', '   ##         '],
        ['   #  ##      ', '   ##  #      ', '        ##    ']
    ];
    var game = null;
    var hiScore = 0;

    function startGame() {
        if (game) game.stop();

        var cv = el('canvas', 'dino');
        cv.setAttribute('role', 'img');
        cv.setAttribute('aria-label', TXT.gameAria);
        out.appendChild(cv);
        print(TXT.gameHelp, 'acc');
        out.scrollTop = out.scrollHeight;

        var css = getComputedStyle(root);
        var C = {
            dino: css.getPropertyValue('--magenta').trim(),
            cactus: css.getPropertyValue('--blue').trim(),
            ground: css.getPropertyValue('--line-2').trim(),
            text: css.getPropertyValue('--muted').trim(),
            mono: css.getPropertyValue('--mono').trim()
        };

        var W = cv.clientWidth || 300;
        var H = 110;
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        cv.width = W * dpr;
        cv.height = H * dpr;
        var ctx = cv.getContext('2d');
        ctx.scale(dpr, dpr);

        var PX = 2;                      // taille d'un « pixel » du dino
        var GROUND = H - 12;
        var dino = { x: 16, y: 0, vy: 0, w: 14 * PX, h: 15 * PX };
        var cacti, speed, score, spawn, over, t;
        var raf = 0, last = 0, active = true, visible = true;

        function reset() {
            cacti = [];
            speed = 4.2;
            score = 0;
            spawn = 120;
            over = false;
            t = 0;
            dino.y = 0;
            dino.vy = 0;
        }

        function jump() {
            if (over) { reset(); return; }
            if (dino.y === 0) dino.vy = 7.6;
        }

        function addCactus() {
            var big = Math.random() < .35;
            var h = big ? 30 : 18 + Math.random() * 10;
            cacti.push({ x: W + 10, w: big ? 22 : 14, h: h, twin: big });
        }

        function hit(c) {
            var dx = dino.x + 6, dy = GROUND - dino.y - dino.h + 4;
            var dw = dino.w - 12, dh = dino.h - 8;
            return dx < c.x + c.w - 2 && dx + dw > c.x + 2 && dy + dh > GROUND - c.h + 2;
        }

        function update(dt) {
            t += dt;
            speed += .002 * dt;
            score += .12 * dt * speed / 4;

            dino.vy -= .5 * dt;
            dino.y += dino.vy * dt;
            if (dino.y <= 0) { dino.y = 0; dino.vy = 0; }

            spawn -= speed * dt;
            if (spawn <= 0) { addCactus(); spawn = 170 + Math.random() * 230; }
            cacti.forEach(function (c) { c.x -= speed * dt; });
            cacti = cacti.filter(function (c) { return c.x + c.w > -4; });

            if (cacti.some(hit)) {
                over = true;
                hiScore = Math.max(hiScore, Math.floor(score));
            }
        }

        function drawCactus(c) {
            ctx.fillStyle = C.cactus;
            function one(x, h) {
                var y = GROUND - h;
                ctx.fillRect(x + 4, y, 6, h);                          // tronc
                ctx.fillRect(x, y + h * .3, 3, h * .35);               // bras gauche
                ctx.fillRect(x, y + h * .6, 6, 3);
                ctx.fillRect(x + 11, y + h * .2, 3, h * .3);           // bras droit
                ctx.fillRect(x + 8, y + h * .45, 6, 3);
            }
            one(c.x, c.h);
            if (c.twin) one(c.x + 9, c.h * .7);
        }

        function draw() {
            ctx.clearRect(0, 0, W, H);

            // sol + petits cailloux qui défilent
            ctx.fillStyle = C.ground;
            ctx.fillRect(0, GROUND, W, 1);
            for (var i = 0; i < W / 26; i++) {
                var gx = (i * 53 - t * speed) % W;
                if (gx < 0) gx += W;
                ctx.fillRect(gx, GROUND + 4 + (i % 3) * 2, 2 + (i % 2) * 2, 1);
            }

            cacti.forEach(drawCactus);

            // dino
            ctx.fillStyle = C.dino;
            var top = GROUND - dino.y - dino.h;
            var legs = dino.y > 0 || over ? LEGS[0] : LEGS[1 + (Math.floor(t / 6) % 2)];
            DINO.concat(legs).forEach(function (row, r) {
                for (var col = 0; col < row.length; col++) {
                    if (row[col] === '#') ctx.fillRect(dino.x + col * PX, top + r * PX, PX, PX);
                }
            });

            // score
            ctx.fillStyle = C.text;
            ctx.font = '12px ' + C.mono;
            ctx.textAlign = 'right';
            var pad = function (n) { return ('00000' + Math.floor(n)).slice(-5); };
            ctx.fillText((hiScore ? 'HI ' + pad(hiScore) + '  ' : '') + pad(score), W - 6, 16);

            if (over) {
                ctx.textAlign = 'center';
                ctx.fillStyle = C.dino;
                ctx.font = '700 14px ' + C.mono;
                ctx.fillText('GAME OVER', W / 2, 44);
                ctx.fillStyle = C.text;
                ctx.font = '12px ' + C.mono;
                ctx.fillText(TXT.gameRetry, W / 2, 64);
            }
        }

        function frame(now) {
            if (!active || !visible) { raf = 0; return; }
            raf = requestAnimationFrame(frame);
            var dt = last ? Math.min((now - last) / 16.67, 3) : 1;
            last = now;
            if (!over) update(dt);
            draw();
        }

        // On met en pause quand le terminal sort de l'écran
        var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
            visible = entries[0].isIntersecting;
            if (visible && active && !raf) { last = 0; raf = requestAnimationFrame(frame); }
        }) : null;
        if (io) io.observe(cv);

        cv.addEventListener('pointerdown', function (e) { e.preventDefault(); jump(); });

        reset();
        raf = requestAnimationFrame(frame);

        game = {
            jump: jump,
            stop: function () {
                active = false;
                if (raf) cancelAnimationFrame(raf);
                if (io) io.disconnect();
                hiScore = Math.max(hiScore, Math.floor(score));
                game = null;
            }
        };
    }

    var COMMANDS = {
        help: function () {
            TXT.help.forEach(function (h) {
                var p = el('p');
                p.appendChild(el('span', 'acc', pad(h[0], 14)));
                p.appendChild(document.createTextNode(h[1]));
                out.appendChild(p);
            });
            print(TXT.helpFoot, 'mag');
        },
        whoami: function () { print(TXT.whoami); },
        stage: function () { print(YAML, 'acc'); },
        projets: function () {
            PROJECTS.forEach(function (p) {
                var line = el('p');
                line.appendChild(el('span', 'mag', p[0] + '  '));
                line.appendChild(document.createTextNode(pad(p[1], 16)));
                line.appendChild(el('span', 'acc', p[2]));
                out.appendChild(line);
            });
            print(TXT.goto);
        },
        stack: function () {
            TXT.stackLines.forEach(function (s) {
                var line = el('p');
                line.appendChild(el('span', s[0] === 'next' ? 'ok' : 'acc', pad(s[0], 9)));
                line.appendChild(document.createTextNode(s[1]));
                out.appendChild(line);
            });
        },
        contact: function () {
            printLink('samantha.ppw@gmail.com', 'mailto:samantha.ppw@gmail.com');
            printLink('linkedin.com/in/samantha-pacheco-pires-wiss', 'https://linkedin.com/in/samantha-pacheco-pires-wiss-b67a972b8', true);
            printLink('github.com/SamanthaPPW', 'https://github.com/SamanthaPPW', true);
        },
        cv: function () {
            print(TXT.cv, 'ok');
            window.open('assets/CV.pdf', '_blank', 'noopener');
        },
        cd: function (args) {
            var id = SECTIONS[(args[0] || '~').replace(/^\/|\/$/g, '').toLowerCase()];
            if (id) scrollTo(id); else print(TXT.cdErr, 'err');
        },
        eco: function () {
            var m = measureEco();
            paintEcoButton(m);
            print(TXT.ecoHead);
            var p = el('p');
            var g = el('span', null, m.grade + '  ' + m.score + '/100');
            g.style.color = m.color;
            p.appendChild(g);
            out.appendChild(p);
            print(m.dom + ' ' + TXT.ecoDom + ' · ' + m.req + ' ' + TXT.ecoReq + ' · ' + m.kb.toFixed(0) + ' Ko ' + TXT.ecoSize, 'acc');
            print(TXT.ecoNote);
        },
        tetris: function () {
            print(TXT.tetris, 'ok');
            setTimeout(function () { location.href = 'tetris/index.html?lang=' + I18N.lang; }, 500);
        },
        lang: function (args) {
            var l = (args[0] || '').toLowerCase();
            if (l !== 'fr' && l !== 'en') { print('lang fr | lang en', 'err'); return; }
            if (l === I18N.lang) { print(TXT.langSame); return; }
            location.href = '?lang=' + l;
        },
        sudo: function (args) {
            var what = args.join(' ').toLowerCase();
            if (what !== 'hire-me' && what !== 'embauche' && what !== 'hire me') { print(TXT.sudoNo, 'err'); return; }
            print(TXT.sudoPwd);
            input.disabled = true;
            setTimeout(function () {
                print(TXT.sudoOk, 'ok');
                setTimeout(function () {
                    input.disabled = false;
                    var msg = document.getElementById('f-msg');
                    if (msg && !msg.value) msg.value = TXT.draft;
                    scrollTo('contact');
                    setTimeout(function () { msg && msg.focus({ preventScroll: true }); }, calm() ? 0 : 700);
                }, calm() ? 0 : 700);
            }, calm() ? 0 : 800);
        },
        rm: function () { print(TXT.rm, 'err'); },
        exit: function () { print(TXT.exit); },
        date: function () { print(new Date().toLocaleString(I18N.lang)); },
        echo: function (args) { print(args.join(' ')); },
        history: function () { history.forEach(function (h, i) { print(pad(String(i + 1), 4) + h); }); },
        hello: function () { print(TXT.hello, 'mag'); },
        bugs: function () {
            print(TXT.bugsLeft + bugsFound + '/' + BUG_SPOTS.length, bugsFound === BUG_SPOTS.length ? 'ok' : 'acc');
            if (bugsFound < BUG_SPOTS.length) print(I18N.bug.hint);
        },
        jeu: startGame,
        clear: function () { out.textContent = ''; }
    };

    // Alias
    COMMANDS.projects = COMMANDS.ls = COMMANDS.projets;
    COMMANDS.internship = COMMANDS.stage;
    COMMANDS.cat = function (args) {
        if (/^(stage|internship)\.yml$/.test(args[0] || '')) COMMANDS.stage();
        else print('cat: ' + (args[0] || '') + ': No such file', 'err');
    };
    COMMANDS.man = COMMANDS.help;
    COMMANDS.game = COMMANDS.dino = COMMANDS.jeu;
    COMMANDS.hi = COMMANDS.salut = COMMANDS.bonjour = COMMANDS.hello;

    var NAMES = Object.keys(COMMANDS);
    var history = [];
    var cursor = 0;

    function run(raw) {
        var line = raw.trim();
        if (game) game.stop();
        print(line, 'cmd');
        if (line) {
            history.push(line);
            cursor = history.length;
            var parts = line.split(/\s+/);
            var name = parts.shift().toLowerCase();
            if (COMMANDS.hasOwnProperty(name)) COMMANDS[name](parts);
            else print(TXT.unknown + name + TXT.tryHelp, 'err');
        }
        out.scrollTop = out.scrollHeight;
    }

    function submit(e) {
        e.preventDefault();
        run(input.value);
        input.value = '';
    }
    form.addEventListener('submit', submit);

    input.addEventListener('keydown', function (e) {
        // Pendant une partie : Espace / ↑ / Entrée (champ vide) font sauter, Échap quitte
        if (game && !input.value && (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'Enter')) {
            e.preventDefault();
            game.jump();
            return;
        }
        if (game && e.key === 'Escape') {
            e.stopPropagation();
            game.stop();
            print(TXT.gameBye + hiScore, 'mag');
            out.scrollTop = out.scrollHeight;
            return;
        }
        if (e.key === 'Enter' && !e.isComposing) {
            submit(e);
        } else if (e.key === 'ArrowUp' && cursor > 0) {
            input.value = history[--cursor];
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            cursor = Math.min(cursor + 1, history.length);
            input.value = history[cursor] || '';
            e.preventDefault();
        } else if (e.key === 'Tab' && input.value && input.value.indexOf(' ') < 0) {
            var match = NAMES.filter(function (n) { return n.indexOf(input.value.toLowerCase()) === 0; });
            if (match.length) {
                e.preventDefault();
                if (match.length === 1) { input.value = match[0] + ' '; return; }
                // Plusieurs candidats : on complète le préfixe commun et on les liste
                var common = match.reduce(function (a, b) {
                    var i = 0;
                    while (i < a.length && a[i] === b[i]) i++;
                    return a.slice(0, i);
                });
                if (common.length > input.value.length) { input.value = common; return; }
                print(input.value, 'cmd');
                print(match.join('  '), 'acc');
                out.scrollTop = out.scrollHeight;
            }
        }
    });

    // Cliquer n'importe où dans le terminal donne le focus à la saisie
    document.getElementById('term').addEventListener('click', function (e) {
        if (!e.target.closest('a') && !getSelection().toString()) input.focus({ preventScroll: true });
    });

    // Raccourci « / » pour ouvrir le terminal, Échap pour fermer l'EcoIndex
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (ecoPanel && !ecoPanel.hidden) { openEco(false); ecoBtn.focus(); return; }
            if (a11yPanel && !a11yPanel.hidden) { openA11y(false); a11yBtn.focus(); return; }
        }
        if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
        var tag = (document.activeElement && document.activeElement.tagName) || '';
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        e.preventDefault();
        scrollTo('main');
        input.focus({ preventScroll: true });
    });

    // Démo au chargement : on « tape » whoami tout seul
    whenLoaded(function () {
        if (calm()) { run('whoami'); return; }
        var word = 'whoami';
        var placeholder = input.placeholder;
        var i = 0;
        // Si le visiteur prend la main pendant la démo, on s'arrête net
        function stop() { input.value = ''; input.placeholder = placeholder; }
        input.placeholder = '';
        setTimeout(function typeNext() {
            if (document.activeElement === input) { stop(); return; }
            input.value = word.slice(0, ++i);
            if (i < word.length) { setTimeout(typeNext, 90 + Math.random() * 80); return; }
            setTimeout(function () {
                if (document.activeElement !== input) run(word);
                stop();
            }, 350);
        }, 700);
    });
})();
