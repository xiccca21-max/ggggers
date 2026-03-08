/* ═══════════════════════════════════════════════════════════════════
   ULTRA CALCULATOR - JavaScript Engine v2
   ═══════════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ═══════════════════════════════════════
    // STEP WIZARD
    // ═══════════════════════════════════════
    const track = document.getElementById('ucalcTrack');
    const steps = document.querySelectorAll('.ucalc-step');
    const dots = document.querySelectorAll('.ucalc-step-dot');
    const fill = document.getElementById('ucalcFill');
    const statusEl = document.getElementById('ucalcStatus');

    if (!track || !steps.length) return;

    let currentStep = 0;
    const totalSteps = steps.length;

    const STATUS_TEXTS = [
        'Выберите тип проекта',
        'Выберите уровень дизайна',
        'Настройте дополнительные опции',
        'Укажите сроки реализации'
    ];

    function goToStep(idx) {
        if (idx < 0 || idx >= totalSteps) return;
        currentStep = idx;
        track.style.transform = `translateX(-${idx * 25}%)`;
        fill.style.width = `${((idx + 1) / totalSteps) * 100}%`;

        steps.forEach((s, i) => s.classList.toggle('active', i === idx));
        dots.forEach((d, i) => {
            d.classList.remove('active', 'done');
            if (i === idx) d.classList.add('active');
            else if (i < idx) d.classList.add('done');
        });

        // Update status text with animation
        if (statusEl) {
            statusEl.classList.add('changing');
            setTimeout(() => {
                statusEl.textContent = STATUS_TEXTS[idx] || '';
                statusEl.classList.remove('changing');
            }, 300);
        }
    }

    // Init
    goToStep(0);

    // Nav buttons
    document.querySelectorAll('.ucalc-nav-btn.next:not(.ucalc-nav-btn--summary)').forEach(btn => {
        btn.addEventListener('click', () => goToStep(currentStep + 1));
    });
    document.querySelectorAll('.ucalc-nav-btn.prev').forEach(btn => {
        btn.addEventListener('click', () => goToStep(currentStep - 1));
    });

    // Step dots click
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const idx = parseInt(dot.dataset.step);
            goToStep(idx);
        });
    });

    // ═══════════════════════════════════════
    // CARD SELECTION (Steps 1 & 2)
    // ═══════════════════════════════════════
    const values = { project: 30000, design: 0 };
    let extras = 0;
    let multiplier = 1;
    let hasDiscount = false;

    // Dynamic timelines per project type
    const TIMELINES = {
        30000:  { standard: '10 - 15 дней', fast: '7 - 10 дней', urgent: '5 - 7 дней' },   // Сайт
        60000:  { standard: '10 - 15 дней', fast: '7 - 10 дней', urgent: '5 - 7 дней' },   // Веб-приложение
        90000:  { standard: '15 - 20 дней', fast: '10 - 15 дней', urgent: '5 - 10 дней' },  // Мобильное приложение
        140000: { standard: '15 - 20 дней', fast: '10 - 15 дней', urgent: '5 - 10 дней' }   // Комплексная платформа
    };

    function updateTimelinePeriods() {
        const tl = TIMELINES[values.project] || TIMELINES[30000];
        document.querySelectorAll('.ucalc-timeline-period[data-speed]').forEach(el => {
            const speed = el.dataset.speed;
            if (tl[speed]) el.textContent = tl[speed];
        });
    }

    document.querySelectorAll('.ucalc-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const type = card.dataset.type;
            const value = parseInt(card.dataset.value);

            // Deselect siblings
            document.querySelectorAll(`.ucalc-card[data-type="${type}"]`).forEach(c => {
                c.classList.remove('active');
            });
            card.classList.add('active');
            values[type] = value;

            // Update timeline periods if project type changed
            if (type === 'project') {
                updateTimelinePeriods();
            }

            // Ripple effect
            createRipple(e, card);

            recalculate();
        });
    });

    // Toggle extras (Step 3)
    document.querySelectorAll('.ucalc-toggle input').forEach(input => {
        input.addEventListener('change', (e) => {
            recalcExtras();
            recalculate();

            // Particle burst on check
            if (input.checked) {
                const rect = input.closest('.ucalc-toggle').getBoundingClientRect();
                spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
            }
        });
    });

    // Timeline cards (Step 4)
    document.querySelectorAll('.ucalc-timeline-card').forEach(card => {
        card.addEventListener('click', (e) => {
            document.querySelectorAll('.ucalc-timeline-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            multiplier = parseFloat(card.dataset.multiplier);
            createRipple(e, card);
            recalculate();
        });
    });

    function recalcExtras() {
        extras = 0;
        document.querySelectorAll('.ucalc-toggle input').forEach(cb => {
            if (cb.checked) extras += parseInt(cb.dataset.value);
        });
    }

    function getTotal() {
        let total = Math.round((values.project + values.design + extras) * multiplier);
        if (hasDiscount) {
            total = Math.round(total * 0.95);
        }
        return total;
    }

    function recalculate() {
        const total = getTotal();
        updateSlotDigits(total);
        updateRing(total);
        updateAura(total);
    }

    // ═══════════════════════════════════════
    // RIPPLE EFFECT
    // ═══════════════════════════════════════
    function createRipple(e, el) {
        const rect = el.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const ripple = document.createElement('span');
        ripple.className = 'ucalc-ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        el.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    // ═══════════════════════════════════════
    // SLOT-MACHINE DIGITS
    // ═══════════════════════════════════════
    const digitsContainer = document.getElementById('ucalcDigits');
    let currentDisplayValue = 30000;
    const CHARS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    function formatNumber(n) {
        return n.toLocaleString('ru-RU').replace(/,/g, ' ');
    }

    function getDigitHeight() {
        const raw = getComputedStyle(digitsContainer).getPropertyValue('--digit-h');
        const val = parseFloat(raw);
        return isNaN(val) ? 2.4 : val;
    }

    function buildDigitColumn(char) {
        const col = document.createElement('span');
        col.className = 'ucalc-digit-col';

        const strip = document.createElement('span');
        strip.className = 'ucalc-digit-strip';

        if (char === ' ') {
            const el = document.createElement('span');
            el.className = 'ucalc-digit-char space';
            el.textContent = '\u2009';
            strip.appendChild(el);
            col.appendChild(strip);
            col.dataset.char = ' ';
            return col;
        }

        for (let i = 0; i < CHARS.length; i++) {
            const el = document.createElement('span');
            el.className = 'ucalc-digit-char';
            el.textContent = CHARS[i];
            strip.appendChild(el);
        }

        col.appendChild(strip);
        col.dataset.char = char;

        const idx = CHARS.indexOf(char);
        const h = getDigitHeight();
        if (idx >= 0) {
            strip.style.transform = `translateY(-${idx * h}rem)`;
        }

        return col;
    }

    function initDigits() {
        const str = formatNumber(currentDisplayValue);
        digitsContainer.innerHTML = '';
        for (const ch of str) {
            digitsContainer.appendChild(buildDigitColumn(ch));
        }
    }

    function updateSlotDigits(newValue) {
        const newStr = formatNumber(newValue);
        currentDisplayValue = newValue;
        const h = getDigitHeight();

        const existingCols = digitsContainer.querySelectorAll('.ucalc-digit-col');

        if (existingCols.length !== newStr.length) {
            digitsContainer.innerHTML = '';
            for (let i = 0; i < newStr.length; i++) {
                const col = buildDigitColumn(newStr[i]);
                col.style.opacity = '0';
                col.style.transform = 'translateY(10px)';
                digitsContainer.appendChild(col);
                setTimeout(() => {
                    col.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    col.style.opacity = '1';
                    col.style.transform = 'translateY(0)';
                }, i * 40);
            }
            return;
        }

        existingCols.forEach((col, i) => {
            const ch = newStr[i];
            if (ch === ' ') return;
            if (col.dataset.char === ch) return;

            col.dataset.char = ch;
            const strip = col.querySelector('.ucalc-digit-strip');
            if (!strip) return;

            const idx = CHARS.indexOf(ch);
            if (idx >= 0) {
                strip.style.transform = `translateY(-${idx * h}rem)`;
            }
        });
    }

    initDigits();

    // ═══════════════════════════════════════
    // CIRCULAR PROGRESS RING
    // ═══════════════════════════════════════
    const ring = document.getElementById('ucalcRing');
    const MAX_VALUE = 420000; // max possible: (140k+60k+100k extras) * 1.4
    const CIRCUMFERENCE = 2 * Math.PI * 52;

    function updateRing(total) {
        const pct = Math.min(total / MAX_VALUE, 1);
        const offset = CIRCUMFERENCE * (1 - pct);
        ring.style.strokeDashoffset = offset;
    }

    updateRing(30000);

    // ═══════════════════════════════════════
    // DYNAMIC AURA
    // ═══════════════════════════════════════
    const aura = document.getElementById('ucalcAura');

    function updateAura(total) {
        const intensity = Math.min(total / MAX_VALUE, 1);
        const size = 40 + intensity * 60;
        aura.style.background = `radial-gradient(circle, rgba(255, 45, 120, ${0.08 + intensity * 0.2}) 0%, transparent 70%)`;
        aura.style.inset = `-${size}px`;
    }

    // ═══════════════════════════════════════
    // 3D TILT ON CARDS
    // ═══════════════════════════════════════
    const tiltables = document.querySelectorAll('.ucalc-card, .ucalc-toggle-card, .ucalc-timeline-card');
    const MAX_TILT = 3;

    tiltables.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const rotateY = (x - 0.5) * MAX_TILT * 2;
            const rotateX = (0.5 - y) * MAX_TILT * 2;
            el.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });

    // ═══════════════════════════════════════
    // CURSOR-FOLLOWING GLOW
    // ═══════════════════════════════════════
    const glowables = document.querySelectorAll('.ucalc-card, .ucalc-toggle, .ucalc-timeline-card');

    glowables.forEach(el => {
        const glow = el.querySelector('.ucalc-card-glow, .ucalc-toggle-glow, .ucalc-timeline-glow');
        if (!glow) return;

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            glow.style.setProperty('--mx', x + '%');
            glow.style.setProperty('--my', y + '%');
        });
    });

    // ═══════════════════════════════════════
    // PARTICLE BURST
    // ═══════════════════════════════════════
    function spawnParticles(cx, cy) {
        for (let i = 0; i < 8; i++) {
            const p = document.createElement('div');
            p.className = 'ucalc-particle';
            const angle = (Math.PI * 2 * i) / 8 + (Math.random() - 0.5) * 0.5;
            const dist = 30 + Math.random() * 40;
            p.style.left = cx + 'px';
            p.style.top = cy + 'px';
            p.style.setProperty('--px', Math.cos(angle) * dist + 'px');
            p.style.setProperty('--py', Math.sin(angle) * dist + 'px');
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 600);
        }
    }

    // ═══════════════════════════════════════
    // MAGNETIC CTA BUTTON
    // ═══════════════════════════════════════
    const ctaBtn = document.getElementById('ucalcCta');
    if (ctaBtn) {
        const MAGNETIC_RANGE = 80;
        const MAGNETIC_STRENGTH = 0.35;

        document.addEventListener('mousemove', (e) => {
            const rect = ctaBtn.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < MAGNETIC_RANGE) {
                const pull = (1 - dist / MAGNETIC_RANGE) * MAGNETIC_STRENGTH;
                ctaBtn.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`;
            } else {
                ctaBtn.style.transform = '';
            }
        });
    }

    // ═══════════════════════════════════════
    // TOOLTIPS
    // ═══════════════════════════════════════
    const tooltip = document.getElementById('ucalcTooltip');
    const tooltipCards = document.querySelectorAll('[data-tooltip]');

    if (tooltip && tooltipCards.length) {
        let tooltipTimeout;

        tooltipCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const text = card.dataset.tooltip;
                if (!text) return;
                clearTimeout(tooltipTimeout);
                tooltip.textContent = text;
                tooltipTimeout = setTimeout(() => {
                    tooltip.classList.add('visible');
                }, 500); // delay before show
            });

            card.addEventListener('mousemove', (e) => {
                tooltip.style.left = (e.clientX + 16) + 'px';
                tooltip.style.top = (e.clientY - 10) + 'px';

                // Prevent going off right edge
                const rect = tooltip.getBoundingClientRect();
                if (rect.right > window.innerWidth - 16) {
                    tooltip.style.left = (e.clientX - rect.width - 16) + 'px';
                }
            });

            card.addEventListener('mouseleave', () => {
                clearTimeout(tooltipTimeout);
                tooltip.classList.remove('visible');
            });
        });
    }

    // ═══════════════════════════════════════
    // SUMMARY MODAL
    // ═══════════════════════════════════════
    const modal = document.getElementById('ucalcModal');
    const modalClose = document.getElementById('ucalcModalClose');
    const modalRows = document.getElementById('ucalcModalRows');
    const modalTotal = document.getElementById('ucalcModalTotal');
    const modalDiscount = document.getElementById('ucalcModalDiscount');
    const summaryBtn = document.getElementById('showSummary');

    function getSelectedLabel(type) {
        const active = document.querySelector(`.ucalc-card[data-type="${type}"].active`);
        if (!active) return '-';
        return active.querySelector('.ucalc-card-title')?.textContent || '-';
    }

    function getTimelineLabel() {
        const active = document.querySelector('.ucalc-timeline-card.active');
        if (!active) return 'Стандартный';
        return active.querySelector('.ucalc-timeline-title')?.textContent || 'Стандартный';
    }

    function getCheckedExtras() {
        const list = [];
        document.querySelectorAll('.ucalc-toggle input:checked').forEach(cb => {
            const label = cb.closest('.ucalc-toggle').querySelector('.ucalc-toggle-name');
            const price = cb.closest('.ucalc-toggle').querySelector('.ucalc-toggle-price');
            if (label) {
                list.push({
                    name: label.textContent,
                    price: price ? price.textContent : ''
                });
            }
        });
        return list;
    }

    function openSummary() {
        if (!modal || !modalRows) return;
        modalRows.innerHTML = '';

        // Project type
        addRow('Тип проекта', getSelectedLabel('project'));
        // Design
        addRow('Дизайн', getSelectedLabel('design'));
        // Extras
        const extras = getCheckedExtras();
        if (extras.length) {
            extras.forEach(ex => addRow(ex.name, ex.price));
        } else {
            addRow('Доп. опции', 'Нет');
        }
        // Timeline
        addRow('Сроки', getTimelineLabel() + (multiplier > 1 ? ` (×${multiplier})` : ''));

        // Total
        const total = getTotal();
        modalTotal.textContent = formatNumber(total) + ' ₽';

        // Discount
        if (hasDiscount && modalDiscount) {
            modalDiscount.style.display = 'block';
        }

        modal.classList.add('open');
    }

    function addRow(label, value) {
        const row = document.createElement('div');
        row.className = 'ucalc-modal-row';
        row.innerHTML = `<span class="ucalc-modal-row-label">${label}</span><span class="ucalc-modal-row-value">${value}</span>`;
        modalRows.appendChild(row);
    }

    function closeSummary() {
        if (modal) modal.classList.remove('open');
    }

    if (summaryBtn) {
        summaryBtn.addEventListener('click', openSummary);
    }
    if (modalClose) {
        modalClose.addEventListener('click', closeSummary);
    }
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeSummary();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('open')) closeSummary();
        });
    }

    // ═══════════════════════════════════════
    // EASTER EGG: CLICK $ FOR DISCOUNT
    // ═══════════════════════════════════════
    const canvas = document.getElementById('calcParticles');
    const toast = document.getElementById('ucalcToast');
    let discountActivated = false;

    if (canvas) {
        // Canvas stays pointer-events: none; Easter egg uses document click
        const ctx = canvas.getContext('2d');
        let W, H;
        const symbols = [];
        const SYMBOL_COUNT = 35;

        function resize() {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        class DollarSymbol {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * W;
                this.y = Math.random() * H;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = -0.15 - Math.random() * 0.35;
                this.size = 12 + Math.random() * 18;
                this.alpha = 0.06 + Math.random() * 0.14;
                this.pink = Math.random() > 0.5;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotSpeed = (Math.random() - 0.5) * 0.02;
                this.scaleY = 1;
                this.spinPhase = Math.random() * Math.PI * 2;
                this.spinSpeed = 0.008 + Math.random() * 0.015;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.rotation += this.rotSpeed;
                this.spinPhase += this.spinSpeed;
                this.scaleY = Math.cos(this.spinPhase);

                if (this.y < -30) {
                    this.y = H + 30;
                    this.x = Math.random() * W;
                }
                if (this.x < -30) this.x = W + 30;
                if (this.x > W + 30) this.x = -30;
            }
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.scale(1, this.scaleY);

                ctx.font = `700 ${this.size}px "DM Sans", sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                if (this.pink) {
                    ctx.fillStyle = `rgba(255, 45, 120, ${this.alpha})`;
                    ctx.shadowColor = 'rgba(255, 45, 120, 0.15)';
                    ctx.shadowBlur = 8;
                } else {
                    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha * 0.7})`;
                    ctx.shadowColor = 'rgba(255, 255, 255, 0.08)';
                    ctx.shadowBlur = 6;
                }

                ctx.fillText('$', 0, 0);
                ctx.restore();
            }
            hitTest(px, py) {
                const dx = px - this.x;
                const dy = py - this.y;
                return Math.sqrt(dx * dx + dy * dy) < this.size;
            }
        }

        for (let i = 0; i < SYMBOL_COUNT; i++) {
            symbols.push(new DollarSymbol());
        }

        function animateSymbols() {
            ctx.clearRect(0, 0, W, H);
            symbols.forEach(s => {
                s.update();
                s.draw();
            });
            requestAnimationFrame(animateSymbols);
        }
        animateSymbols();

        // Easter egg: click on $ symbol to activate discount
        // We listen on document and check if no interactive element was clicked
        document.addEventListener('click', (e) => {
            if (discountActivated) return;
            // Don't trigger if clicking on interactive elements
            if (e.target.closest('button, a, input, label, .ucalc-card, .ucalc-toggle, .ucalc-timeline-card, .ucalc-result, .ucalc-modal, .chat-widget, .nav, .faq-item')) return;

            const rect = canvas.getBoundingClientRect();
            const px = e.clientX - rect.left;
            const py = e.clientY - rect.top;

            for (const s of symbols) {
                if (s.hitTest(px, py)) {
                    discountActivated = true;
                    hasDiscount = true;

                    // Spawn burst at click
                    spawnParticles(e.clientX, e.clientY);

                    // Flash the symbol
                    s.alpha = 0.8;
                    s.size *= 2;
                    setTimeout(() => { s.alpha = 0.2; s.size /= 2; }, 400);

                    // Show toast
                    if (toast) {
                        toast.classList.add('show');
                        setTimeout(() => toast.classList.remove('show'), 3500);
                    }

                    // Recalculate with discount
                    recalculate();
                    break;
                }
            }
        });
    }

    // ═══════════════════════════════════════
    // KEYBOARD NAVIGATION
    // ═══════════════════════════════════════
    document.addEventListener('keydown', (e) => {
        // Don't navigate if modal is open
        if (modal && modal.classList.contains('open')) return;
        if (e.key === 'ArrowRight' && currentStep < totalSteps - 1) goToStep(currentStep + 1);
        if (e.key === 'ArrowLeft' && currentStep > 0) goToStep(currentStep - 1);
    });

    // ═══════════════════════════════════════
    // SWIPE SUPPORT
    // ═══════════════════════════════════════
    let touchStartX = 0;
    const viewport = document.querySelector('.ucalc-viewport');
    if (viewport) {
        viewport.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        viewport.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
                if (diff > 0 && currentStep < totalSteps - 1) goToStep(currentStep + 1);
                else if (diff < 0 && currentStep > 0) goToStep(currentStep - 1);
            }
        }, { passive: true });
    }

    // ═══════════════════════════════════════
    // MOBILE BOTTOM SHEET
    // ═══════════════════════════════════════
    const resultPanel = document.getElementById('ucalcResult');
    const handle = document.getElementById('ucalcHandle');

    if (resultPanel && handle && window.innerWidth <= 900) {
        let isCollapsed = true;
        resultPanel.classList.add('collapsed');

        handle.addEventListener('click', () => {
            isCollapsed = !isCollapsed;
            resultPanel.classList.toggle('collapsed', isCollapsed);
        });

        // Drag support
        let sheetStartY = 0;
        let sheetDragging = false;

        handle.addEventListener('touchstart', (e) => {
            sheetStartY = e.touches[0].clientY;
            sheetDragging = true;
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (!sheetDragging) return;
            const dy = e.touches[0].clientY - sheetStartY;
            if (dy > 40 && !isCollapsed) {
                isCollapsed = true;
                resultPanel.classList.add('collapsed');
                sheetDragging = false;
            } else if (dy < -40 && isCollapsed) {
                isCollapsed = false;
                resultPanel.classList.remove('collapsed');
                sheetDragging = false;
            }
        }, { passive: true });

        document.addEventListener('touchend', () => {
            sheetDragging = false;
        }, { passive: true });
    }

})();
