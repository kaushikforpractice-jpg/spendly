// main.js — students will add JavaScript here as features are built

// "See how it works" video modal
(function () {
    const btn = document.getElementById('how-it-works-btn');
    const modal = document.getElementById('video-modal');
    if (!btn || !modal) return;

    const iframe = document.getElementById('video-modal-iframe');

    function openModal(e) {
        e.preventDefault();
        iframe.src = btn.dataset.embed;
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        modal.querySelector('.video-modal-close').focus();
    }

    function closeModal() {
        modal.hidden = true;
        iframe.src = '';  // stops playback
        document.body.style.overflow = '';
        btn.focus();
    }

    btn.addEventListener('click', openModal);
    modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !modal.hidden) closeModal();
    });
})();
