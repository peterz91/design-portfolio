/* AI imagery gallery (ai-imagery/index.html): the image viewer. Without JS each image is a plain link to its
   full-size file. With JS a click opens it in a modal <dialog>: arrows or swipes step through every image on the
   page in order, Escape or × closes, and focus goes back to the image that was opened. */
(function () {
    'use strict';
    const box = document.querySelector('.gal_box');
    if (!box || typeof box.showModal !== 'function') return;
    const items = Array.from(document.querySelectorAll('.gal_item'));
    const img = box.querySelector('.gal_box-img');
    const setName = box.querySelector('.gal_box-set');
    const no = box.querySelector('.gal_box-no');
    let at = 0, opener = null;

    function show(i) {
        at = (i + items.length) % items.length;
        const a = items[at], thumb = a.querySelector('img');
        // The small file is already loaded: show it at once, and swap in the full one when it arrives.
        img.src = thumb.currentSrc || thumb.src;
        img.width = +a.dataset.w; img.height = +a.dataset.h;
        img.alt = thumb.alt;
        const full = new Image();
        full.onload = function () { if (items[at] === a) img.src = a.href; };
        full.src = a.href;
        setName.textContent = a.closest('.gal_set').querySelector('.gal_set-title').textContent;
        no.textContent = (at + 1) + ' / ' + items.length;
        // Warm the next one.
        new Image().src = items[(at + 1) % items.length].href;
    }

    items.forEach(function (a, i) {
        a.addEventListener('click', function (e) {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;   // new tab: let it through
            e.preventDefault();
            opener = a;
            show(i);
            box.showModal();
        });
    });
    box.querySelector('.gal_box-prev').addEventListener('click', function () { show(at - 1); });
    box.querySelector('.gal_box-next').addEventListener('click', function () { show(at + 1); });
    box.querySelector('.gal_box-close').addEventListener('click', function () { box.close(); });
    // A click on the dark surround (not the image or a button) closes too.
    box.addEventListener('click', function (e) {
        if (e.target === box || e.target.classList.contains('gal_box-fig')) box.close();
    });
    box.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); show(at - 1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); show(at + 1); }
    });
    box.addEventListener('close', function () {
        img.removeAttribute('src');
        if (opener) opener.focus();
    });

    // Swipe left or right on touch screens.
    let x0 = null;
    img.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') x0 = e.clientX; });
    img.addEventListener('pointerup', function (e) {
        if (x0 === null) return;
        const dx = e.clientX - x0; x0 = null;
        if (Math.abs(dx) > 40) show(at + (dx < 0 ? 1 : -1));
    });
})();
