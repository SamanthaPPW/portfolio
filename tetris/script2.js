// Tetris en JavaScript natif, sans bibliothèque.
(function () {
    'use strict';

    var COLS = 10;
    var ROWS = 20;
    var CELL = 30;

    var PIECES = {
        I: { color: '#00d9ff', shape: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]] },
        O: { color: '#ffd27a', shape: [[1, 1], [1, 1]] },
        T: { color: '#9b5cff', shape: [[0, 1, 0], [1, 1, 1], [0, 0, 0]] },
        S: { color: '#3ddc84', shape: [[0, 1, 1], [1, 1, 0], [0, 0, 0]] },
        Z: { color: '#ff006e', shape: [[1, 1, 0], [0, 1, 1], [0, 0, 0]] },
        J: { color: '#4f6bff', shape: [[1, 0, 0], [1, 1, 1], [0, 0, 0]] },
        L: { color: '#ff8a4c', shape: [[0, 0, 1], [1, 1, 1], [0, 0, 0]] }
    };
    var LINE_POINTS = [0, 100, 300, 500, 800];

    /* ---------- Langue (FR par défaut, EN si demandé) ---------- */
    var param = new URLSearchParams(location.search).get('lang');
    var EN = param ? param === 'en' : /^en/i.test(navigator.language || '');
    var T = EN ? {
        back: '← Portfolio', start: 'Enter or button to play', play: 'Play', next: 'Next',
        lines: 'Lines', level: 'Level', best: 'Best', controls: 'Controls',
        'k.move': 'move', 'k.rotate': 'rotate', 'k.soft': 'soft drop', 'k.drop': 'hard drop', 'k.pause': 'pause',
        paused: 'Paused', resume: 'Resume', over: 'Game over', again: 'Play again', newBest: 'New record!'
    } : {
        paused: 'Pause', resume: 'Reprendre', over: 'Perdu', again: 'Rejouer', newBest: 'Nouveau record !'
    };
    if (EN) {
        document.documentElement.lang = 'en';
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var k = el.getAttribute('data-i18n');
            if (T[k]) el.textContent = T[k];
        });
    }

    /* ---------- Éléments ---------- */
    var board = document.getElementById('board');
    var ctx = board.getContext('2d');
    var nextCv = document.getElementById('next');
    var nctx = nextCv.getContext('2d');
    var overlay = document.getElementById('overlay');
    var overlayTitle = document.getElementById('overlayTitle');
    var overlayText = document.getElementById('overlayText');
    var startBtn = document.getElementById('startBtn');
    var out = {
        score: document.getElementById('score'),
        lines: document.getElementById('lines'),
        level: document.getElementById('level'),
        best: document.getElementById('best')
    };

    // Netteté sur écrans haute densité
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    board.width = COLS * CELL * dpr;
    board.height = ROWS * CELL * dpr;
    ctx.scale(dpr, dpr);
    nextCv.width = 96 * dpr;
    nextCv.height = 96 * dpr;
    nctx.scale(dpr, dpr);

    /* ---------- État ---------- */
    var grid, piece, nextType, bag, score, lines, level, state;
    var dropTimer = 0, last = 0, flash = null;
    var best = 0;
    try { best = parseInt(localStorage.getItem('tetris-best'), 10) || 0; } catch (e) { best = 0; }

    function emptyGrid() {
        var g = [];
        for (var r = 0; r < ROWS; r++) g.push(new Array(COLS).fill(null));
        return g;
    }

    // Sac de 7 : chaque pièce sort une fois avant de revenir
    function takeFromBag() {
        if (!bag.length) {
            bag = Object.keys(PIECES);
            for (var i = bag.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var tmp = bag[i]; bag[i] = bag[j]; bag[j] = tmp;
            }
        }
        return bag.pop();
    }

    function spawn() {
        var type = nextType;
        nextType = takeFromBag();
        var shape = PIECES[type].shape.map(function (row) { return row.slice(); });
        piece = { type: type, shape: shape, x: Math.floor((COLS - shape[0].length) / 2), y: type === 'I' ? -1 : 0 };
        if (collides(piece.shape, piece.x, piece.y)) gameOver();
        drawNext();
    }

    function collides(shape, x, y) {
        for (var r = 0; r < shape.length; r++) {
            for (var c = 0; c < shape[r].length; c++) {
                if (!shape[r][c]) continue;
                var gx = x + c, gy = y + r;
                if (gx < 0 || gx >= COLS || gy >= ROWS) return true;
                if (gy >= 0 && grid[gy][gx]) return true;
            }
        }
        return false;
    }

    function rotate(shape) {
        var n = shape.length;
        var res = [];
        for (var r = 0; r < n; r++) {
            res.push([]);
            for (var c = 0; c < n; c++) res[r].push(shape[n - 1 - c][r]);
        }
        return res;
    }

    /* ---------- Actions ---------- */
    function move(dx) {
        if (!collides(piece.shape, piece.x + dx, piece.y)) piece.x += dx;
    }

    function turn() {
        if (piece.type === 'O') return;
        var rotated = rotate(piece.shape);
        // « Wall kicks » simplifiés : on essaie de décaler si la rotation touche un mur
        var kicks = [0, -1, 1, -2, 2];
        for (var i = 0; i < kicks.length; i++) {
            if (!collides(rotated, piece.x + kicks[i], piece.y)) {
                piece.shape = rotated;
                piece.x += kicks[i];
                return;
            }
        }
    }

    function softDrop() {
        if (!collides(piece.shape, piece.x, piece.y + 1)) {
            piece.y++;
            score += 1;
            dropTimer = 0;
            updateStats();
        } else {
            lock();
        }
    }

    function hardDrop() {
        var d = 0;
        while (!collides(piece.shape, piece.x, piece.y + 1)) { piece.y++; d++; }
        score += d * 2;
        lock();
    }

    function lock() {
        piece.shape.forEach(function (row, r) {
            row.forEach(function (v, c) {
                if (v && piece.y + r >= 0) grid[piece.y + r][piece.x + c] = PIECES[piece.type].color;
            });
        });
        var full = [];
        grid.forEach(function (row, r) { if (row.every(Boolean)) full.push(r); });
        if (full.length) {
            // Petit flash avant de retirer les lignes
            flash = { rows: full, until: performance.now() + 140 };
            piece = null;
        } else {
            spawn();
        }
        updateStats();
    }

    function clearLines(rows) {
        rows.forEach(function (r) {
            grid.splice(r, 1);
            grid.unshift(new Array(COLS).fill(null));
        });
        lines += rows.length;
        score += LINE_POINTS[rows.length] * level;
        level = 1 + Math.floor(lines / 10);
        updateStats();
        spawn();
    }

    function speed() { return Math.max(80, 800 - (level - 1) * 70); }

    /* ---------- Affichage ---------- */
    function cell(c, x, y, size, color, alpha) {
        c.globalAlpha = alpha == null ? 1 : alpha;
        c.fillStyle = color;
        var p = 1.5;
        if (c.roundRect) {
            c.beginPath();
            c.roundRect(x + p, y + p, size - p * 2, size - p * 2, 4);
            c.fill();
        } else {
            c.fillRect(x + p, y + p, size - p * 2, size - p * 2);
        }
        // reflet en haut de la case
        c.globalAlpha *= .25;
        c.fillStyle = '#fff';
        c.fillRect(x + p + 3, y + p + 2, size - p * 2 - 6, 3);
        c.globalAlpha = 1;
    }

    function draw() {
        ctx.clearRect(0, 0, COLS * CELL, ROWS * CELL);

        // grille discrète
        ctx.strokeStyle = 'rgba(255,255,255,.04)';
        ctx.lineWidth = 1;
        for (var x = 1; x < COLS; x++) { ctx.beginPath(); ctx.moveTo(x * CELL + .5, 0); ctx.lineTo(x * CELL + .5, ROWS * CELL); ctx.stroke(); }
        for (var y = 1; y < ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * CELL + .5); ctx.lineTo(COLS * CELL, y * CELL + .5); ctx.stroke(); }

        grid.forEach(function (row, r) {
            var flashing = flash && flash.rows.indexOf(r) >= 0;
            row.forEach(function (color, c) {
                if (color) cell(ctx, c * CELL, r * CELL, CELL, flashing ? '#ffffff' : color);
            });
        });

        if (!piece) return;

        // pièce fantôme : où la pièce va tomber
        var gy = piece.y;
        while (!collides(piece.shape, piece.x, gy + 1)) gy++;
        var color = PIECES[piece.type].color;
        piece.shape.forEach(function (row, r) {
            row.forEach(function (v, c) {
                if (!v) return;
                if (gy + r >= 0) cell(ctx, (piece.x + c) * CELL, (gy + r) * CELL, CELL, color, .18);
                if (piece.y + r >= 0) cell(ctx, (piece.x + c) * CELL, (piece.y + r) * CELL, CELL, color);
            });
        });
    }

    function drawNext() {
        nctx.clearRect(0, 0, 96, 96);
        var shape = PIECES[nextType].shape;
        // on recadre sur les cases pleines pour centrer la pièce
        var cells = [];
        shape.forEach(function (row, r) { row.forEach(function (v, c) { if (v) cells.push([r, c]); }); });
        var minR = Math.min.apply(null, cells.map(function (p) { return p[0]; }));
        var maxR = Math.max.apply(null, cells.map(function (p) { return p[0]; }));
        var minC = Math.min.apply(null, cells.map(function (p) { return p[1]; }));
        var maxC = Math.max.apply(null, cells.map(function (p) { return p[1]; }));
        var size = 20;
        var ox = (96 - (maxC - minC + 1) * size) / 2;
        var oy = (96 - (maxR - minR + 1) * size) / 2;
        cells.forEach(function (p) {
            cell(nctx, ox + (p[1] - minC) * size, oy + (p[0] - minR) * size, size, PIECES[nextType].color);
        });
    }

    function updateStats() {
        out.score.textContent = score;
        out.lines.textContent = lines;
        out.level.textContent = level;
        out.best.textContent = Math.max(best, score);
    }

    function showOverlay(title, text, button) {
        overlayTitle.textContent = title;
        overlayText.textContent = text;
        startBtn.textContent = button;
        overlay.hidden = false;
        startBtn.focus({ preventScroll: true });
    }

    /* ---------- Boucle ---------- */
    function loop(now) {
        requestAnimationFrame(loop);
        var dt = last ? now - last : 0;
        last = now;
        if (state !== 'playing') return;

        if (flash) {
            if (now >= flash.until) { var rows = flash.rows; flash = null; clearLines(rows); }
        } else {
            dropTimer += dt;
            if (dropTimer >= speed()) {
                dropTimer = 0;
                if (!collides(piece.shape, piece.x, piece.y + 1)) piece.y++;
                else lock();
            }
        }
        draw();
    }

    function start() {
        grid = emptyGrid();
        bag = [];
        nextType = takeFromBag();
        score = 0;
        lines = 0;
        level = 1;
        flash = null;
        dropTimer = 0;
        state = 'playing';
        overlay.hidden = true;
        spawn();
        updateStats();
    }

    function gameOver() {
        state = 'over';
        var record = score > best;
        if (record) {
            best = score;
            try { localStorage.setItem('tetris-best', String(best)); } catch (e) { /* tant pis */ }
        }
        updateStats();
        showOverlay(T.over || 'Perdu', (record ? T.newBest + ' ' : '') + (EN ? 'Score: ' : 'Score : ') + score, T.again);
    }

    function togglePause() {
        if (state === 'playing') {
            state = 'paused';
            showOverlay(T.paused, '', T.resume);
        } else if (state === 'paused') {
            state = 'playing';
            overlay.hidden = true;
            last = 0;
        }
    }

    function act(name) {
        if (name === 'pause') { togglePause(); return; }
        if (state !== 'playing' || !piece || flash) return;
        if (name === 'left') move(-1);
        else if (name === 'right') move(1);
        else if (name === 'rotate') turn();
        else if (name === 'down') softDrop();
        else if (name === 'drop') hardDrop();
        draw();
    }

    /* ---------- Contrôles ---------- */
    var KEYS = {
        ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'rotate', ArrowDown: 'down',
        ' ': 'drop', p: 'pause', P: 'pause', Escape: 'pause',
        q: 'left', d: 'right', z: 'rotate', s: 'down'
    };

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && state !== 'playing') {
            e.preventDefault();
            if (state === 'paused') togglePause(); else start();
            return;
        }
        var name = KEYS[e.key];
        if (!name) return;
        if (state === 'playing' || (name === 'pause' && state === 'paused')) e.preventDefault();
        act(name);
    });

    startBtn.addEventListener('click', function () {
        if (state === 'paused') togglePause(); else start();
    });

    // Pavé tactile : appui long = répétition pour gauche / droite / bas
    document.querySelectorAll('.pad button').forEach(function (btn) {
        var name = btn.getAttribute('data-act');
        var repeat = 0, delay = 0;
        function stop() { clearTimeout(delay); clearInterval(repeat); }
        btn.addEventListener('pointerdown', function (e) {
            e.preventDefault();
            act(name);
            if (name === 'left' || name === 'right' || name === 'down') {
                delay = setTimeout(function () { repeat = setInterval(function () { act(name); }, 60); }, 200);
            }
        });
        ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) { btn.addEventListener(ev, stop); });
    });

    // Pause automatique quand on change d'onglet
    document.addEventListener('visibilitychange', function () {
        if (document.hidden && state === 'playing') togglePause();
    });

    /* ---------- Démarrage ---------- */
    state = 'ready';
    grid = emptyGrid();
    bag = [];
    nextType = takeFromBag();
    score = 0; lines = 0; level = 1;
    updateStats();
    drawNext();
    draw();
    requestAnimationFrame(loop);
})();
