// Petar Živković — portfolio, v1.2 (Oct 2026)
// Everything on the page is plain HTML and works without this file. The script adds:
// 1. the theme toggle (remembers the visitor's choice),
// 2. the lane filter (chips, plus ?lane=graphic|ui|ai|motion for role-specific links),
// 3. the PhotoSwipe lightbox, loaded only when someone opens an image,
// 4. autoplay for the muted loops while they are on screen,
// 5. the index that folds into a sticky project bar,
// 6. the STMNT system board, played in as it scrolls into view,
// 7. Escape for the tool-name labels after each case title (the labels themselves are CSS).

(function () {
    'use strict';

    let refreshIndex = function () {};   // set up in part 5; the lane filter calls it when rows show or hide

    // ── 1. Theme ────────────────────────────────────────────────
    // The inline script in <head> sets data-theme before first paint; this keeps it in sync.
    const root = document.documentElement;
    const toggle = document.querySelector('[data-theme-toggle]');

    function storedTheme() {
        try { return localStorage.getItem('theme'); } catch (e) { return null; }
    }

    function applyTheme(theme) {
        // Only touch the root when the theme really changes: it restyles the whole page.
        if (root.getAttribute('data-theme') !== theme) root.setAttribute('data-theme', theme);
        if (toggle) {
            // A toggle button: the label stays "Dark theme", aria-pressed says whether it's on.
            toggle.setAttribute('aria-pressed', String(theme === 'dark'));
        }
    }

    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

    if (toggle) {
        toggle.addEventListener('click', function () {
            const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            try { localStorage.setItem('theme', next); } catch (e) { /* private mode: fine */ }
        });
    }

    // Follow the OS setting until the visitor picks a theme themselves.
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
            if (!storedTheme()) applyTheme(e.matches ? 'dark' : 'light');
        });
    }

    // ── 2. Lane filter ──────────────────────────────────────────
    const chips = Array.from(document.querySelectorAll('[data-lane-chip]'));
    const filterables = Array.from(document.querySelectorAll('[data-lanes]'));
    const status = document.querySelector('[data-filter-status]');
    const lanes = chips.map(function (c) { return c.getAttribute('data-lane-chip'); });

    function setLane(lane, updateUrl) {
        if (lanes.indexOf(lane) === -1) lane = 'all';
        chips.forEach(function (c) {
            c.setAttribute('aria-pressed', String(c.getAttribute('data-lane-chip') === lane));
        });
        let shown = 0;
        filterables.forEach(function (el) {
            const match = lane === 'all' || el.getAttribute('data-lanes').split(' ').indexOf(lane) !== -1;
            el.hidden = !match;
            if (match && el.classList.contains('work_row')) shown++;
        });
        if (status) {
            const chip = chips.filter(function (c) { return c.getAttribute('data-lane-chip') === lane; })[0];
            status.textContent = lane === 'all'
                ? 'Showing all projects.'
                : 'Showing ' + shown + ' projects: ' + (chip ? chip.textContent.trim() : lane) + '.';
        }
        if (updateUrl && window.history && history.replaceState) {
            const url = new URL(window.location.href);
            if (lane === 'all') url.searchParams.delete('lane'); else url.searchParams.set('lane', lane);
            history.replaceState(null, '', url.pathname + url.search + url.hash);
        }
        refreshIndex();
    }

    if (chips.length) {
        chips.forEach(function (c) {
            c.addEventListener('click', function () { setLane(c.getAttribute('data-lane-chip'), true); });
        });
        const fromUrl = new URLSearchParams(window.location.search).get('lane');
        if (fromUrl) setLane(fromUrl, false);
    }

    // ── 3. Lightbox ─────────────────────────────────────────────
    // PhotoSwipe 5 from jsDelivr, fetched on first use so it never delays the first paint.
    const PSWP = 'https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/';
    let lightboxPromise = null;

    function loadLightbox() {
        if (lightboxPromise) return lightboxPromise;
        const css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = PSWP + 'photoswipe.css';
        document.head.appendChild(css);

        lightboxPromise = import(PSWP + 'photoswipe-lightbox.esm.min.js').then(function (mod) {
            const lightbox = new mod.default({
                gallery: '.case_gallery',
                children: 'a.shot_link',
                pswpModule: function () { return import(PSWP + 'photoswipe.esm.min.js'); },
                bgOpacity: 1,
                showHideAnimationType: 'fade',
                imageClickAction: 'zoom',
                tapAction: 'toggle-controls',
                bgClickAction: 'close',
                secondaryZoomLevel: 1,
                maxZoomLevel: 2,
                paddingFn: function (viewport) {
                    return viewport.x < 700
                        ? { top: 56, bottom: 96, left: 0, right: 0 }
                        : { top: 48, bottom: 104, left: 64, right: 64 };
                },
                closeTitle: 'Close (Esc)',
                zoomTitle: 'Zoom',
                arrowPrevTitle: 'Previous image',
                arrowNextTitle: 'Next image'
            });

            // Device renders carry a 4:5 phone crop (data-portrait); on phones the lightbox opens that, like the gallery's
            // <picture> does, so a tap doesn't shrink the phone.
            lightbox.addFilter('itemData', function (itemData) {
                const a = itemData.element;
                if (a && a.dataset.portrait && window.matchMedia('(max-width: 700px)').matches) {
                    itemData.src = a.dataset.portrait;
                    itemData.width = 1200;
                    itemData.height = 1500;
                }
                return itemData;
            });

            // Show each figure's caption under the image.
            lightbox.on('uiRegister', function () {
                lightbox.pswp.ui.registerElement({
                    name: 'caption',
                    order: 9,
                    isButton: false,
                    appendTo: 'root',
                    onInit: function (el, pswp) {
                        el.setAttribute('aria-live', 'polite');
                        pswp.on('change', function () {
                            const a = pswp.currSlide && pswp.currSlide.data.element;
                            const cap = a && a.closest('figure') && a.closest('figure').querySelector('figcaption');
                            el.innerHTML = cap ? cap.innerHTML : '';
                        });
                    }
                });
            });

            lightbox.init();
            return lightbox;
        });
        return lightboxPromise;
    }

    document.addEventListener('click', function (e) {
        const link = e.target.closest && e.target.closest('a.shot_link');
        if (!link || e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) return;
        if (link.dataset.pswpReady) return; // PhotoSwipe's own handler takes it from here
        e.preventDefault();
        const gallery = link.closest('.case_gallery');
        const items = Array.from(gallery.querySelectorAll('a.shot_link'));
        loadLightbox().then(function (lightbox) {
            document.querySelectorAll('a.shot_link').forEach(function (a) { a.dataset.pswpReady = '1'; });
            lightbox.loadAndOpen(items.indexOf(link), { gallery: gallery });
        }).catch(function () {
            window.location.href = link.href; // CDN blocked: just show the full image
        });
    });

    // Warm the module up when a pointer comes near an image.
    document.addEventListener('pointerover', function (e) {
        if (e.target.closest && e.target.closest('a.shot_link')) loadLightbox();
    }, { passive: true });

    // ── 4. Motion pieces ────────────────────────────────────────
    // Muted loops play while on screen and pause off screen. Controls stay visible, so
    // anyone can stop them; with reduced motion they never start on their own.
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const videos = Array.from(document.querySelectorAll('video[data-autoplay]'));

    // Set up after the page has loaded and gone idle, so it never competes with the first paint.
    function whenIdle(fn) {
        const run = function () { ('requestIdleCallback' in window) ? requestIdleCallback(fn, { timeout: 2000 }) : setTimeout(fn, 200); };
        if (document.readyState === 'complete') run(); else window.addEventListener('load', run, { once: true });
    }

    // Posters come in as their video gets near (data-poster), not with the page: browsers fetch every poster at
    // once otherwise, and eight of them would compete with the first paint on a phone.
    const posters = Array.from(document.querySelectorAll('video[data-poster]'));
    if (posters.length) whenIdle(function () {
        const show = function (v) { v.poster = v.getAttribute('data-poster'); };
        if (!('IntersectionObserver' in window)) { posters.forEach(show); return; }
        const near = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) { if (e.isIntersecting) { show(e.target); near.unobserve(e.target); } });
        }, { rootMargin: '150% 0px' });
        posters.forEach(function (v) { near.observe(v); });
    });

    if (videos.length && !reduceMotion && 'IntersectionObserver' in window) whenIdle(function () {
        const stoppedByVisitor = new WeakSet();
        videos.forEach(function (v) {
            // The pause event arrives after pause() returns, so the flag is cleared here, not there.
            v.addEventListener('pause', function () {
                if (v.dataset.autoPausing === '1') { v.dataset.autoPausing = ''; return; }
                stoppedByVisitor.add(v);
            });
            v.addEventListener('play', function () { stoppedByVisitor.delete(v); });
        });
        const io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                const v = entry.target;
                if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                    if (!stoppedByVisitor.has(v) && v.paused) {
                        v.preload = 'auto';
                        const p = v.play();
                        if (p && p.catch) p.catch(function () { /* autoplay blocked: controls remain */ });
                    }
                } else if (!v.paused) {
                    v.dataset.autoPausing = '1';
                    v.pause();
                }
            });
        }, { threshold: [0, 0.5] });
        videos.forEach(function (v) { io.observe(v); });
    });

    // ── 5. Index → project bar ──────────────────────────────────
    // Scrolled past, the index folds from the bottom up: 05 slides behind 04, then the pair behind 03, and so
    // on down to 01. The fold follows the scroll position 1:1, so the list closes at the same pace as the page
    // moves under it, and opens again on the way back up. When only 01 is left it turns into the project bar
    // (.is-bar in the CSS animates that): one tab per project, the one in view underlined, and "Top".
    // Reduced motion: no fold, the bar simply replaces the list.
    // Set up after load and idle, like the videos: it measures the page, and nobody can scroll past the index
    // before then. Until it runs, the index is a plain list.
    const index = document.querySelector('[data-index]');
    if (index) whenIdle(function () { refreshIndex = setUpIndex(index); });

    function setUpIndex(nav) {
        const inner = nav.querySelector('.index_inner');
        const rows = Array.from(nav.querySelectorAll('.work_row'));

        // The bar is built from the rows, so a new project only needs its row and its case. A row's data-short
        // (the start of its name) is what its tab shows when the full names don't fit.
        const bar = document.createElement('div');
        bar.className = 'index_bar';
        const tabList = document.createElement('ol');
        tabList.className = 'index_tabs';
        const tabs = rows.map(function (row) {
            const item = document.createElement('li');
            item.className = 'index_tab-item';
            const link = document.createElement('a');
            link.className = 'index_tab';
            link.href = row.querySelector('a').getAttribute('href');
            const no = document.createElement('span');
            no.className = 'index_tab-no';
            no.textContent = row.querySelector('.work_row-no').textContent;
            const name = document.createElement('span');
            name.className = 'index_tab-name';
            const full = row.querySelector('.work_row-name').textContent;
            const short = row.getAttribute('data-short');
            if (short && full.indexOf(short) === 0 && full.length > short.length) {
                const more = document.createElement('span');
                more.className = 'index_tab-more';
                more.textContent = full.slice(short.length);
                name.append(short, more);
            } else {
                name.textContent = full;
            }
            link.append(no, ' ', name);   // the space keeps "01 STMNT Studios" apart for screen readers
            item.appendChild(link);
            tabList.appendChild(item);
            return item;
        });
        const top = document.createElement('a');
        top.className = 'index_top';
        top.href = '#top';
        top.setAttribute('aria-label', 'Back to top');
        top.innerHTML = '<span class="index_top-label">Top</span><span class="index_top-arrow" aria-hidden="true"></span>';
        // "Top" slides back up; the project tabs jump straight to their case. Smooth scrolling stays off for
        // anchors, because content-visibility makes them overshoot, but the very top can't be overshot.
        top.addEventListener('click', function (e) {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button > 0) return;
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
            if (location.hash !== '#top') history.pushState(null, '', '#top');
            // Like following the link: focus moves to the top, so the next Tab starts there.
            const start = document.getElementById('top');
            if (start) {
                if (!start.hasAttribute('tabindex')) start.setAttribute('tabindex', '-1');
                start.focus({ preventScroll: true });
            }
        });
        const mark = document.createElement('span');
        mark.className = 'index_mark';
        mark.setAttribute('aria-hidden', 'true');
        bar.append(tabList, top, mark);
        inner.appendChild(bar);

        // Holds the room the folded rows leave, so nothing below moves when the index turns sticky.
        const spacer = document.createElement('div');
        spacer.className = 'index_spacer';
        spacer.setAttribute('aria-hidden', 'true');
        nav.after(spacer);

        let shown = [], shownTabs = [], cases = [], noW = [], nameW = [];
        let rowH = 0, foldMax = 0, gap = 0, compact = false, tabX = [], tabW = [];
        let rowHs = [], foldFrom = [], foldTo = [];   // each row's height; when it starts folding; how far it travels
        let chains = [];   // per row: its spans, and the parts that close up toward the name as it folds
        let fTabs = 0, lastFrame = 0, instant = true;   // the fold as the tabs see it: eased toward the real one
        let leadName = null, nameFrom = 0, switchedAt = -1e9;   // the first tab's name, and when it last set off
        let isBar = false, active = -1, ticking = false, drawTimer = 0;

        // Tab i's left edge and width, with tab `open` the only named one in the compact bar.
        function tabBox(i, open) {
            let x = 0;
            for (let k = 0; k < i; k++) x += noW[k] + (!compact || k === open ? 10 + nameW[k] : 0) + gap;
            return [x, noW[i] + (!compact || i === open ? 10 + nameW[i] : 0)];
        }

        function measure() {
            shown = rows.filter(function (r) { return !r.hidden; });
            rows.forEach(function (r, i) {
                tabs[i].hidden = r.hidden;
                r.classList.remove('is-lead');
                tabs[i].classList.remove('is-lead', 'is-open');
                r.style.transform = r.style.zIndex = r.firstElementChild.style.opacity = '';
                Array.from(r.firstElementChild.children).forEach(function (s) { s.style.translate = s.style.opacity = s.style.clipPath = ''; });
                r.style.removeProperty('--rule');
                tabs[i].style.translate = tabs[i].style.opacity = tabs[i].style.clipPath = '';
            });
            if (!shown.length) return;
            shownTabs = shown.map(function (r) { return tabs[rows.indexOf(r)]; });
            cases = shown.map(function (r) { return document.querySelector(r.querySelector('a').getAttribute('href')); });
            shown[0].classList.add('is-lead');
            shownTabs[0].classList.add('is-lead');
            leadName = shownTabs[0].querySelector('.index_tab-name');

            // Row and bar heights. Where a row takes two lines, the bar keeps only the first.
            const n = shown.length;
            const lead = shown[0].getBoundingClientRect();
            const rowName = shown[0].querySelector('.work_row-name');
            rowH = lead.height;
            // The bar keeps the name's first line only, where it wraps: count its lines (equal line boxes).
            const nameBox = rowName.getBoundingClientRect();
            const nameRange = document.createRange();
            nameRange.selectNodeContents(rowName);
            const lines = new Set([].map.call(nameRange.getClientRects(), function (r) { return Math.round(r.top); })).size || 1;
            const barH = Math.min(rowH, nameBox.top + nameBox.height / lines - lead.top + 17);
            // Rows can differ in height (a long name wraps on phones). Each row starts folding once the rows below it
            // have folded into it and travels up to the first row's top, or, if it is taller than the first row, until
            // its bottom meets the first row's (the extra goes up behind the bar), so the stack's bottom stays on the
            // content below throughout. The spacer holds the rows below the first.
            rowHs = shown.map(function (r) { return r.getBoundingClientRect().height; });
            foldFrom = rowHs.map(function (h, i) { return rowHs.slice(i + 1).reduce(function (a, b) { return a + b; }, 0); });
            foldTo = rowHs.map(function (h, i) { return rowHs.slice(0, i).reduce(function (a, b) { return a + b; }, 0) + (i ? Math.max(0, h - rowHs[0]) : 0); });
            foldMax = foldFrom[0];
            // As a row goes under, its description, status and arrow slide right to left and fade, each disappearing
            // behind the left edge of its own column (a clip that holds the column still while the text moves). Each
            // travels its own width, all over the same stretch: until the row above reaches the middle of the text
            // (endU of the way under). Meanwhile the row's line retracts right to left, gone when the row is under.
            const textBox = function (el) {
                const r = document.createRange();
                r.selectNodeContents(el);
                const b = r.getBoundingClientRect();
                return b.width ? b : el.getBoundingClientRect();
            };
            chains = shown.map(function (row, i) {
                const box = row.getBoundingClientRect();
                const nb = textBox(row.querySelector('.work_row-name'));
                const mid = nb.top + nb.height / 2;
                const parts = [];
                ['.work_row-what', '.work_row-status', '.work_row-arrow'].forEach(function (sel) {
                    const el = row.querySelector(sel);
                    if (!el || !el.getClientRects().length) return;   // not shown at this width
                    const b = textBox(el);
                    if (b.top > mid || b.bottom < mid) return;         // on a line of its own (phones): it just fades
                    parts.push({ el: el, travel: b.right - el.getBoundingClientRect().left + 2 });
                });
                return {
                    row: row,
                    spans: Array.from(row.firstElementChild.children),
                    parts: parts,
                    endU: Math.min(Math.max((mid - box.top) / rowHs[i], 0.15), 0.9)
                };
            });
            nav.style.setProperty('--row-h', rowH + 'px');
            nav.style.setProperty('--bar-h', barH + 'px');
            nav.style.setProperty('--n', n);
            spacer.style.height = foldMax + 'px';
            nav.classList.add('is-ready');

            // Pick the widest layout that fits: full names, short names, or numbers plus the open tab's name.
            nav.classList.remove('is-short', 'is-compact');
            compact = false;
            gap = parseFloat(getComputedStyle(tabList).columnGap) || 0;
            const room = bar.clientWidth - top.offsetWidth - 16;
            const fullW = [], shortW = [];
            noW = []; nameW = [];
            shownTabs.forEach(function (t, i) {
                const name = t.querySelector('.index_tab-name');
                const more = name.querySelector('.index_tab-more');
                noW.push(t.querySelector('.index_tab-no').getBoundingClientRect().width);
                fullW.push(name.getBoundingClientRect().width);
                shortW.push(i && more ? fullW[i] - more.getBoundingClientRect().width : fullW[i]);
            });
            const sum = function (a) { return a.reduce(function (s, v) { return s + v; }, 0); };
            const spread = sum(noW) + 10 * n + (n - 1) * gap;
            if (spread + sum(fullW) <= room) {
                nameW = fullW;
            } else if (spread + sum(shortW) <= room) {
                nameW = shortW;
                nav.classList.add('is-short');
            } else {
                // Only the open tab is named; if even that won't fit beside "Top", its name ends in an ellipsis.
                const fit = room - (sum(noW) + 10 + (n - 1) * gap);
                nameW = shortW.map(function (w) { return Math.max(0, Math.min(w, fit)); });
                compact = true;
                nav.classList.add('is-short', 'is-compact');
            }
            shownTabs.forEach(function (t, i) {
                t.style.setProperty('--i', i);
                t.style.setProperty('--name-w', nameW[i] + 'px');
                t.style.zIndex = n - i;
            });
            shownTabs[0].classList.add('is-open');
            // Where each tab ends up, and how much room it takes, with the first tab open.
            tabX = shownTabs.map(function (t, i) { return tabBox(i, 0)[0]; });
            tabW = shownTabs.map(function (t, i) { return tabBox(i, 0)[1]; });

            // The first tab's name starts where the first row's name is.
            nameFrom = rowName.offsetLeft - noW[0] - 10;
            nav.style.setProperty('--name-from', nameFrom + 'px');
            nav.style.setProperty('--line-from', (inner.clientWidth - 2 * parseFloat(getComputedStyle(inner).paddingLeft)) / nav.clientWidth);
            if (isBar) setActive(active, true);
        }

        function setActive(i, force) {
            if (i === active && !force) return;
            active = i;
            shownTabs.forEach(function (t, k) {
                const link = t.firstElementChild;
                if (k === i) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current');
                if (compact) t.classList.toggle('is-open', k === i);
            });
            mark.classList.toggle('is-on', i >= 0);
            if (i >= 0) {
                const box = tabBox(i, i);
                mark.style.setProperty('--mark-x', box[0] + 'px');
                mark.style.setProperty('--mark-w', box[1]);
            }
        }

        // The project in view: the case that crosses a line a third of the way down below the bar. Above the first
        // case (while the bar forms) that is the first one, up next; past the last one (Experience) there is none.
        function spy() {
            const line = rowH + (window.innerHeight - rowH) / 3;
            let found = cases.length && cases[0].getBoundingClientRect().top > line ? 0 : -1;
            for (let i = 0; found < 0 && i < cases.length; i++) {
                const r = cases[i].getBoundingClientRect();
                if (r.top <= line && r.bottom > line) found = i;
            }
            setActive(found);
        }

        function enterBar() {
            // The underline starts from nothing under the first tab and draws in once the tabs are out.
            mark.style.transition = 'none';
            mark.style.setProperty('--mark-x', '0px');
            mark.style.setProperty('--mark-w', 0);
            void mark.offsetWidth;
            mark.style.transition = '';
            mark.classList.add('is-drawing');
            clearTimeout(drawTimer);
            drawTimer = setTimeout(function () { mark.classList.remove('is-drawing'); }, 900);
            spy();
        }

        function leaveBar() {
            setActive(-1);
            if (compact) shownTabs[0].classList.add('is-open');   // fold back in as the first row's label
        }

        function update() {
            ticking = false;
            if (!shown.length) return;
            const n = shown.length;
            // Where the first tab's name is: for half a second after the bar forms (or unforms) it is still sliding
            // between the row's spot and the bar's. Read before anything is written, so the read costs no extra
            // style pass.
            const now = performance.now();
            const lead = now - switchedAt < 650 ? parseFloat(getComputedStyle(leadName).translate) || 0 : (isBar ? 0 : nameFrom);
            const s = rowH - spacer.getBoundingClientRect().top;   // how far the index has scrolled past the top
            const f = reduceMotion ? (s > 0 ? foldMax : 0) : Math.min(Math.max(s, 0), foldMax);
            shown.forEach(function (row, i) {
                const into = f - foldFrom[i];                       // how far this row has slid under the one above
                const shift = Math.min(Math.max(into, 0), foldTo[i]);
                const under = i ? Math.min(Math.max(into / rowHs[i], 0), 1) : 0;
                row.style.transform = shift ? 'translate3d(0,' + (-shift) + 'px,0)' : '';
                row.style.zIndex = f > 0 ? String(n - i) : '';
                const c = chains[i];
                const fade = under ? String(1 - under) : '';
                c.spans.forEach(function (s) { s.style.opacity = fade; });
                const q = under ? Math.min(under / c.endU, 1) : 0;
                const e = q * q * (3 - 2 * q);
                c.parts.forEach(function (p) {
                    const d = p.travel * e;
                    p.el.style.translate = e ? (-d).toFixed(2) + 'px 0' : '';
                    p.el.style.clipPath = e ? 'inset(-6px -6px -6px ' + d.toFixed(2) + 'px)' : '';
                    p.el.style.opacity = e ? (1 - e).toFixed(3) : '';
                });
                if (under) c.row.style.setProperty('--rule', (1 - under).toFixed(3)); else c.row.style.removeProperty('--rule');
            });
            nav.classList.toggle('is-folding', f > 0 && f < foldMax);

            // The bar starts forming as soon as the fold does.
            const want = reduceMotion ? s > 0 : (isBar ? s > 0 : s > 2);
            if (want !== isBar) {
                isBar = want;
                switchedAt = now;
                nav.classList.toggle('is-bar', isBar);
                if (isBar) enterBar(); else leaveBar();
            } else if (isBar) {
                spy();
            }
            nav.classList.toggle('is-folded', isBar && f >= foldMax - 0.5);

            // As its row goes under, each other tab comes out from under the first one into the place right next to
            // it, pushing the tabs already out one place along: 05 comes out first, then 04 pushes it right, and so
            // on, until the order reads 01–05. The tabs read a softened copy of the fold, so they glide between
            // wheel steps and play in order after a jump. They come out from behind the first tab's name wherever
            // it is (`lead`, read above).
            const base = tabX[1] + lead;                            // where the place right after the first tab is now
            if (instant || reduceMotion) fTabs = f;
            else fTabs += (f - fTabs) * (1 - Math.exp(-Math.min(now - lastFrame, 64) / 70));
            if (Math.abs(f - fTabs) < 0.25) fTabs = f;
            lastFrame = now; instant = false;
            let open = 0;                                           // room opened so far, from the first tab on
            shownTabs.forEach(function (t, i) {
                if (!i) return;
                const p = Math.min(Math.max((fTabs - foldFrom[i]) / rowHs[i], 0), 1);
                const room = tabW[i] + gap;
                const slot = room * (1 - Math.pow(1 - p, 3));           // this tab's place opening up
                const x = base + open + slot - room;                    // sits at the right edge of its opening place
                open += slot;
                const dx = x - tabX[i];
                const hidden = base - gap + 10 - x;                   // the part still behind the first tab's card
                t.style.translate = Math.abs(dx) > 0.01 ? dx.toFixed(2) + 'px 0' : '';
                t.style.clipPath = hidden > 0 ? 'inset(-2px -12px -2px ' + hidden.toFixed(2) + 'px)' : '';
                t.style.opacity = p < 1 ? Math.min(p / 0.2, 1).toFixed(3) : '1';
            });
            if (fTabs !== f || (fTabs > 0 && now - switchedAt < 650)) request();   // tabs out: follow the name
        }

        function request() {
            if (!ticking) { ticking = true; requestAnimationFrame(update); }
        }

        // Re-measure without animating: on resize, when the font arrives, and when the lane filter changes rows.
        function refresh() {
            nav.classList.add('no-anim');
            instant = true;
            measure();
            update();
            requestAnimationFrame(function () { requestAnimationFrame(function () { nav.classList.remove('no-anim'); }); });
        }

        refresh();
        window.addEventListener('scroll', request, { passive: true });
        let resizeFrame = 0;
        window.addEventListener('resize', function () {
            cancelAnimationFrame(resizeFrame);
            resizeFrame = requestAnimationFrame(refresh);
        });
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
        return refresh;
    }

    // ── 6. The STMNT system board ───────────────────────────────
    // The board is plain HTML built from the live site's variables. Each part (primitives, roles, spacing, radius,
    // type) plays in once as it scrolls into view. Parts already on screen when this runs are left alone. STMNT's
    // two typefaces come from Google Fonts a screen ahead of the board, cut down to the letters it shows.
    const board = document.querySelector('[data-ds]');
    if (board) whenIdle(function () {
        let fonts = null;
        function loadFonts() {
            if (fonts) return fonts;
            const shown = Array.from(board.querySelectorAll('.ds_aa, .ds_face')).map(function (el) { return el.textContent; }).join('');
            const glyphs = Array.from(new Set(shown.split(''))).join('');
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/css2?family=League+Spartan&family=Raleway:wght@900&display=swap&text=' + encodeURIComponent(glyphs);
            fonts = new Promise(function (resolve) {
                link.onload = function () {
                    Promise.all([document.fonts.load('900 48px Raleway', glyphs), document.fonts.load('22px "League Spartan"', glyphs)]).then(resolve, resolve);
                };
                link.onerror = resolve;
                setTimeout(resolve, 1500);   // never hold the type back longer than this
            });
            document.head.appendChild(link);
            return fonts;
        }
        if (!('IntersectionObserver' in window)) { loadFonts(); return; }

        const near = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) { loadFonts(); near.disconnect(); }
        }, { rootMargin: '100% 0px' });
        near.observe(board);
        if (reduceMotion) return;

        const parts = Array.from(board.querySelectorAll('[data-ds-group]')).filter(function (g) {
            return g.getBoundingClientRect().top > window.innerHeight;
        });
        const io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                const part = entry.target;
                io.unobserve(part);
                const play = function () { part.classList.add('is-in'); };
                if (part.classList.contains('ds_type')) loadFonts().then(play); else play();
            });
        }, { rootMargin: '0px 0px -12% 0px' });
        parts.forEach(function (g) { g.classList.add('is-armed'); io.observe(g); });
    });

    // ── 7. Tool names ───────────────────────────────────────────
    // A tool mark shows its name on hover. Escape hides the name showing until the pointer leaves that mark, so
    // nobody has to move the pointer to see what the label covers.
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        const tool = document.querySelector('.case_tool:hover');
        if (!tool) return;
        tool.classList.add('is-dismissed');
        tool.addEventListener('mouseleave', function () { tool.classList.remove('is-dismissed'); }, { once: true });
    });
})();
