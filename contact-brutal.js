/* ═══════════════════════════════════════════════════════════
   CONTACT PAGE - Brutalist Animations
   ═══════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ═══════════════════════════════════════
    // STAGGER REVEAL (Intersection Observer)
    // ═══════════════════════════════════════
    const staggerEls = document.querySelectorAll('[data-anim="stagger"], [data-anim="fade-right"], [data-anim="fade-left"], [data-anim="fade-up"]');

    if (staggerEls.length) {
        // Set initial states
        staggerEls.forEach(el => {
            const anim = el.dataset.anim;
            if (anim === 'fade-right') {
                el.style.opacity = '0';
                el.style.transform = 'translateX(-40px)';
                el.style.transition = 'opacity 0.8s cubic-bezier(0.23,1,0.32,1), transform 0.8s cubic-bezier(0.23,1,0.32,1)';
            } else if (anim === 'fade-left') {
                el.style.opacity = '0';
                el.style.transform = 'translateX(40px)';
                el.style.transition = 'opacity 0.8s cubic-bezier(0.23,1,0.32,1), transform 0.8s cubic-bezier(0.23,1,0.32,1)';
            } else if (anim === 'fade-up') {
                // handled by CSS class
            }
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const anim = el.dataset.anim;

                    if (anim === 'fade-right' || anim === 'fade-left') {
                        el.style.opacity = '1';
                        el.style.transform = 'translateX(0)';
                    } else if (anim === 'fade-up') {
                        el.classList.add('visible');
                    } else if (anim === 'stagger') {
                        el.classList.add('visible');
                    }

                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        // Stagger delays for fields/channels
        let staggerIndex = 0;
        let lastParent = null;

        staggerEls.forEach(el => {
            if (el.dataset.anim === 'stagger') {
                const parent = el.parentElement;
                if (parent !== lastParent) {
                    staggerIndex = 0;
                    lastParent = parent;
                }
                el.style.transitionDelay = `${staggerIndex * 0.08}s`;
                staggerIndex++;
            }
            observer.observe(el);
        });
    }


    // ═══════════════════════════════════════
    // CHANNEL CARD CURSOR GLOW
    // ═══════════════════════════════════════
    document.querySelectorAll('.cb-channel').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mx', x + '%');
            card.style.setProperty('--my', y + '%');
        });
    });


    // ═══════════════════════════════════════
    // FORM SUBMIT ANIMATION
    // ═══════════════════════════════════════
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Honeypot anti-spam check
            const honeypot = document.getElementById('honeypot');
            if (honeypot && honeypot.value) return; // Bot detected - silently reject

            const btn = form.querySelector('.cb-submit');
            const textEl = btn.querySelector('.cb-submit-text');

            // Collect form data
            const orderData = {
                name: (document.getElementById('formName') || {}).value || '',
                email: (document.getElementById('formEmail') || {}).value || '',
                telegram: (document.getElementById('formTelegram') || {}).value || '',
                projectType: (document.getElementById('formProject') || {}).value || '',
                budget: (document.getElementById('formBudget') || {}).value || '',
                description: (document.getElementById('formDesc') || {}).value || ''
            };

            // Phase 1: Sending
            btn.classList.add('sending');
            textEl.textContent = 'Отправка...';
            btn.style.pointerEvents = 'none';

            // Send to Telegram
            sendOrderToTelegram(orderData).then(() => {
                // Phase 2: Success
                btn.classList.remove('sending');
                btn.classList.add('success');
                textEl.textContent = '✓ Заявка отправлена!';

                // Phase 3: Reset after 3.5 sec
                setTimeout(() => {
                    btn.classList.remove('success');
                    textEl.textContent = 'Отправить заявку';
                    btn.style.pointerEvents = '';
                    form.reset();
                }, 3500);
            }).catch(() => {
                // Even on error, show success to user (message may still arrive)
                btn.classList.remove('sending');
                btn.classList.add('success');
                textEl.textContent = '✓ Заявка отправлена!';
                setTimeout(() => {
                    btn.classList.remove('success');
                    textEl.textContent = 'Отправить заявку';
                    btn.style.pointerEvents = '';
                    form.reset();
                }, 3500);
            });
        });
    }


    // ═══════════════════════════════════════
    // MAGNETIC SUBMIT BUTTON
    // ═══════════════════════════════════════
    const submitBtn = document.querySelector('.cb-submit');
    if (submitBtn) {
        submitBtn.addEventListener('mousemove', (e) => {
            const rect = submitBtn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            submitBtn.style.transform = `translate(${x * 0.08}px, ${y * 0.15}px)`;
        });
        submitBtn.addEventListener('mouseleave', () => {
            submitBtn.style.transform = '';
        });
    }


    // ═══════════════════════════════════════
    // TRUST NUMBER COUNTER ANIMATION
    // ═══════════════════════════════════════
    const trustNums = document.querySelectorAll('.cb-trust-num');
    if (trustNums.length) {
        const countObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const text = el.textContent.trim();

                    // Parse target number
                    const numMatch = text.match(/(\d+)/);
                    if (!numMatch) return;

                    const target = parseInt(numMatch[1]);
                    const suffix = text.replace(/\d+/, '').trim();
                    const prefix = text.substring(0, text.indexOf(numMatch[0]));
                    const duration = 1500;
                    const start = performance.now();

                    function animate(now) {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        // easeOutExpo
                        const eased = 1 - Math.pow(1 - progress, 4);
                        const current = Math.round(target * eased);
                        el.textContent = prefix + current + suffix;

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            el.textContent = text; // Restore exact original
                        }
                    }

                    el.textContent = prefix + '0' + suffix;
                    requestAnimationFrame(animate);
                    countObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        trustNums.forEach(n => countObserver.observe(n));
    }


    // ═══════════════════════════════════════
    // INPUT FOCUS RIPPLE EFFECT
    // ═══════════════════════════════════════
    document.querySelectorAll('.cb-input').forEach(input => {
        input.addEventListener('focus', () => {
            const field = input.closest('.cb-field');
            if (!field) return;
            field.style.boxShadow = '0 2px 20px rgba(255, 45, 120, 0.06)';
        });
        input.addEventListener('blur', () => {
            const field = input.closest('.cb-field');
            if (!field) return;
            field.style.boxShadow = '';
        });
    });

})();
