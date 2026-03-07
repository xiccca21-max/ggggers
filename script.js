/**
 * GERS - Ultra Modern Technical Website
 * Interactive animations and effects
 */

// ═══════════════════════════════════════════════════════════════════
// PRELOADER
// ═══════════════════════════════════════════════════════════════════

class Preloader {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.progressBar = document.getElementById('progressBar');
        this.statusText = document.getElementById('statusText');
        this.statusPercent = document.getElementById('statusPercent');
        this.progress = 0;
        
        this.messages = [
            'ИНИЦИАЛИЗАЦИЯ СИСТЕМЫ',
            'ЗАГРУЗКА МОДУЛЕЙ',
            'ПОДКЛЮЧЕНИЕ К СЕРВЕРУ',
            'ЗАГРУЗКА РЕСУРСОВ',
            'ИНИЦИАЛИЗАЦИЯ ИНТЕРФЕЙСА',
            'ГОТОВО'
        ];
        
        document.body.classList.add('loading');
        this.animate();
    }
    
    animate() {
        const duration = 500;
        const start = performance.now();
        
        const update = (currentTime) => {
            const elapsed = currentTime - start;
            this.progress = Math.min((elapsed / duration) * 100, 100);
            
            if (this.progressBar) this.progressBar.style.width = this.progress + '%';
            if (this.statusPercent) this.statusPercent.textContent = Math.floor(this.progress) + '%';
            
            const messageIndex = Math.min(
                Math.floor(this.progress / (100 / this.messages.length)),
                this.messages.length - 1
            );
            if (this.statusText) this.statusText.textContent = this.messages[messageIndex];
            
            if (this.progress < 100) {
                requestAnimationFrame(update);
            } else {
                this.complete();
            }
        };
        
        requestAnimationFrame(update);
    }
    
    complete() {
        setTimeout(() => {
            if (this.preloader) this.preloader.classList.add('hidden');
            document.body.classList.remove('loading');
            
            setTimeout(() => {
                window.dispatchEvent(new Event('preloaderComplete'));
            }, 200);
        }, 100);
    }
}

// ═══════════════════════════════════════════════════════════════════
// SCROLL PROGRESS BAR
// ═══════════════════════════════════════════════════════════════════

class ScrollProgress {
    constructor() {
        this.progressBar = document.getElementById('scrollProgress');
        window.addEventListener('scroll', () => this.update());
    }
    
    update() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        this.progressBar.style.width = progress + '%';
    }
}

// ═══════════════════════════════════════════════════════════════════
// FLOATING CTA
// ═══════════════════════════════════════════════════════════════════

class FloatingCTA {
    constructor() {
        this.cta = document.getElementById('floatingCta');
        if (!this.cta) return;
        
        this.showThreshold = 400; // px from top
        this.hideThreshold = 200; // px from bottom
        
        window.addEventListener('scroll', () => this.update());
    }
    
    update() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        const scrollBottom = docHeight - scrollTop - windowHeight;
        
        if (scrollTop > this.showThreshold && scrollBottom > this.hideThreshold) {
            this.cta.classList.add('visible');
        } else {
            this.cta.classList.remove('visible');
        }
    }
}

// ═══════════════════════════════════════════════════════════════════
// LEAD MAGNET POPUP
// ═══════════════════════════════════════════════════════════════════

class LeadMagnetPopup {
    constructor() {
        this.popup = document.getElementById('leadPopup');
        this.closeBtn = document.getElementById('leadPopupClose');
        if (!this.popup) return;
        
        this.shown = sessionStorage.getItem('leadPopupShown') === 'true';
        this.scrollThreshold = 0.5; // 50% scroll
        
        if (!this.shown) {
            window.addEventListener('scroll', () => this.checkScroll());
            this.popup.querySelector('.lead-popup-overlay').addEventListener('click', () => this.hide());
            this.closeBtn.addEventListener('click', () => this.hide());
            
            // Also show on exit intent (mouse leaving viewport)
            document.addEventListener('mouseout', (e) => {
                if (e.clientY < 10 && !this.shown) {
                    this.show();
                }
            });
        }
    }
    
    checkScroll() {
        if (this.shown) return;
        
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollTop / docHeight;
        
        if (scrollPercent >= this.scrollThreshold) {
            this.show();
        }
    }
    
    show() {
        this.popup.classList.add('visible');
        this.shown = true;
        sessionStorage.setItem('leadPopupShown', 'true');
    }
    
    hide() {
        this.popup.classList.remove('visible');
    }
}

// ═══════════════════════════════════════════════════════════════════
// THEME TOGGLE
// ═══════════════════════════════════════════════════════════════════

class ThemeToggle {
    constructor() {
        this.toggle = document.getElementById('themeToggle');
        if (!this.toggle) return;
        
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.applyTheme(this.currentTheme);
        
        this.toggle.addEventListener('click', () => this.switchTheme());
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }
    
    switchTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.currentTheme);
    }
}

// ═══════════════════════════════════════════════════════════════════
// SOUND EFFECTS
// ═══════════════════════════════════════════════════════════════════

class SoundEffects {
    constructor() {
        this.enabled = false;
        this.toggle = document.getElementById('soundToggle');
        this.audioContext = null;
        
        if (!this.toggle) return;
        this.init();
    }
    
    init() {
        this.toggle.addEventListener('click', () => this.toggleSound());
        
        const elements = document.querySelectorAll('a, button, .project-card, .service-item, .team-member');
        elements.forEach(el => {
            el.addEventListener('mouseenter', () => this.playHover());
            el.addEventListener('click', () => this.playClick());
        });
    }
    
    toggleSound() {
        this.enabled = !this.enabled;
        this.toggle.classList.toggle('muted', !this.enabled);
        
        if (this.enabled && !this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }
    
    playHover() {
        if (!this.enabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.03, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }
    
    playClick() {
        if (!this.enabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = 400;
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.15);
    }
}

// ═══════════════════════════════════════════════════════════════════
// WEB NETWORK BACKGROUND (Spider Web Effect)
// ═══════════════════════════════════════════════════════════════════

class WebNetwork {
    constructor() {
        this.canvas = document.getElementById('webCanvas');
        if (!this.canvas || getComputedStyle(this.canvas).display === 'none') return;
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.nodeCount = 100;
        this.connectionDistance = 150;
        
        this.init();
        this.animate();
        this.bindEvents();
    }
    
    init() {
        this.resize();
        this.createNodes();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createNodes() {
        this.nodes = [];
        for (let i = 0; i < this.nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                baseRadius: Math.random() * 2 + 1
            });
        }
    }
    
    drawNodes() {
        this.nodes.forEach(node => {
            // Update position
            node.x += node.vx;
            node.y += node.vy;
            
            // Bounce off edges
            if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;
            
            // Mouse interaction - nodes get pushed away
            if (this.mouse.x !== null) {
                const dx = node.x - this.mouse.x;
                const dy = node.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < this.mouse.radius) {
                    const force = (this.mouse.radius - dist) / this.mouse.radius;
                    node.x += (dx / dist) * force * 3;
                    node.y += (dy / dist) * force * 3;
                    node.radius = node.baseRadius * (1 + force);
                } else {
                    node.radius = node.baseRadius;
                }
            }
            
            // Draw node
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            this.ctx.fill();
            
            // Glow effect for larger nodes
            if (node.radius > 2) {
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, node.radius * 2, 0, Math.PI * 2);
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                this.ctx.fill();
            }
        });
    }
    
    drawConnections() {
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const dx = this.nodes[i].x - this.nodes[j].x;
                const dy = this.nodes[i].y - this.nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < this.connectionDistance) {
                    const opacity = (1 - dist / this.connectionDistance) * 0.5;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
                    this.ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
                    this.ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }
        
        // Connect to mouse
        if (this.mouse.x !== null) {
            this.nodes.forEach(node => {
                const dx = node.x - this.mouse.x;
                const dy = node.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < this.mouse.radius * 1.5) {
                    const opacity = (1 - dist / (this.mouse.radius * 1.5)) * 0.8;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(node.x, node.y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    this.ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            });
            
            // Draw mouse node
            this.ctx.beginPath();
            this.ctx.arc(this.mouse.x, this.mouse.y, 4, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(0, 212, 255, 0.8)';
            this.ctx.fill();
            
            // Mouse glow
            this.ctx.beginPath();
            this.ctx.arc(this.mouse.x, this.mouse.y, 15, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(0, 212, 255, 0.1)';
            this.ctx.fill();
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawConnections();
        this.drawNodes();
        
        requestAnimationFrame(() => this.animate());
    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createNodes();
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }
}

// ═══════════════════════════════════════════════════════════════════
// GRID CANVAS BACKGROUND
// ═══════════════════════════════════════════════════════════════════

class GridCanvas {
    constructor() {
        this.canvas = document.getElementById('gridCanvas');
        if (!this.canvas || !this.canvas.offsetParent) return; // disabled
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.gridPoints = [];
        this.mouse = { x: 0, y: 0 };
        this.time = 0;
        
        this.init();
        this.animate();
        this.bindEvents();
    }
    
    init() {
        this.resize();
        this.createGrid();
        this.createParticles();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createGrid() {
        this.gridPoints = [];
        const spacing = 80;
        
        for (let x = 0; x < this.canvas.width + spacing; x += spacing) {
            for (let y = 0; y < this.canvas.height + spacing; y += spacing) {
                this.gridPoints.push({
                    x: x,
                    y: y,
                    baseX: x,
                    baseY: y,
                    size: Math.random() * 1.5 + 0.5,
                    alpha: Math.random() * 0.3 + 0.1
                });
            }
        }
    }
    
    createParticles() {
        this.particles = [];
        const count = 50;
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                alpha: Math.random() * 0.5 + 0.2,
                hue: Math.random() * 30 + 180 // Cyan range
            });
        }
    }
    
    drawGrid() {
        const { ctx, gridPoints, mouse, time } = this;
        
        // Draw grid lines
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.03)';
        ctx.lineWidth = 1;
        
        const spacing = 80;
        
        // Vertical lines
        for (let x = 0; x < this.canvas.width + spacing; x += spacing) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.canvas.height);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y < this.canvas.height + spacing; y += spacing) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.canvas.width, y);
            ctx.stroke();
        }
        
        // Draw grid points with mouse interaction
        gridPoints.forEach(point => {
            const dx = mouse.x - point.baseX;
            const dy = mouse.y - point.baseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = 200;
            
            if (dist < maxDist) {
                const force = (1 - dist / maxDist) * 20;
                point.x = point.baseX - (dx / dist) * force;
                point.y = point.baseY - (dy / dist) * force;
            } else {
                point.x += (point.baseX - point.x) * 0.1;
                point.y += (point.baseY - point.y) * 0.1;
            }
            
            // Subtle wave animation
            const wave = Math.sin(time * 0.002 + point.baseX * 0.01) * 2;
            
            ctx.beginPath();
            ctx.arc(point.x, point.y + wave, point.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 0, 0, ${point.alpha})`;
            ctx.fill();
        });
    }
    
    drawParticles() {
        const { ctx, particles, time } = this;
        
        particles.forEach((p, i) => {
            // Update position
            p.x += p.vx;
            p.y += p.vy;
            
            // Wrap around
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;
            
            // Draw particle
            const glow = Math.sin(time * 0.003 + i) * 0.2 + 0.8;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue}, 100%, 50%, ${p.alpha * glow})`;
            ctx.fill();
            
            // Connect nearby particles
            particles.slice(i + 1).forEach(p2 => {
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(0, 0, 0, ${0.1 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        });
    }
    
    drawTechElements() {
        const { ctx, time } = this;
        
        // Scanning line effect
        const scanY = (time * 0.1) % this.canvas.height;
        const gradient = ctx.createLinearGradient(0, scanY - 50, 0, scanY + 50);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.03)');
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, scanY - 50, this.canvas.width, 100);
        
        // Corner data displays
        ctx.font = '10px JetBrains Mono';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        
        const data = [
            `SYS.STATUS: ACTIVE`,
            `GRID.NODES: ${this.gridPoints.length}`,
            `PARTICLES: ${this.particles.length}`,
            `FRAME: ${Math.floor(time / 16.67)}`
        ];
        
        data.forEach((text, i) => {
            ctx.fillText(text, 30, this.canvas.height - 60 + i * 14);
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawGrid();
        this.drawParticles();
        this.drawTechElements();
        
        this.time += 16.67;
        requestAnimationFrame(() => this.animate());
    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createGrid();
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
}

// ═══════════════════════════════════════════════════════════════════
// COORDINATES & TIME DISPLAY
// ═══════════════════════════════════════════════════════════════════

class TechMeta {
    constructor() {
        this.coordsEl = document.getElementById('coords');
        this.timeEl = document.getElementById('time');
        
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
        
        window.addEventListener('mousemove', (e) => this.updateCoords(e));
    }
    
    updateCoords(e) {
        if (!this.coordsEl) return;
        const x = (e.clientX / window.innerWidth).toFixed(3);
        const y = (e.clientY / window.innerHeight).toFixed(3);
        this.coordsEl.textContent = `x: ${x} y: ${y}`;
    }
    
    updateTime() {
        if (!this.timeEl) return;
        const now = new Date();
        const time = now.toTimeString().split(' ')[0];
        this.timeEl.textContent = time;
    }
}

// ═══════════════════════════════════════════════════════════════════
// COUNTER ANIMATION
// ═══════════════════════════════════════════════════════════════════

class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-value');
        this.animated = false;
        
        this.observe();
    }
    
    observe() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated) {
                    this.animated = true;
                    this.animateCounters();
                }
            });
        }, { threshold: 0.5 });
        
        this.counters.forEach(counter => observer.observe(counter));
    }
    
    animateCounters() {
        this.counters.forEach(counter => {
            const target = parseInt(counter.dataset.value);
            const duration = 2000;
            const start = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const eased = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(eased * target);
                
                counter.textContent = current;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    counter.textContent = target;
                }
            };
            
            requestAnimationFrame(animate);
        });
    }
}

// ═══════════════════════════════════════════════════════════════════
// SCROLL REVEAL ANIMATIONS
// ═══════════════════════════════════════════════════════════════════

class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.reveal-section, .project-card, .service-item, .metric, .team-member');
        this.observe();
    }
    
    observe() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 50);
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        this.elements.forEach(el => observer.observe(el));
    }
}

// ═══════════════════════════════════════════════════════════════════
// MANIFESTO SCROLL REVEAL (kaijuu-style text reveal)
// ═══════════════════════════════════════════════════════════════════

class ManifestoReveal {
    constructor() {
        this.lines = document.querySelectorAll('.manifesto-line[data-reveal]');
        if (!this.lines.length) return;
        this.observe();
    }

    observe() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                } else {
                    entry.target.classList.remove('revealed');
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -15% 0px'
        });

        this.lines.forEach(line => observer.observe(line));
    }
}

// ═══════════════════════════════════════════════════════════════════
// ABOUT "READ MORE" TOGGLE
// ═══════════════════════════════════════════════════════════════════
(function() {
    const btn = document.getElementById('aboutMoreBtn');
    const content = document.getElementById('aboutMoreContent');
    if (btn && content) {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            content.classList.toggle('open');
            btn.firstChild.textContent = content.classList.contains('open') ? 'Свернуть ' : 'Подробнее ';
        });
    }
})();

// ═══════════════════════════════════════════════════════════════════
// METRIC PROGRESS CIRCLES
// ═══════════════════════════════════════════════════════════════════

class MetricProgress {
    constructor() {
        this.circles = document.querySelectorAll('.metric-progress');
        this.observe();
    }
    
    observe() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCircle(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        this.circles.forEach(circle => observer.observe(circle));
    }
    
    animateCircle(circle) {
        const percent = parseInt(circle.dataset.percent);
        const circumference = 2 * Math.PI * 45; // r = 45
        const offset = circumference - (percent / 100) * circumference;
        
        setTimeout(() => {
            circle.style.strokeDashoffset = offset;
        }, 300);

        // Animate the metric-value counter next to this circle
        const metricVisual = circle.closest('.metric-visual');
        if (metricVisual) {
            const valueEl = metricVisual.querySelector('.metric-value[data-target]');
            if (valueEl && !valueEl.dataset.animated) {
                valueEl.dataset.animated = 'true';
                const target = parseInt(valueEl.dataset.target);
                const duration = 2000;
                const start = performance.now();
                const animate = (now) => {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 4);
                    const current = Math.floor(eased * target);
                    valueEl.textContent = current + '%';
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        valueEl.textContent = target + '%';
                    }
                };
                setTimeout(() => requestAnimationFrame(animate), 300);
            }
        }
    }
}

// ═══════════════════════════════════════════════════════════════════
// MAGNETIC BUTTONS
// ═══════════════════════════════════════════════════════════════════

class MagneticElements {
    constructor() {
        this.elements = document.querySelectorAll('.submit-btn, .nav-link');
        this.bind();
    }
    
    bind() {
        this.elements.forEach(el => {
            el.addEventListener('mousemove', (e) => this.magnetize(e, el));
            el.addEventListener('mouseleave', () => this.reset(el));
        });
    }
    
    magnetize(e, el) {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    }
    
    reset(el) {
        el.style.transform = 'translate(0, 0)';
    }
}

// ═══════════════════════════════════════════════════════════════════
// SMOOTH SCROLL
// ═══════════════════════════════════════════════════════════════════

class SmoothScroll {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        this.bind();
    }
    
    bind() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ═══════════════════════════════════════════════════════════════════
// CURSOR TRAIL EFFECT
// ═══════════════════════════════════════════════════════════════════

class CursorTrail {
    constructor() {
        this.trail = [];
        this.trailLength = 20;
        this.mouse = { x: 0, y: 0 };
        
        this.createTrail();
        this.animate();
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
    
    createTrail() {
        for (let i = 0; i < this.trailLength; i++) {
            const dot = document.createElement('div');
            dot.className = 'cursor-dot';
            dot.style.cssText = `
                position: fixed;
                width: ${4 - i * 0.15}px;
                height: ${4 - i * 0.15}px;
                background: rgba(0, 0, 0, ${0.8 - i * 0.04});
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transition: transform 0.1s ease;
            `;
            document.body.appendChild(dot);
            this.trail.push({
                el: dot,
                x: 0,
                y: 0
            });
        }
    }
    
    animate() {
        let x = this.mouse.x;
        let y = this.mouse.y;
        
        this.trail.forEach((dot, i) => {
            const nextDot = this.trail[i + 1] || this.trail[0];
            
            dot.x += (x - dot.x) * (0.4 - i * 0.01);
            dot.y += (y - dot.y) * (0.4 - i * 0.01);
            
            dot.el.style.left = dot.x + 'px';
            dot.el.style.top = dot.y + 'px';
            
            x = dot.x;
            y = dot.y;
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ═══════════════════════════════════════════════════════════════════
// PROJECT CARD TILT EFFECT
// ═══════════════════════════════════════════════════════════════════

class CardTilt {
    constructor() {
        /* legacy project-card tilt */
        this.cards = document.querySelectorAll('.project-card');
        this.bind();

        /* ── NEW: 3D tilt for .bento-card inside .tilt-wrap ── */
        this.catCards = document.querySelectorAll('.tilt-wrap .bento-card');
        this.bindCat();
    }

    /* ---------- legacy ---------- */
    bind() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.tilt(e, card));
            card.addEventListener('mouseleave', () => this.reset(card));
        });
    }
    tilt(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    }
    reset(card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    }

    /* ---------- NEW tech cat-card 3D tilt ---------- */
    bindCat() {
        this.catCards.forEach(card => {
            const MAX_TILT = 15;         // max degrees
            const PERSPECTIVE = 1200;    // px
            const SCALE_HOVER = 1.03;
            let raf = null;
            let currentRX = 0, currentRY = 0, targetRX = 0, targetRY = 0;
            let mouseX = 0.5, mouseY = 0.5;

            const lerp = (a, b, t) => a + (b - a) * t;

            /* smooth loop - gives buttery animation */
            const animate = () => {
                currentRX = lerp(currentRX, targetRX, 0.08);
                currentRY = lerp(currentRY, targetRY, 0.08);
                card.style.transform =
                    `perspective(${PERSPECTIVE}px) rotateX(${currentRX}deg) rotateY(${currentRY}deg) scale3d(${SCALE_HOVER},${SCALE_HOVER},${SCALE_HOVER})`;

                /* pass cursor pos to CSS for radial glow */
                card.style.setProperty('--mouse-x', `${mouseX * 100}%`);
                card.style.setProperty('--mouse-y', `${mouseY * 100}%`);

                /* rotating border glow angle */
                const angle = Math.atan2(mouseY - 0.5, mouseX - 0.5) * (180 / Math.PI);
                card.style.setProperty('--border-angle', `${angle}deg`);

                if (Math.abs(currentRX - targetRX) > 0.01 || Math.abs(currentRY - targetRY) > 0.01) {
                    raf = requestAnimationFrame(animate);
                } else {
                    raf = null;
                }
            };

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                mouseX = (e.clientX - rect.left) / rect.width;
                mouseY = (e.clientY - rect.top) / rect.height;
                targetRX = (mouseY - 0.5) * -MAX_TILT;
                targetRY = (mouseX - 0.5) * MAX_TILT;
                if (!raf) raf = requestAnimationFrame(animate);
            });

            card.addEventListener('mouseleave', () => {
                targetRX = 0;
                targetRY = 0;
                if (!raf) raf = requestAnimationFrame(animate);
                /* smoothly return transform to identity */
                const settle = () => {
                    currentRX = lerp(currentRX, 0, 0.06);
                    currentRY = lerp(currentRY, 0, 0.06);
                    card.style.transform =
                        `perspective(${PERSPECTIVE}px) rotateX(${currentRX}deg) rotateY(${currentRY}deg) scale3d(1,1,1)`;
                    if (Math.abs(currentRX) > 0.05 || Math.abs(currentRY) > 0.05) {
                        requestAnimationFrame(settle);
                    } else {
                        card.style.transform = '';
                    }
                };
                requestAnimationFrame(settle);
            });
        });
    }
}

// ═══════════════════════════════════════════════════════════════════
// GLITCH TEXT EFFECT
// ═══════════════════════════════════════════════════════════════════

class GlitchEffect {
    constructor() {
        this.logo = document.querySelector('.logo-text');
        if (!this.logo) return;
        
        this.originalText = this.logo.textContent;
        this.glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        this.logo.addEventListener('mouseenter', () => this.glitch());
    }
    
    glitch() {
        if (!this.logo) return;
        let iterations = 0;
        const interval = setInterval(() => {
            this.logo.textContent = this.originalText
                .split('')
                .map((char, i) => {
                    if (i < iterations) return this.originalText[i];
                    return this.glitchChars[Math.floor(Math.random() * this.glitchChars.length)];
                })
                .join('');
            
            iterations += 1/3;
            
            if (iterations >= this.originalText.length) {
                clearInterval(interval);
                this.logo.textContent = this.originalText;
            }
        }, 30);
    }
}

// ═══════════════════════════════════════════════════════════════════
// PARALLAX SECTIONS
// ═══════════════════════════════════════════════════════════════════

class ParallaxEffect {
    constructor() {
        this.sections = document.querySelectorAll('section');
        
        window.addEventListener('scroll', () => this.parallax());
    }
    
    parallax() {
        const scrollY = window.scrollY;
        
        this.sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const speed = 0.05;
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const yPos = (rect.top - window.innerHeight / 2) * speed;
                section.style.backgroundPosition = `center ${yPos}px`;
            }
        });
    }
}

// ═══════════════════════════════════════════════════════════════════
// TYPING EFFECT FOR HERO TAG
// ═══════════════════════════════════════════════════════════════════

class TypeWriter {
    constructor() {
        this.element = document.querySelector('.tag-text');
        if (!this.element) return;
        
        this.text = this.element.textContent;
        this.element.textContent = '';
        this.index = 0;
        
        setTimeout(() => this.type(), 1500);
    }
    
    type() {
        if (!this.element) return;
        if (this.index < this.text.length) {
            this.element.textContent += this.text.charAt(this.index);
            this.index++;
            setTimeout(() => this.type(), 50);
        }
    }
}

// ═══════════════════════════════════════════════════════════════════
// FORM INTERACTIONS
// ═══════════════════════════════════════════════════════════════════

class FormEffects {
    constructor() {
        const form = document.querySelector('.contact-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitAnimation(form);
            });
        }
    }
    
    submitAnimation(form) {
        const btn = form.querySelector('.submit-btn');
        const originalText = btn.querySelector('.btn-text').textContent;
        
        btn.querySelector('.btn-text').textContent = 'Отправка...';
        btn.disabled = true;
        
        setTimeout(() => {
            btn.querySelector('.btn-text').textContent = 'Отправлено ✓';
            btn.style.borderColor = '#1a1a1a';
            btn.style.color = '#1a1a1a';
            
            setTimeout(() => {
                btn.querySelector('.btn-text').textContent = originalText;
                btn.disabled = false;
                btn.style.borderColor = '';
                btn.style.color = '';
                form.reset();
            }, 2000);
        }, 1500);
    }
}

// ═══════════════════════════════════════════════════════════════════
// TESTIMONIALS SLIDER
// ═══════════════════════════════════════════════════════════════════

class TestimonialsSlider {
    constructor() {
        this.cards = document.querySelectorAll('.testimonial-card');
        this.prevBtn = document.getElementById('prevTestimonial');
        this.nextBtn = document.getElementById('nextTestimonial');
        this.counterCurrent = document.getElementById('testimonialCurrent');
        this.counterTotal = document.getElementById('testimonialTotal');
        this.currentIndex = 0;
        this.isAnimating = false;
        
        if (this.cards.length === 0) return;
        
        if (this.counterTotal) this.counterTotal.textContent = this.cards.length;
        this.init();
    }
    
    init() {
        this.prevBtn?.addEventListener('click', () => { if (!this.isAnimating) { this.prev(); this.resetAutoPlay(); } });
        this.nextBtn?.addEventListener('click', () => { if (!this.isAnimating) { this.next(); this.resetAutoPlay(); } });
        
        // Click on side cards to navigate
        this.cards.forEach((card, i) => {
            card.addEventListener('click', () => {
                if (i !== this.currentIndex) {
                    this.goTo(i);
                    this.resetAutoPlay();
                }
            });
        });

        // Initial positioning of all cards
        this.updatePositions();

        // Auto-play
        this.autoPlayInterval = setInterval(() => this.next(), 6000);
    }
    
    resetAutoPlay() {
        clearInterval(this.autoPlayInterval);
        this.autoPlayInterval = setInterval(() => this.next(), 6000);
    }
    
    prev() {
        if (this.isAnimating) return;
        this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
        this.updatePositions();
    }
    
    next() {
        if (this.isAnimating) return;
        this.currentIndex = (this.currentIndex + 1) % this.cards.length;
        this.updatePositions();
    }
    
    goTo(index) {
        if (this.isAnimating || index === this.currentIndex) return;
        this.currentIndex = index;
        this.updatePositions();
    }
    
    updatePositions() {
        this.isAnimating = true;
        const total = this.cards.length;
        const posClasses = ['active', 'pos-left-1', 'pos-right-1', 'pos-left-2', 'pos-right-2', 'exit-left', 'exit-right', 'enter-left'];

        this.cards.forEach((card, i) => {
            card.classList.remove(...posClasses);

            let offset = i - this.currentIndex;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;

            if (offset === 0) card.classList.add('active');
            else if (offset === -1) card.classList.add('pos-left-1');
            else if (offset === 1) card.classList.add('pos-right-1');
            else if (offset === -2) card.classList.add('pos-left-2');
            else if (offset === 2) card.classList.add('pos-right-2');
        });

        if (this.counterCurrent) {
            this.counterCurrent.textContent = this.currentIndex + 1;
        }

        this.updateDots();

        setTimeout(() => {
            this.isAnimating = false;
        }, 560);
    }

    updateDots() {
        const dotsContainer = document.getElementById('testimonialsDots');
        if (!dotsContainer) return;
        const dots = dotsContainer.querySelectorAll('.testimonial-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentIndex);
        });
    }
}

// ═══════════════════════════════════════════════════════════════════
// COST CALCULATOR
// ═══════════════════════════════════════════════════════════════════

class CostCalculator {
    constructor() {
        this.calcButtons = document.querySelectorAll('.calc-btn');
        this.calcCheckboxes = document.querySelectorAll('.calc-checkbox input');
        this.resultElement = document.getElementById('calcResult');
        
        if (!this.resultElement) return;
        
        this.values = {
            project: 50000,
            design: 0
        };
        
        this.extras = 0;
        
        this.init();
    }
    
    init() {
        this.calcButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.type;
                const value = parseInt(btn.dataset.value);
                
                // Remove active from same type
                document.querySelectorAll(`.calc-btn[data-type="${type}"]`).forEach(b => {
                    b.classList.remove('active');
                });
                
                btn.classList.add('active');
                this.values[type] = value;
                this.calculate();
            });
        });
        
        this.calcCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.calculateExtras();
                this.calculate();
            });
        });
    }
    
    calculateExtras() {
        this.extras = 0;
        this.calcCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                this.extras += parseInt(checkbox.dataset.value);
            }
        });
    }
    
    calculate() {
        const total = this.values.project + this.values.design + this.extras;
        this.animateValue(total);
    }
    
    animateValue(newValue) {
        const current = parseInt(this.resultElement.textContent.replace(/\s/g, ''));
        const diff = newValue - current;
        const steps = 20;
        const increment = diff / steps;
        let step = 0;
        
        const animate = () => {
            step++;
            const value = Math.round(current + increment * step);
            this.resultElement.textContent = value.toLocaleString('ru-RU').replace(/,/g, ' ');
            
            if (step < steps) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// ═══════════════════════════════════════════════════════════════════
// FAQ ACCORDION
// ═══════════════════════════════════════════════════════════════════

class FAQAccordion {
    constructor() {
        this.items = document.querySelectorAll('.faq-item');
        
        if (this.items.length === 0) return;
        
        this.init();
    }
    
    init() {
        this.items.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all
                this.items.forEach(i => i.classList.remove('active'));
                
                // Open clicked if it was closed
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }
}

// ═══════════════════════════════════════════════════════════════════
// LIVE CHAT
// ═══════════════════════════════════════════════════════════════════

class LiveChat {
    constructor() {
        this.widget = document.getElementById('chatWidget');
        this.toggle = document.getElementById('chatToggle');
        this.window = document.getElementById('chatWindow');
        this.messages = document.getElementById('chatMessages');
        this.input = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('chatSend');
        this.quickReplies = document.querySelectorAll('.quick-reply');
        
        if (!this.widget) return;
        
        this.responses = {
            'Хочу узнать стоимость проекта': 'Отлично! Воспользуйтесь нашим калькулятором выше для примерной оценки, или напишите нам что вы хотите создать - и мы подготовим детальный расчёт.',
            'Расскажите о сроках разработки': 'Сроки зависят от сложности проекта:\n• Сайт: 2-4 недели\n• Веб-приложение: 1-3 месяца\n• Мобильное приложение: 2-4 месяца\n\nНазовём точные сроки после обсуждения деталей.',
            'Хочу связаться с менеджером': 'Наш менеджер свяжется с вами в ближайшее время! Оставьте ваш email в форме контактов или напишите нам в Telegram: @gers_agency'
        };
        
        this.init();
    }
    
    init() {
        this.toggle.addEventListener('click', () => {
            this.widget.classList.toggle('open');
        });
        
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        this.quickReplies.forEach(btn => {
            btn.addEventListener('click', () => {
                const reply = btn.dataset.reply;
                this.addUserMessage(reply);
                this.removeQuickReplies();
                
                setTimeout(() => {
                    this.addBotMessage(this.responses[reply] || 'Спасибо за сообщение! Мы скоро ответим.');
                }, 1000);
            });
        });
    }
    
    sendMessage() {
        const text = this.input.value.trim();
        if (!text) return;
        
        this.addUserMessage(text);
        this.input.value = '';
        this.removeQuickReplies();
        
        // Simulate response
        setTimeout(() => {
            this.addBotMessage('Спасибо за сообщение! Наш менеджер скоро ответит вам. А пока можете изучить наши проекты и услуги на сайте.');
        }, 1500);
    }
    
    addUserMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'message user';
        msg.innerHTML = `
            <div class="message-avatar">Я</div>
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">Сейчас</span>
            </div>
        `;
        this.messages.appendChild(msg);
        this.scrollToBottom();
    }
    
    addBotMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'message bot';
        msg.innerHTML = `
            <div class="message-avatar">G</div>
            <div class="message-content">
                <p>${text.replace(/\n/g, '<br>')}</p>
                <span class="message-time">Сейчас</span>
            </div>
        `;
        this.messages.appendChild(msg);
        this.scrollToBottom();
    }
    
    removeQuickReplies() {
        const qr = this.messages.querySelector('.quick-replies');
        if (qr) qr.remove();
    }
    
    scrollToBottom() {
        this.messages.scrollTop = this.messages.scrollHeight;
    }
}

// ═══════════════════════════════════════════════════════════════════
// PROJECT MODAL
// ═══════════════════════════════════════════════════════════════════

class ProjectModal {
    constructor() {
        this.modal = null;
        this.currentIndex = 0;
        this.screenshots = [];
        this.isFullscreen = false;
        this.createModal();
        this.bindEvents();
    }
    
    createModal() {
        const modalHTML = `
            <div class="project-modal" id="projectModal">
                <div class="project-modal-overlay"></div>
                <div class="project-modal-content">
                    <button class="project-modal-close" id="projectModalClose">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                    
                    <!-- Left: Gallery -->
                    <div class="project-modal-gallery">
                        <!-- Device tabs -->
                        <div class="gallery-device-tabs" id="galleryDeviceTabs">
                            <button class="gallery-device-tab active" data-device="desktop">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                                    <line x1="8" y1="21" x2="16" y2="21"/>
                                    <line x1="12" y1="17" x2="12" y2="21"/>
                                </svg>
                                Desktop
                            </button>
                            <button class="gallery-device-tab" data-device="tablet">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
                                    <line x1="12" y1="18" x2="12.01" y2="18"/>
                                </svg>
                                Tablet
                            </button>
                            <button class="gallery-device-tab" data-device="mobile">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                                    <line x1="12" y1="18" x2="12.01" y2="18"/>
                                </svg>
                                Mobile
                            </button>
                        </div>
                        
                        <div class="project-modal-main-image" id="modalMainImage">
                            <div class="project-modal-main-image-placeholder">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                    <circle cx="8.5" cy="8.5" r="1.5"/>
                                    <polyline points="21,15 16,10 5,21"/>
                                </svg>
                                <span>Скриншот проекта</span>
                            </div>
                        </div>
                        
                        <!-- Navigation Arrows -->
                        <button class="gallery-nav gallery-nav-prev" id="galleryPrev">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="15,18 9,12 15,6"/>
                            </svg>
                        </button>
                        <button class="gallery-nav gallery-nav-next" id="galleryNext">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9,18 15,12 9,6"/>
                            </svg>
                        </button>
                        
                        <!-- Counter & Fullscreen -->
                        <div class="gallery-controls">
                            <span class="gallery-counter" id="galleryCounter">1 / 4</span>
                            <button class="gallery-fullscreen" id="galleryFullscreen" title="Полноэкранный просмотр">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="15,3 21,3 21,9"/>
                                    <polyline points="9,21 3,21 3,15"/>
                                    <line x1="21" y1="3" x2="14" y2="10"/>
                                    <line x1="3" y1="21" x2="10" y2="14"/>
                                </svg>
                            </button>
                        </div>
                        
                        <div class="project-modal-thumbnails" id="modalThumbnails">
                            <div class="project-modal-thumb active">Экран 1</div>
                            <div class="project-modal-thumb">Экран 2</div>
                            <div class="project-modal-thumb">Экран 3</div>
                            <div class="project-modal-thumb">Экран 4</div>
                        </div>
                    </div>
                    
                    <!-- Right: Info -->
                    <div class="project-modal-info" id="projectModalInfo"></div>
                </div>
            </div>
            
            <!-- Fullscreen Viewer -->
            <div class="fullscreen-viewer" id="fullscreenViewer">
                <button class="fullscreen-close" id="fullscreenClose">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
                <button class="fullscreen-nav fullscreen-prev" id="fullscreenPrev">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="15,18 9,12 15,6"/>
                    </svg>
                </button>
                <button class="fullscreen-nav fullscreen-next" id="fullscreenNext">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9,18 15,12 9,6"/>
                    </svg>
                </button>
                <div class="fullscreen-image" id="fullscreenImage"></div>
                <span class="fullscreen-counter" id="fullscreenCounter">1 / 4</span>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('projectModal');
        this.modalInfo = document.getElementById('projectModalInfo');
        this.fullscreenViewer = document.getElementById('fullscreenViewer');
    }
    
    bindEvents() {
        document.querySelectorAll('.project-card').forEach(card => {
            if (card.closest('#categories')) return;
            
            card.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal(card);
            });
        });
        
        document.getElementById('projectModalClose')?.addEventListener('click', () => this.closeModal());
        this.modal?.querySelector('.project-modal-overlay')?.addEventListener('click', () => this.closeModal());
        
        // Gallery navigation
        document.getElementById('galleryPrev')?.addEventListener('click', () => this.prevImage());
        document.getElementById('galleryNext')?.addEventListener('click', () => this.nextImage());
        
        // Fullscreen
        document.getElementById('galleryFullscreen')?.addEventListener('click', () => this.openFullscreen());
        document.getElementById('fullscreenClose')?.addEventListener('click', () => this.closeFullscreen());
        document.getElementById('fullscreenPrev')?.addEventListener('click', () => this.prevImage());
        document.getElementById('fullscreenNext')?.addEventListener('click', () => this.nextImage());
        this.fullscreenViewer?.addEventListener('click', (e) => {
            if (e.target === this.fullscreenViewer) this.closeFullscreen();
        });
        
        // Device tabs
        document.querySelectorAll('.gallery-device-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.gallery-device-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                // Visual feedback - change main image aspect ratio hint
                const device = tab.dataset.device;
                const mainImg = document.getElementById('modalMainImage');
                if (mainImg) {
                    mainImg.style.aspectRatio = device === 'mobile' ? '9/16' : device === 'tablet' ? '4/3' : '16/10';
                    mainImg.style.maxHeight = device === 'mobile' ? '520px' : device === 'tablet' ? '480px' : 'none';
                    mainImg.style.margin = device !== 'desktop' ? '0 auto' : '';
                    mainImg.style.maxWidth = device === 'mobile' ? '300px' : device === 'tablet' ? '500px' : '100%';
                }
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.modal?.classList.contains('visible')) return;
            
            if (e.key === 'Escape') {
                if (this.isFullscreen) {
                    this.closeFullscreen();
                } else {
                    this.closeModal();
                }
            }
            if (e.key === 'ArrowLeft') this.prevImage();
            if (e.key === 'ArrowRight') this.nextImage();
        });
    }
    
    getProjectFeatures(title, desc, tags) {
        const featureMap = {
            'Интернет-магазин': ['Каталог товаров с фильтрами и поиском', 'Корзина и онлайн-оплата', 'Личный кабинет покупателя', 'Уведомления о статусе заказа'],
            'автосалон': ['Каталог с фильтрами по марке и цене', 'Кредитный калькулятор', 'Онлайн-запись на тест-драйв', 'Интеграция с CRM'],
            'ресторан': ['Интерактивное меню с фотографиями', 'Онлайн-бронирование столиков', 'Галерея интерьера', 'Отзывы и рейтинг'],
            'B2B Маркетплейс': ['Каталог поставщиков с фильтрами', 'Система заказов и логистика', 'Аналитика продаж для продавцов', 'Безопасные B2B-сделки'],
            'Фермерский маркетплейс': ['Каталог фермерских продуктов', 'Доставка и отслеживание', 'Рейтинги и отзывы фермеров', 'Подписка на регулярные заказы'],
            'Доска объявлений': ['Поиск с фильтрами и категориями', 'Личные сообщения между пользователями', 'Верификация продавцов', 'Модерация и безопасность'],
            'Маркетинговая аналитика': ['Дашборды в реальном времени', 'Визуализация KPI и ROI', 'Автоматические отчёты', 'Интеграция с рекламными площадками'],
            'Лендинг для онлайн-курса': ['Продающая структура страницы', 'Форма записи с валидацией', 'Блок отзывов учеников', 'Таймер ограниченного предложения'],
            'Лендинг для акции': ['Таймер обратного отсчёта', 'Карточки товаров со скидками', 'Корзина и быстрый заказ', 'Адаптив под мобильные'],
            'Лендинг для мероприятия': ['Программа мероприятия по дням', 'Карточки спикеров', 'Онлайн-покупка билетов', 'Интеграция с Google Maps'],
            'пиццерии': ['Интерактивное меню с конструктором пиццы', 'Онлайн-оплата через бота', 'Отслеживание статуса доставки', 'Push-уведомления о готовности'],
            'салона красоты': ['Онлайн-запись к мастеру', 'Автоматические напоминания', 'Программа лояльности и бонусы', 'Отзывы и рейтинг мастеров'],
            'клиники': ['Запись к врачу по специализации', 'Напоминания о приёме', 'Получение результатов анализов', 'Чат с поддержкой'],
            'цветов': ['Каталог букетов с фото', 'Выбор даты и времени доставки', 'Онлайн-оплата', 'Статус доставки в реальном времени'],
            'электроники': ['Каталог с категориями и фильтрами', 'Корзина и оформление заказа', 'Telegram Mini App интерфейс', 'Интеграция с платёжной системой'],
            'одежды': ['Каталог с размерами и цветами', 'Фотогалерея товаров', 'Фильтры по категориям', 'Оформление заказа в боте'],
            'CRM': ['Учёт клиентов и объектов недвижимости', 'Воронка сделок с автоматизацией', 'Автоматические напоминания', 'Аналитика продаж и отчёты'],
            'склад': ['Приём и отгрузка товаров', 'Инвентаризация со штрих-кодами', 'Отчёты в реальном времени', 'Интеграция с 1С'],
            'страховой': ['Просмотр полисов и условий', 'История платежей', 'Онлайн-заявки на выплаты', 'Чат с поддержкой'],
            'сотрудников': ['Заявки на отпуск и больничный', 'Расчётные листы', 'Корпоративные новости', 'Онлайн-обучение сотрудников'],
            'дилера': ['Онлайн-заказы у поставщика', 'Остатки на складе в реальном времени', 'Актуальные цены и акции', 'Документооборот для партнёров'],
            'Мониторинг цен': ['Сбор цен с 50+ сайтов ежедневно', 'Отчёты в Excel и Telegram', 'Отслеживание динамики изменений', 'Алерты при изменении цен'],
            'Avito': ['Мониторинг по ключевым словам', 'Мгновенные уведомления в Telegram', 'Фильтрация по параметрам', 'История объявлений'],
            'контактов': ['Сбор email и телефонов из каталогов', 'Валидация контактных данных', 'Экспорт в Excel и CRM', 'Дедупликация базы'],
            'Автопостинг': ['Публикация в Instagram, VK, Telegram', 'Контент-календарь на месяц', 'Аналитика охватов и вовлечённости', 'Автоматический постинг по расписанию'],
            'Email-рассылки': ['Автоматические цепочки писем', 'Триггерные рассылки', 'A/B тестирование тем', 'Детальная аналитика открытий'],
            'документов': ['Генерация договоров из шаблонов', 'Автоподстановка данных клиента', 'Экспорт в PDF и DOCX', 'Интеграция с CRM'],
            'вебинар': ['Живые трансляции в HD', 'Интерактивный чат', 'Запись и повторы вебинаров', 'Аналитика участников'],
            'видеохостинг': ['Защищённый доступ по ролям', 'Обучающие видео для сотрудников', 'Корпоративные новости', 'Аналитика просмотров'],
            'Стриминговый': ['Каталог контента с рекомендациями', 'Адаптивный видеоплеер', 'Подписочная модель оплаты', 'Персональные рекомендации'],
            'Редизайн': ['Обновлённый UX/UI дизайн', 'Ускорение загрузки на 40%', 'Адаптивная вёрстка', 'Улучшенная конверсия'],
            'геймер': ['Темы и обсуждения с рейтингами', 'Личные сообщения', 'Модерация контента', 'Система достижений'],
            'SaaS': ['База знаний и FAQ', 'Система голосования за идеи', 'Вопросы-ответы от поддержки', 'Интеграция с продуктом'],
            'Профессиональное': ['Нетворкинг и контакты', 'Вакансии и резюме', 'Статьи и публикации', 'Чаты по интересам'],
            'Маркетплейс услуг': ['Доска объявлений с фильтрами и поиском', 'Профили мастеров с рейтингами', 'Онлайн-бронирование и оплата', 'Система отзывов и верификации'],
            'маркетплейс': ['Мультивендорная платформа', 'Личный кабинет продавца', 'Система отзывов и рейтингов', 'Безопасные сделки'],
            'бронирован': ['Онлайн-запись с выбором времени', 'Автоматические напоминания', 'Управление расписанием', 'Интеграция с календарём'],
            'LMS': ['Каталог курсов и уроков', 'Прогресс обучения', 'Тесты и сертификаты', 'Видео-уроки и материалы'],
            'аналитик': ['Дашборды в реальном времени', 'Графики и диаграммы', 'Экспорт отчётов', 'Настраиваемые KPI'],
            'AI': ['Интеграция с нейросетями', 'Обработка естественного языка', 'Автоматизация процессов', 'Обучение на данных клиента'],
            'Интеграция с 1С': ['Двусторонняя синхронизация товаров и остатков', 'Автоматическое обновление цен', 'Журнал синхронизации с алертами', 'Обработка 14 000+ товаров за 3 секунды'],
            'эквайринга': ['Подключение ЮKassa, Stripe, CloudPayments', 'Приём оплаты картами и через СБП', 'Мониторинг транзакций в реальном времени', 'Автоматические возвраты и отчётность'],
            'Интеграция CRM': ['Автоматическая передача заявок в CRM', 'Воронка продаж с этапами и статусами', 'Нулевая потеря лидов с сайта', 'Уведомления менеджерам о новых заявках'],
            'интеграц': ['Подключение к API сторонних сервисов', 'Синхронизация данных', 'Автоматический обмен информацией', 'Мониторинг и логирование'],
            'фитнес': ['Расписание тренировок и запись к тренеру', 'Трекер прогресса и калорий', 'Онлайн-оплата абонементов', 'Push-уведомления о записях'],
            'такси': ['Отслеживание машины на карте', 'Онлайн-оплата поездок', 'Рейтинг и отзывы водителей', 'История поездок и чеки'],
            'Корпоративное': ['Корпоративный новостной фид', 'Заявки на отпуск и HR-сервисы', 'Внутренний чат для сотрудников', 'Push-уведомления и документы'],
            'мобильн': ['Нативный интерфейс iOS и Android', 'Push-уведомления', 'Офлайн-режим', 'Интеграция с камерой и GPS'],
        };
        
        const lowerTitle = title.toLowerCase();
        const lowerDesc = desc.toLowerCase();
        const combined = lowerTitle + ' ' + lowerDesc + ' ' + tags.join(' ').toLowerCase();
        
        for (const [key, features] of Object.entries(featureMap)) {
            if (combined.includes(key.toLowerCase())) {
                return features;
            }
        }
        
        return ['Адаптивный дизайн для всех устройств', 'Современный интерфейс', 'Аналитика и отчёты', 'Техническая поддержка'];
    }
    
    openModal(card) {
        const title = card.dataset.title || card.querySelector('.card-title')?.textContent || 'Проект';
        const desc = card.dataset.desc || card.querySelector('.card-desc')?.textContent || '';
        const tags = card.dataset.tags ? card.dataset.tags.split(',') : Array.from(card.querySelectorAll('.tech-tag')).map(t => t.textContent);
        const year = card.dataset.year || card.querySelector('.info-year')?.textContent || '2024';
        const stat = card.dataset.stat || card.querySelector('.success-stat')?.textContent || '+100%';
        
        // New data attributes
        const categoryData = card.dataset.category || '';
        const categories = categoryData ? categoryData.split(',') : [];
        const client = card.dataset.client || '-';
        const sphere = card.dataset.sphere || '-';
        const duration = card.dataset.duration || '2-4 мес.';
        const projectType = card.dataset.projectType || 'Сайт';
        
        // Get screenshots, bot preview, web preview, or video
        const botPreview = card.dataset.botPreview || '';
        const webPreview = card.dataset.webPreview || '';
        const videoSrc = card.dataset.video || '';
        const screenshotsData = card.dataset.screenshots || '';
        const screenshots = screenshotsData ? screenshotsData.split(',') : [];
        
        if (botPreview) {
            this.showBotPreview(botPreview, title);
        } else if (videoSrc) {
            this.showVideoPreview(videoSrc, title);
        } else if (webPreview) {
            this.showWebPreview(webPreview, title);
        } else {
            this.updateGallery(screenshots);
        }
        
        // Build category HTML
        const categoryHTML = categories.length > 0
            ? `<div class="project-modal-category">${categories.map((c, i) =>
                `<span>${c.trim()}</span>${i < categories.length - 1 ? '<span class="project-modal-category-divider"></span>' : ''}`
              ).join('')}</div>`
            : '';
        
        const content = `
            <div class="project-modal-header">
                ${categoryHTML}
                <div class="project-modal-badge">
                    <span class="project-modal-badge-dot"></span>
                    Завершён • ${year}
                </div>
                <h2 class="project-modal-title">${title}</h2>
                <p class="project-modal-desc">${desc}</p>
            </div>
            
            <div class="project-modal-info-grid">
                <div class="project-modal-info-cell">
                    <span class="project-modal-info-cell-label">Клиент</span>
                    <span class="project-modal-info-cell-value">${client}</span>
                </div>
                <div class="project-modal-info-cell">
                    <span class="project-modal-info-cell-label">Сфера</span>
                    <span class="project-modal-info-cell-value">${sphere}</span>
                </div>
                <div class="project-modal-info-cell">
                    <span class="project-modal-info-cell-label">Срок</span>
                    <span class="project-modal-info-cell-value">${duration}</span>
                </div>
                <div class="project-modal-info-cell">
                    <span class="project-modal-info-cell-label">Тип проекта</span>
                    <span class="project-modal-info-cell-value">${projectType}</span>
                </div>
            </div>
            
            <div class="project-modal-stats">
                <div class="project-modal-stat">
                    <span class="project-modal-stat-value">${stat}</span>
                    <span class="project-modal-stat-label">Результат</span>
                </div>
                <div class="project-modal-stat">
                    <span class="project-modal-stat-value">${duration}</span>
                    <span class="project-modal-stat-label">Сроки</span>
                </div>
                <div class="project-modal-stat">
                    <span class="project-modal-stat-value">24/7</span>
                    <span class="project-modal-stat-label">Поддержка</span>
                </div>
            </div>
            
            <div class="project-modal-body">
                <div class="project-modal-section">
                    <h3 class="project-modal-section-title">Технологии</h3>
                    <div class="project-modal-tech">
                        ${tags.map(tag => `<span class="project-modal-tech-tag">${tag.trim()}</span>`).join('')}
                    </div>
                </div>
                
                <div class="project-modal-section">
                    <h3 class="project-modal-section-title">Что реализовано</h3>
                    <div class="project-modal-features">
                        ${this.getProjectFeatures(title, desc, tags).map(f => `
                        <div class="project-modal-feature">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="20,6 9,17 4,12"/>
                            </svg>
                            <span>${f}</span>
                        </div>`).join('')}
                    </div>
                </div>
            </div>
            
            <div class="project-modal-cta">
                <a href="/contact" class="project-modal-cta-btn">Хочу такой же проект</a>
                <button class="project-modal-cta-btn secondary" onclick="document.getElementById('projectModal').classList.remove('visible'); document.body.style.overflow = '';">Закрыть</button>
            </div>
        `;
        
        this.modalInfo.innerHTML = content;
        
        // Reset device tabs to Desktop
        document.querySelectorAll('.gallery-device-tab').forEach(t => t.classList.remove('active'));
        const desktopTab = document.querySelector('.gallery-device-tab[data-device="desktop"]');
        if (desktopTab) desktopTab.classList.add('active');
        const mainImg = document.getElementById('modalMainImage');
        if (mainImg && !botPreview && !videoSrc && !webPreview) {
            mainImg.style.aspectRatio = '16/10';
            mainImg.style.maxHeight = 'none';
            mainImg.style.margin = '';
            mainImg.style.maxWidth = '100%';
        }
        
        this.modal.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        this.modal.classList.remove('visible');
        document.body.style.overflow = '';
        this.closeFullscreen();
        // Remove mobile layout class
        const modalContent = this.modal?.querySelector('.project-modal-content');
        if (modalContent) modalContent.classList.remove('modal-mobile-layout');
    }
    
    showBotPreview(previewType, botName) {
        this.screenshots = [];
        const mainImage = document.getElementById('modalMainImage');
        const thumbnails = document.getElementById('modalThumbnails');
        const counter = document.getElementById('galleryCounter');
        
        const botChats = {
            pizza: {
                name: 'PizzaBot 🍕',
                messages: [
                    { type: 'bot', text: 'Привет! 🍕 Я помогу заказать пиццу. Выберите действие:' , buttons: ['🍕 Меню', '🛒 Корзина', '📦 Мои заказы'] },
                    { type: 'user', text: '🍕 Меню' },
                    { type: 'bot', text: 'Выберите категорию:', buttons: ['Классические', 'Фирменные', 'Острые', 'Вегетарианские'] },
                    { type: 'user', text: 'Фирменные' },
                    { type: 'bot', text: '⭐ <b>Пепперони Делюкс</b> - 599₽\nМоцарелла, пепперони, томатный соус, орегано\n\n⭐ <b>Четыре сыра</b> - 649₽\nМоцарелла, горгонзола, пармезан, чеддер', buttons: ['В корзину', 'Назад'] },
                    { type: 'user', text: 'В корзину' },
                    { type: 'bot', text: '✅ Пепперони Делюкс добавлена!\n\n🛒 Корзина: 1 товар - 599₽\nОформить заказ?', buttons: ['Оформить ✅', 'Продолжить покупки'] },
                ]
            },
            beauty: {
                name: 'BeautyBot 💅',
                animated: true,
                botEmoji: '💅',
                botColor: '#FF6B9D',
                messages: [
                    { type: 'bot', text: 'Добро пожаловать в салон красоты «Гламур»! 💅✨\n\nЯ помогу записаться к мастеру, выбрать услугу и удобное время.', buttons: ['✂️ Стрижка', '💅 Маникюр', '💆 Массаж', '💇‍♀️ Окрашивание', '📋 Мои записи'] },
                    { type: 'user', text: '💅 Маникюр' },
                    { type: 'bot', text: '💅 Выберите вид маникюра:', buttons: ['Классический - 1 500₽', 'Аппаратный - 2 000₽', 'Комбо - 2 300₽', 'Гель-лак - 2 800₽', 'Наращивание - 4 500₽'] },
                    { type: 'user', text: 'Гель-лак - 2 800₽' },
                    { type: 'bot', text: '💅 <b>Гель-лак</b> - 2 800₽\nДлительность: ~1.5 часа\n\nВыберите мастера:' },
                    { type: 'bot', text: '', masterCards: [
                        { name: 'Анна', rating: '4.9', reviews: '234', speciality: 'Nail-art, стразы', avatar: '👩‍🎨' },
                        { name: 'Мария', rating: '4.8', reviews: '187', speciality: 'Минимализм, french', avatar: '👩' },
                        { name: 'Елена', rating: '4.7', reviews: '156', speciality: 'Объёмный дизайн', avatar: '💅' },
                    ]},
                    { type: 'user', text: 'Анна ⭐ 4.9' },
                    { type: 'bot', text: '📅 Свободные слоты у <b>Анны</b>:' },
                    { type: 'bot', text: '', schedule: [
                        { day: 'Сегодня, 6 марта', slots: ['14:00', '16:30', '18:00'] },
                        { day: 'Завтра, 7 марта', slots: ['10:00', '12:00', '14:30', '16:00'] },
                        { day: 'Сб, 8 марта', slots: ['11:00', '13:00', '15:30'] },
                    ]},
                    { type: 'user', text: '📅 Сегодня, 16:30' },
                    { type: 'bot', text: '💬 Хотите оставить пожелание мастеру?\n\n<i>Например: «Хочу нюдовый цвет» или «Дизайн как на фото»</i>', buttons: ['Без пожеланий', '✏️ Написать'] },
                    { type: 'user', text: 'Хочу нюдовый цвет с блёстками ✨' },
                    { type: 'bot', text: '✅ Пожелание сохранено!\n\nПроверьте вашу запись:' },
                    { type: 'bot', text: '', bookingCard: {
                        service: 'Маникюр + гель-лак',
                        master: 'Анна',
                        date: 'Сегодня, 6 марта',
                        time: '16:30',
                        duration: '1.5 часа',
                        price: '2 800₽',
                        note: 'Нюдовый цвет с блёстками ✨'
                    }},
                    { type: 'bot', text: 'Всё верно?', buttons: ['✅ Подтвердить запись', '✏️ Изменить', '❌ Отменить'] },
                    { type: 'user', text: '✅ Подтвердить запись' },
                    { type: 'bot', text: '🎉 <b>Вы записаны!</b>\n\n💅 Маникюр + гель-лак\n👩‍🎨 Мастер: Анна\n📅 Сегодня, 16:30\n💰 2 800₽\n\n⏰ Напомню за 2 часа!\n📍 Адрес: ул. Пушкина, 15\n\nДо встречи! 💖' },
                    { type: 'bot', text: '💡 Кстати! У нас действует программа лояльности:\n\n🎁 Каждый 5-й визит - <b>скидка 20%</b>\n⭐ Ваших визитов: 3 из 5\n\nОсталось 2 визита до скидки!', buttons: ['📋 Мои записи', '🏠 В начало'] },
                ]
            },
            clinic: {
                name: 'MedBot 🏥',
                animated: true,
                botEmoji: '🏥',
                botColor: '#4FC3F7',
                messages: [
                    { type: 'bot', text: 'Здравствуйте! 🏥\n\nЯ ассистент клиники «Здоровье Плюс».\nЧем могу помочь?', buttons: ['📋 Запись к врачу', '📊 Результаты анализов', '💊 Мои рецепты', '📞 Связь с врачом', '📍 Адреса клиник'] },
                    { type: 'user', text: '📋 Запись к врачу' },
                    { type: 'bot', text: '👨‍⚕️ Выберите специализацию:', buttons: ['🫀 Кардиолог', '🧠 Невролог', '🦷 Стоматолог', '👁 Офтальмолог', '🩺 Терапевт', '🦴 Хирург'] },
                    { type: 'user', text: '🫀 Кардиолог' },
                    { type: 'bot', text: '🫀 <b>Кардиология</b>\n\nДоступные врачи:' },
                    { type: 'bot', text: '', doctorCards: [
                        { name: 'Иванов Алексей Сергеевич', exp: '15 лет', rating: '4.9', reviews: '312', price: '2 500₽', photo: '👨‍⚕️', specialty: 'Кардиолог, д.м.н.' },
                        { name: 'Петрова Мария Владимировна', exp: '10 лет', rating: '4.8', reviews: '198', price: '2 200₽', photo: '👩‍⚕️', specialty: 'Кардиолог, к.м.н.' },
                    ]},
                    { type: 'user', text: 'Иванов А.С. ⭐ 4.9' },
                    { type: 'bot', text: '📅 Расписание <b>Иванова А.С.</b>:' },
                    { type: 'bot', text: '', schedule: [
                        { day: 'Пн, 10 марта', slots: ['09:00', '09:30', '10:30', '14:00'] },
                        { day: 'Ср, 12 марта', slots: ['10:00', '11:00', '15:00', '16:30'] },
                        { day: 'Пт, 14 марта', slots: ['09:00', '11:30', '14:00'] },
                    ]},
                    { type: 'user', text: '📅 Пн, 10 марта - 09:30' },
                    { type: 'bot', text: '📝 Укажите причину визита:', buttons: ['Первичный приём', 'Повторный приём', 'Консультация', 'Обследование ЭКГ'] },
                    { type: 'user', text: 'Обследование ЭКГ' },
                    { type: 'bot', text: '⚠️ Подготовка к ЭКГ:\n\n• Не пить кофе за 2 часа\n• Не курить за 1 час\n• Одежда - удобная\n• Взять с собой полотенце\n\nПроверьте запись:' },
                    { type: 'bot', text: '', bookingCard: {
                        service: 'ЭКГ + консультация кардиолога',
                        master: 'Иванов А.С., д.м.н.',
                        date: 'Пн, 10 марта',
                        time: '09:30',
                        duration: '45 мин',
                        price: '3 200₽',
                        note: 'Кабинет 204, 2 этаж'
                    }},
                    { type: 'bot', text: 'Подтверждаете запись?', buttons: ['✅ Подтвердить', '✏️ Изменить', '❌ Отменить'] },
                    { type: 'user', text: '✅ Подтвердить' },
                    { type: 'bot', text: '✅ <b>Запись подтверждена!</b>\n\n🏥 ЭКГ + консультация\n👨‍⚕️ Иванов А.С.\n📅 Пн, 10 марта, 09:30\n📍 Кабинет 204, 2 этаж\n💰 3 200₽\n\n⏰ Напомню за день и за 2 часа!\n\n📄 Направление отправлено на email' },
                    { type: 'bot', text: '📊 Кстати, ваши результаты анализов от 1 марта готовы!\n\n✅ Общий анализ крови - <b>норма</b>\n⚠️ Холестерин - <b>5.8</b> (рек. до 5.0)\n✅ Глюкоза - <b>4.2</b> - норма\n\nПодробности покажет врач на приёме.', buttons: ['📥 Скачать PDF', '📋 Мои записи', '🏠 В начало'] },
                ]
            },
            'shop-flowers': {
                name: 'FlowerShop 💐',
                animated: true,
                botEmoji: '💐',
                botColor: '#66BB6A',
                messages: [
                    { type: 'bot', text: '💐 Добро пожаловать в <b>FlowerShop</b>!\n\nЗакажите букет с доставкой прямо в Telegram 🚚', buttons: ['🌹 Розы', '🌷 Тюльпаны', '💐 Букеты', '🎁 Подарочные', '🪻 Авторские', '📋 Мои заказы'] },
                    { type: 'user', text: '💐 Букеты' },
                    { type: 'bot', text: '💐 Наши популярные букеты:', products: [
                        { img: 'https://avatars.mds.yandex.net/get-mpic/5151028/img_id776781265881911327.jpeg/orig', name: 'Нежность', price: '2 990₽' },
                        { img: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=300&h=300&fit=crop', name: 'Весенний', price: '3 490₽' },
                        { img: 'https://avatars.mds.yandex.net/get-mpic/4489193/img_id3179859453027180716.jpeg/orig', name: 'Яркий микс', price: '4 200₽' },
                        { img: 'https://storage.florist.ru/f/get/supplier/47/products/65/36/_8c894ed1bec39ab34e311e1fd8d6/66d9b3fd75952.jpg', name: 'Солнечный', price: '2 790₽' },
                    ]},
                    { type: 'user', text: 'Нежность 💐' },
                    { type: 'bot', text: '', product: { img: 'https://avatars.mds.yandex.net/get-mpic/5151028/img_id776781265881911327.jpeg/orig', name: 'Букет «Нежность»', price: '2 990₽' } },
                    { type: 'bot', text: '💐 <b>Букет «Нежность»</b>\n🌹 15 роз, эвкалипт, гипсофила\n📏 Высота: 50 см\n💰 2 990₽\n\n⭐ 4.9 (87 отзывов)', buttons: ['🛒 В корзину', '💝 Добавить открытку', '🎀 Упаковка Premium'] },
                    { type: 'user', text: '💝 Добавить открытку' },
                    { type: 'bot', text: '💝 Выберите открытку:', buttons: ['С Днём Рождения! 🎂', 'Люблю тебя ❤️', 'Поздравляю! 🎉', '✏️ Свой текст'] },
                    { type: 'user', text: '✏️ Свой текст' },
                    { type: 'bot', text: '✏️ Напишите текст для открытки:\n\n<i>Максимум 150 символов</i>' },
                    { type: 'user', text: 'С 8 марта, дорогая! Ты - лучшая! 💖' },
                    { type: 'bot', text: '✅ Открытка добавлена!\n\n🛒 <b>Ваш заказ:</b>\n\n💐 Букет «Нежность» - 2 990₽\n💝 Открытка - бесплатно\n━━━━━━━━━━━━━━\n💰 Итого: <b>2 990₽</b>', buttons: ['📅 Выбрать дату доставки', '🎀 Добавить подарок'] },
                    { type: 'user', text: '📅 Выбрать дату доставки' },
                    { type: 'bot', text: '', schedule: [
                        { day: 'Сегодня, 6 марта', slots: ['14:00-16:00', '16:00-18:00', '18:00-20:00'] },
                        { day: 'Завтра, 7 марта', slots: ['10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00'] },
                        { day: 'Сб, 8 марта 🔥', slots: ['08:00-10:00', '10:00-12:00', '12:00-14:00'] },
                    ]},
                    { type: 'user', text: '📅 Сб, 8 марта - 08:00-10:00' },
                    { type: 'bot', text: '📍 Укажите адрес доставки:\n\n<i>Или отправьте геолокацию 📍</i>' },
                    { type: 'user', text: 'ул. Ленина, 42, кв. 15' },
                    { type: 'bot', text: '✅ Адрес принят!\n\n🚚 Доставка: <b>бесплатно</b> (от 2 000₽)\n\nПроверьте заказ:' },
                    { type: 'bot', text: '', bookingCard: {
                        service: 'Букет «Нежность» + открытка',
                        master: 'FlowerShop',
                        date: 'Сб, 8 марта',
                        time: '08:00-10:00',
                        duration: 'Доставка бесплатно',
                        price: '2 990₽',
                        note: '📍 ул. Ленина, 42, кв. 15'
                    }},
                    { type: 'bot', text: 'Оформить заказ?', buttons: ['💳 Оплатить онлайн', '💵 При получении'] },
                    { type: 'user', text: '💳 Оплатить онлайн' },
                    { type: 'bot', text: '🎉 <b>Заказ оформлен!</b>\n\n💐 Букет «Нежность»\n💝 Открытка: «С 8 марта, дорогая!»\n📅 Сб, 8 марта, 08:00-10:00\n📍 ул. Ленина, 42, кв. 15\n💰 2 990₽ - оплачено ✅\n\n📦 Номер заказа: #FL-2847\n📲 Статус доставки будет в этом чате!\n\nСпасибо за заказ! 💖' },
                ]
            },
            'shop-electronics': {
                name: 'TechStore ⚡',
                messages: [
                    { type: 'bot', text: '⚡ Привет! Это TechStore - гаджеты в Telegram. Что ищете?', buttons: ['📱 Смартфоны', '🎧 Наушники', '⌚ Часы', '🔌 Аксессуары'] },
                    { type: 'user', text: '🎧 Наушники' },
                    { type: 'bot', text: 'Топ наушников:', products: [
                        { img: 'https://avatars.mds.yandex.net/get-mpic/5235429/2a0000018a2c4971410f87a1a715dd368bf0/orig', name: 'AirPods Pro', price: '18 990₽' },
                        { img: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300&h=300&fit=crop', name: 'Sony WH-1000', price: '24 990₽' },
                        { img: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop', name: 'JBL Tune 770', price: '5 990₽' },
                        { img: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=300&fit=crop', name: 'Marshall Major', price: '8 490₽' },
                    ]},
                    { type: 'user', text: 'Sony WH-1000' },
                    { type: 'bot', text: '', product: { img: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=200&fit=crop', name: 'Sony WH-1000XM5', price: '24 990₽' } },
                    { type: 'bot', text: '🎧 <b>Sony WH-1000XM5</b>\nШумоподавление, 30ч батарея, LDAC\n⭐ 4.9 (2 340 отзывов)\n💰 24 990₽', buttons: ['🛒 В корзину', '❤️ В избранное'] },
                    { type: 'user', text: '🛒 В корзину' },
                    { type: 'bot', text: '✅ Добавлено в корзину!\n\n🛒 Корзина: 1 товар - 24 990₽\n🚚 Доставка: бесплатно от 15 000₽', buttons: ['💳 Оформить заказ', '🛍 Продолжить покупки'] },
                ]
            },
            'shop-clothes': {
                name: 'FashionBot 👗',
                messages: [
                    { type: 'bot', text: '👗 Привет! Добро пожаловать в FashionBot. Выберите раздел:', buttons: ['👕 Мужское', '👗 Женское', '🔥 Новинки', '🏷 Скидки'] },
                    { type: 'user', text: '🔥 Новинки' },
                    { type: 'bot', text: 'Новинки этой недели:', products: [
                        { img: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=300&h=300&fit=crop', name: 'Пальто Oversize', price: '12 990₽' },
                        { img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop', name: 'Кроссовки Air', price: '8 990₽' },
                        { img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=300&fit=crop', name: 'Сумка Leather', price: '6 490₽' },
                        { img: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=300&h=300&fit=crop', name: 'Шарф Cashmere', price: '3 990₽' },
                    ]},
                    { type: 'user', text: 'Кроссовки Air 👟' },
                    { type: 'bot', text: '', product: { img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=200&fit=crop', name: 'Кроссовки Air Max', price: '8 990₽' } },
                    { type: 'bot', text: '👟 <b>Кроссовки Air Max</b>\nРазмеры: 39 40 41 42 43 44\nЦвет: белый/синий\n💰 8 990₽', buttons: ['39', '40', '41', '42', '43', '44'] },
                    { type: 'user', text: '42' },
                    { type: 'bot', text: '✅ Отличный выбор!\n\n👟 Кроссовки Air Max, р. 42\n💰 8 990₽\n🚚 Доставка 2-3 дня\n\nПримерка при получении 👌', buttons: ['💳 Оплатить', '📏 Таблица размеров'] },
                ]
            },
            'parser-prices': {
                name: 'GERS Price Monitor',
                messages: [
                    { type: 'bot', text: '', gersCard: {
                        title: 'GERS',
                        subtitle: 'Global E-commerce Retail Scanner',
                        features: [
                            { color: '#5B7CF7', label: 'Парсинг 55+ магазинов', desc: 'Автоматический сбор цен конкурентов' },
                            { color: '#4ADE80', label: 'Excel-отчёты', desc: 'Профессиональные отчёты с графиками' },
                            { color: '#F59E0B', label: 'Telegram-алерты', desc: 'Мгновенные уведомления об изменении цен' },
                            { color: '#60A5FA', label: 'Аналитика', desc: 'Тренды, сравнения, история цен' },
                            { color: '#C084FC', label: 'Планировщик', desc: 'Ежедневный автоматический запуск' }
                        ],
                        version: 'v1.0'
                    }},
                    { type: 'user', text: '/start' },
                    { type: 'bot', text: '👋 Добро пожаловать в <b>GERS Price Monitor</b>!\n\nЯ отслеживаю цены конкурентов на <b>55+ площадках</b> и отправляю отчёты.', buttons: ['📊 Запустить мониторинг', '📋 Последний отчёт', '⚙️ Настройки', '📈 Аналитика'] },
                    { type: 'user', text: '📊 Запустить мониторинг' },
                    { type: 'bot', text: '🔍 <b>Мониторинг запущен</b>\n\n⏱ Сканирую 55 источников...\n━━━━━━━━━━ 100%\n\n✅ Wildberries - 1 240 товаров\n✅ Ozon - 980 товаров\n✅ Яндекс.Маркет - 1 100 товаров\n✅ DNS - 450 товаров\n✅ М.Видео - 380 товаров\n\n📦 Всего: <b>4 150 позиций</b> обработано' },
                    { type: 'bot', text: '', gersDashboard: {
                        title: 'GERS', subtitle: 'Global E-commerce Retail Scanner', date: '28.02.2026 23:33', version: 'v1.0',
                        stats: [
                            { value: '55', label: 'МАГАЗИНОВ', color: '#5B7CF7' },
                            { value: '2,878', label: 'ТОВАРОВ', color: '#4ADE80' },
                            { value: '2,878', label: 'ЗАПИСЕЙ ЦЕН', color: '#F59E0B' },
                            { value: '7', label: 'КАТЕГОРИЙ', color: '#00F0FF' }
                        ],
                        categories: [
                            { name: 'Смартфоны', count: 222, color: '#F59E0B' },
                            { name: 'Ноутбуки', count: 115, color: '#4ADE80' },
                            { name: 'Наушники', count: 97, color: '#F59E0B' },
                            { name: 'Умные часы', count: 51, color: '#60A5FA' },
                            { name: 'Телевизоры', count: 48, color: '#5B7CF7' },
                            { name: 'Планшеты', count: 22, color: '#EC4899' },
                            { name: 'Игровые консоли', count: 16, color: '#EF4444' }
                        ],
                        topPrices: [
                            { name: 'Nothing Ear (2)', shop: 'EarTech', price: '9,060 Rub' },
                            { name: 'Nothing Ear (2)', shop: 'SoundWave', price: '9,560 Rub' },
                            { name: 'Nothing Ear (2)', shop: 'SoundBox', price: '9,620 Rub' },
                            { name: 'Nothing Ear (2)', shop: 'ProAudio', price: '9,780 Rub' },
                            { name: 'Nothing Ear (2)', shop: 'BassDrop', price: '9,920 Rub' }
                        ],
                        topDiscounts: [
                            { discount: '-31%', name: 'Xiaomi 13T Pro 256GB', oldPrice: '60,230', newPrice: '41,260 Rub' },
                            { discount: '-29%', name: 'Sony WH-1000XM5', oldPrice: '36,080', newPrice: '25,480 Rub' },
                            { discount: '-29%', name: 'Huawei MatePad Pro 13.2"', oldPrice: '69,000', newPrice: '48,800 Rub' },
                            { discount: '-29%', name: 'Jabra Elite 10', oldPrice: '23,730', newPrice: '16,930 Rub' },
                            { discount: '-29%', name: 'Sennheiser Momentum 4', oldPrice: '31,280', newPrice: '22,330 Rub' }
                        ]
                    }},
                    { type: 'bot', text: '🔔 <b>Алерт!</b> Найдены изменения цен:\n\n🔴 iPhone 15 Pro - <s>89 990₽</s> → <b>84 990₽</b> (-5.6%)\n🟢 Samsung S24 - <s>74 990₽</s> → <b>79 990₽</b> (+6.7%)\n🔴 Xiaomi 14 - <s>44 990₽</s> → <b>39 990₽</b> (-11.1%)\n🔴 Pixel 8 - <s>54 990₽</s> → <b>49 990₽</b> (-9.1%)', buttons: ['📥 Скачать Excel', '📊 Графики', '🔄 Обновить'] },
                    { type: 'user', text: '⚙️ Настройки' },
                    { type: 'bot', text: '', gersSettings: {
                        title: 'Настройки GERS', version: 'v1.0',
                        rows: [
                            { label: 'Расписание', desc: 'Ежедневный запуск парсинга', value: '08:00', color: '#C084FC' },
                            { label: 'Порог алертов', desc: 'Минимальное изменение цены для алерта', value: '5.0%', color: '#4ADE80' },
                            { label: 'Категории', desc: 'Отслеживаемые категории товаров', value: 'smartphones, laptops, tablets, headphones', color: '#F59E0B' },
                            { label: 'Магазинов', desc: 'Активных магазинов-конкурентов', value: '55', color: '#60A5FA' },
                            { label: 'Параллельных запросов', desc: 'Одновременных подключений при парсинге', value: '10', color: '#5B7CF7' },
                            { label: 'Telegram-отчёты', desc: 'Отправка отчётов в Telegram', value: 'Включены', color: '#4ADE80' }
                        ]
                    }},
                    { type: 'user', text: '📥 Скачать Excel' },
                    { type: 'bot', text: '📎 <b>Отчёт сформирован</b>\n\n📄 report_2026-02-28.xlsx\n📊 4 150 позиций, 55 источников\n📈 23 изменения цен за сутки\n\n✅ Файл отправлен!' },
                    { type: 'user', text: '📈 Аналитика' },
                    { type: 'bot', text: '📈 <b>Аналитика за неделю:</b>\n\n📉 Средняя цена iPhone 15: <b>-3.2%</b>\n📈 Средняя цена Samsung S24: <b>+1.8%</b>\n📉 Наушники (категория): <b>-7.5%</b>\n📈 Планшеты (категория): <b>+2.1%</b>\n\n🔥 Тренд: массовое снижение на электронику', buttons: ['📊 За месяц', '📊 За квартал', '📥 Скачать отчёт'] },
                ]
            },
            'parser-avito': {
                name: 'GERS Avito Scanner',
                messages: [
                    { type: 'bot', text: '', gersCard: {
                        title: 'GERS',
                        subtitle: 'Avito Ads Intelligence',
                        features: [
                            { color: '#5B7CF7', label: 'Мониторинг Avito', desc: 'Отслеживание новых объявлений 24/7' },
                            { color: '#4ADE80', label: 'Фильтры', desc: 'Ключевые слова, цена, регион, категория' },
                            { color: '#F59E0B', label: 'Мгновенные алерты', desc: 'Уведомления в Telegram за секунды' },
                            { color: '#60A5FA', label: 'Автопоиск', desc: 'Сканирование каждые 30 секунд' },
                            { color: '#C084FC', label: 'История', desc: 'Архив всех найденных объявлений' }
                        ],
                        version: 'v2.3'
                    }},
                    { type: 'user', text: '/start' },
                    { type: 'bot', text: '👋 Привет! Я <b>GERS Avito Scanner</b>.\n\nОтслеживаю новые объявления на Avito и мгновенно отправляю в Telegram.', buttons: ['🔍 Новый поиск', '📋 Мои фильтры', '📊 Статистика', '⚙️ Настройки'] },
                    { type: 'user', text: '🔍 Новый поиск' },
                    { type: 'bot', text: '🔎 Введите ключевые слова для поиска:\n\n<i>Например: iPhone 15, квартира Москва, велосипед</i>' },
                    { type: 'user', text: 'MacBook Pro M3' },
                    { type: 'bot', text: '⚙️ Настройка фильтра:\n\n🔑 Запрос: <b>MacBook Pro M3</b>\n💰 Цена: любая\n📍 Регион: вся Россия', buttons: ['💰 Указать цену', '📍 Выбрать регион', '✅ Запустить'] },
                    { type: 'user', text: '💰 Указать цену' },
                    { type: 'bot', text: '💰 Укажите диапазон цен:', buttons: ['До 100 000₽', '100-200 000₽', '200-300 000₽', '300 000₽+', 'Любая цена'] },
                    { type: 'user', text: '100-200 000₽' },
                    { type: 'bot', text: '✅ <b>Фильтр обновлён:</b>\n\n🔑 Запрос: <b>MacBook Pro M3</b>\n💰 Цена: 100 000 - 200 000₽\n📍 Регион: вся Россия', buttons: ['✅ Запустить', '📍 Выбрать регион'] },
                    { type: 'user', text: '✅ Запустить' },
                    { type: 'bot', text: '✅ <b>Фильтр активирован!</b>\n\n🔍 MacBook Pro M3\n💰 100 000 - 200 000₽\n⏱ Проверка каждые 30 сек\n\nБуду присылать новые объявления 👇' },
                    { type: 'bot', text: '🆕 <b>Новое объявление!</b>\n\n💻 MacBook Pro 14 M3 Pro 18/512\n💰 <b>159 000 ₽</b>\n📍 Москва, м. Курская\n🕐 Только что\n⭐ Продавец: 48 отзывов\n\n<a>Открыть на Avito →</a>', buttons: ['⭐ В избранное', '🔕 Пропустить'] },
                    { type: 'bot', text: '🆕 <b>Новое объявление!</b>\n\n💻 MacBook Pro 14 M3 Pro 36/1TB\n💰 <b>185 000 ₽</b>\n📍 Москва, м. Тёплый Стан\n🕐 1 мин назад\n⭐ Продавец: 23 отзыва\n\n<a>Открыть на Avito →</a>', buttons: ['⭐ В избранное', '🔕 Пропустить'] },
                    { type: 'bot', text: '🆕 <b>Новое объявление!</b>\n\n💻 MacBook Pro 16 M3 Pro 18/512\n💰 <b>175 000 ₽</b>\n📍 Екатеринбург\n🕐 3 мин назад\n⭐ Продавец: 87 отзывов\n\n<a>Открыть на Avito →</a>', buttons: ['⭐ В избранное', '🔕 Пропустить'] },
                    { type: 'user', text: '📊 Статистика' },
                    { type: 'bot', text: '', gersDashboard: {
                        title: 'GERS', subtitle: 'Avito Ads Intelligence', date: '28.02.2026', version: 'v2.3',
                        stats: [
                            { value: '3', label: 'ФИЛЬТРОВ', color: '#5B7CF7' },
                            { value: '1,247', label: 'НАЙДЕНО', color: '#4ADE80' },
                            { value: '48', label: 'В ИЗБРАННОМ', color: '#F59E0B' },
                            { value: '24/7', label: 'МОНИТОРИНГ', color: '#00F0FF' }
                        ],
                        categories: [
                            { name: 'MacBook Pro', count: 342, color: '#5B7CF7' },
                            { name: 'iPhone', count: 518, color: '#4ADE80' },
                            { name: 'iPad', count: 187, color: '#F59E0B' },
                            { name: 'Apple Watch', count: 124, color: '#60A5FA' },
                            { name: 'AirPods', count: 76, color: '#C084FC' }
                        ],
                        topPrices: [
                            { name: 'MacBook Pro 14 M3', shop: 'Москва', price: '139,000 ₽' },
                            { name: 'MacBook Pro 14 M3', shop: 'СПб', price: '145,000 ₽' },
                            { name: 'MacBook Pro 14 M3 Pro', shop: 'Москва', price: '159,000 ₽' },
                            { name: 'MacBook Pro 16 M3 Pro', shop: 'Екб', price: '175,000 ₽' },
                            { name: 'MacBook Pro 14 M3 Pro', shop: 'Москва', price: '185,000 ₽' }
                        ]
                    }},
                    { type: 'user', text: '⚙️ Настройки' },
                    { type: 'bot', text: '', gersSettings: {
                        title: 'Настройки Avito Scanner', version: 'v2.3',
                        rows: [
                            { label: 'Интервал проверки', desc: 'Частота сканирования новых объявлений', value: '30 сек', color: '#C084FC' },
                            { label: 'Уведомления', desc: 'Мгновенные алерты в Telegram', value: 'Включены', color: '#4ADE80' },
                            { label: 'Активных фильтров', desc: 'Запущенных поисковых запросов', value: '3', color: '#F59E0B' },
                            { label: 'Регион по умолчанию', desc: 'Основной регион для поиска', value: 'Вся Россия', color: '#60A5FA' },
                            { label: 'Антибан', desc: 'Прокси и ротация user-agent', value: 'Активен', color: '#4ADE80' },
                            { label: 'Хранение истории', desc: 'Срок хранения найденных объявлений', value: '30 дней', color: '#5B7CF7' }
                        ]
                    }},
                ]
            },
            'parser-contacts': {
                name: 'GERS Lead Hunter',
                messages: [
                    { type: 'bot', text: '', gersCard: {
                        title: 'GERS',
                        subtitle: 'B2B Lead Generation Engine',
                        features: [
                            { color: '#5B7CF7', label: 'Парсинг каталогов', desc: 'Сбор данных с бизнес-справочников' },
                            { color: '#4ADE80', label: 'Email + Телефоны', desc: 'Контакты ЛПР и отделов продаж' },
                            { color: '#F59E0B', label: 'Фильтрация', desc: 'По отрасли, региону, размеру компании' },
                            { color: '#60A5FA', label: 'Экспорт', desc: 'CSV, Excel, интеграция с CRM' },
                            { color: '#C084FC', label: 'Дедупликация', desc: 'Автоматическая очистка дублей' }
                        ],
                        version: 'v3.1'
                    }},
                    { type: 'user', text: '/start' },
                    { type: 'bot', text: '👋 Привет! Я <b>GERS Lead Hunter</b>.\n\nСобираю контакты компаний из открытых источников для вашего отдела продаж.', buttons: ['🔍 Начать сбор', '📋 Мои базы', '📊 Статистика', '⚙️ Настройки'] },
                    { type: 'user', text: '🔍 Начать сбор' },
                    { type: 'bot', text: '🏢 Выберите отрасль:', buttons: ['🏗 Строительство', '🏥 Медицина', '🍽 Рестораны', '🏪 Ритейл', '💼 IT-компании', '📋 Все отрасли'] },
                    { type: 'user', text: '💼 IT-компании' },
                    { type: 'bot', text: '📍 Регион:', buttons: ['Москва', 'Санкт-Петербург', 'Вся Россия', 'Указать город'] },
                    { type: 'user', text: 'Москва' },
                    { type: 'bot', text: '🎯 Размер компании:', buttons: ['👤 1-10 чел', '👥 11-50 чел', '🏢 51-200 чел', '🏛 200+ чел', '📋 Все размеры'] },
                    { type: 'user', text: '🏢 51-200 чел' },
                    { type: 'bot', text: '⏳ <b>Сбор запущен...</b>\n\n🏢 Отрасль: IT-компании\n📍 Регион: Москва\n👥 Размер: 51-200 чел\n\n━━━━━━━━━━ 100%\n\n✅ 2Gis - 340 компаний\n✅ Яндекс.Карты - 285 компаний\n✅ HH.ru - 520 компаний\n✅ Rusprofile - 190 компаний\n✅ LinkedIn - 410 компаний\n✅ Контур.Фокус - 230 компаний\n\n📦 Итого: <b>1 975 контактов</b>' },
                    { type: 'bot', text: '', gersDashboard: {
                        title: 'GERS', subtitle: 'B2B Lead Generation Engine', date: '28.02.2026', version: 'v3.1',
                        stats: [
                            { value: '6', label: 'ИСТОЧНИКОВ', color: '#5B7CF7' },
                            { value: '1,975', label: 'КОНТАКТОВ', color: '#4ADE80' },
                            { value: '1,120', label: 'EMAIL', color: '#F59E0B' },
                            { value: '980', label: 'ТЕЛЕФОНОВ', color: '#00F0FF' }
                        ],
                        categories: [
                            { name: 'HH.ru', count: 520, color: '#EF4444' },
                            { name: 'LinkedIn', count: 410, color: '#5B7CF7' },
                            { name: '2Gis', count: 340, color: '#4ADE80' },
                            { name: 'Яндекс.Карты', count: 285, color: '#F59E0B' },
                            { name: 'Контур.Фокус', count: 230, color: '#C084FC' },
                            { name: 'Rusprofile', count: 190, color: '#60A5FA' }
                        ],
                        topPrices: [
                            { name: 'Яндекс', shop: 'IT / 5000+ чел', price: '15 контактов' },
                            { name: 'Сбер Технологии', shop: 'IT / 3000+ чел', price: '12 контактов' },
                            { name: 'VK', shop: 'IT / 2000+ чел', price: '10 контактов' },
                            { name: 'Тинькофф', shop: 'Fintech / 1500+ чел', price: '9 контактов' },
                            { name: 'Kaspersky', shop: 'Cybersec / 1000+ чел', price: '8 контактов' }
                        ]
                    }},
                    { type: 'bot', text: '📊 <b>Качество данных:</b>\n\n📧 Email валидных: <b>94.2%</b>\n📞 Телефоны актуальных: <b>87.5%</b>\n👤 ЛПР найдено: <b>340 из 1 120</b>\n🔄 Дубли удалены: <b>215</b>\n✅ Уникальных: <b>1 120 компаний</b>', buttons: ['📥 Скачать CSV', '📥 Скачать Excel', '🔗 Отправить в CRM'] },
                    { type: 'user', text: '⚙️ Настройки' },
                    { type: 'bot', text: '', gersSettings: {
                        title: 'Настройки Lead Hunter', version: 'v3.1',
                        rows: [
                            { label: 'Источники', desc: 'Активные источники данных', value: '6 из 8', color: '#5B7CF7' },
                            { label: 'Дедупликация', desc: 'Автоматическое удаление дублей', value: 'Включена', color: '#4ADE80' },
                            { label: 'Email валидация', desc: 'Проверка существования email', value: 'Включена', color: '#4ADE80' },
                            { label: 'Формат экспорта', desc: 'Формат выходного файла', value: 'Excel + CSV', color: '#F59E0B' },
                            { label: 'CRM интеграция', desc: 'Автоотправка в Bitrix24', value: 'Активна', color: '#C084FC' },
                            { label: 'Прокси', desc: 'Ротация IP для обхода ограничений', value: '25 прокси', color: '#60A5FA' }
                        ]
                    }},
                    { type: 'user', text: '📥 Скачать Excel' },
                    { type: 'bot', text: '📎 <b>Файл готов!</b>\n\n📄 leads_it_moscow_2026.xlsx\n🏢 1 120 компаний\n📧 1 120 email · 📞 980 телефонов\n👤 340 ЛПР\n\n✅ Отправлено!' },
                ]
            },
            'auto-posting': {
                name: 'GERS AutoPost',
                messages: [
                    { type: 'bot', text: '', gersCard: {
                        title: 'GERS',
                        subtitle: 'Social Media Auto Publisher',
                        features: [
                            { color: '#E1306C', label: 'Instagram', desc: 'Посты, сторис, reels по расписанию' },
                            { color: '#5B7CF7', label: 'VKонтакте', desc: 'Стена, истории, автопубликация' },
                            { color: '#29B6F6', label: 'Telegram', desc: 'Каналы и чаты, отложенные посты' },
                            { color: '#4ADE80', label: 'Планировщик', desc: 'Контент-календарь на месяц вперёд' },
                            { color: '#F59E0B', label: 'Аналитика', desc: 'Охват, лайки, комментарии, рост подписчиков' }
                        ],
                        version: 'v2.0'
                    }},
                    { type: 'user', text: '/start' },
                    { type: 'bot', text: '👋 Привет! Я <b>GERS AutoPost</b> - управляю вашими соцсетями.\n\nПодключено <b>3 площадки</b>, в очереди <b>12 постов</b>.', buttons: ['📝 Создать пост', '📅 Расписание', '📊 Аналитика', '⚙️ Настройки'] },
                    { type: 'user', text: '📊 Аналитика' },
                    { type: 'bot', text: '', gersDashboard: {
                        title: 'GERS', subtitle: 'Social Media Auto Publisher', date: '28.02.2026', version: 'v2.0',
                        stats: [
                            { value: '3', label: 'ПЛОЩАДКИ', color: '#E1306C' },
                            { value: '248', label: 'ПОСТОВ/МЕС', color: '#4ADE80' },
                            { value: '45.2K', label: 'ОХВАТ', color: '#F59E0B' },
                            { value: '+12%', label: 'РОСТ', color: '#00F0FF' }
                        ],
                        categories: [
                            { name: 'Instagram', count: 98, color: '#E1306C' },
                            { name: 'VKонтакте', count: 85, color: '#5B7CF7' },
                            { name: 'Telegram', count: 65, color: '#29B6F6' }
                        ],
                        topPrices: [
                            { name: 'Пост «Новая коллекция»', shop: 'Instagram · 28 фев', price: '3,240 👁' },
                            { name: 'Reels «Распаковка»', shop: 'Instagram · 27 фев', price: '2,890 👁' },
                            { name: 'Статья «Тренды 2026»', shop: 'VK · 26 фев', price: '1,950 👁' },
                            { name: 'Сторис «Скидки -30%»', shop: 'Instagram · 25 фев', price: '1,780 👁' },
                            { name: 'Пост «Отзыв клиента»', shop: 'Telegram · 24 фев', price: '1,420 👁' }
                        ]
                    }},
                    { type: 'user', text: '📝 Создать пост' },
                    { type: 'bot', text: '📝 <b>Новый пост</b>\n\nВыберите площадку для публикации:', buttons: ['📸 Instagram', '💬 VK', '✈️ Telegram', '📢 Все сразу'] },
                    { type: 'user', text: '📢 Все сразу' },
                    { type: 'bot', text: '✍️ Отправьте текст поста:\n\n<i>Можно добавить эмоджи, хэштеги.\nФото/видео прикрепите следующим сообщением.</i>' },
                    { type: 'user', text: '🔥 Новая коллекция весна 2026! Стильные образы уже в каталоге. Переходите по ссылке в шапке профиля 👆 #мода #весна2026 #новинки' },
                    { type: 'bot', text: '📅 Когда опубликовать?', buttons: ['🚀 Сейчас', '📅 Сегодня 18:00', '📅 Завтра 10:00', '📅 Выбрать время'] },
                    { type: 'user', text: '📅 Сегодня 18:00' },
                    { type: 'bot', text: '✅ <b>Пост запланирован!</b>\n\n📢 Площадки: Instagram, VK, Telegram\n📅 Публикация: сегодня, 18:00\n📝 Текст: 156 символов\n🏷 Хэштеги: 3\n\n⏰ Опубликую автоматически!' },
                    { type: 'user', text: '📅 Расписание' },
                    { type: 'bot', text: '📅 <b>Расписание на неделю:</b>\n\n🟢 Пн 10:00 - «Тренды 2026» → VK, TG\n🟢 Пн 18:00 - Сторис → Instagram\n🟡 Вт 12:00 - Reels → Instagram\n🟡 Ср 10:00 - «Отзыв клиента» → Все\n🔵 Чт 14:00 - «Новая коллекция» → Все\n🔵 Пт 10:00 - Итоги недели → TG\n🔵 Сб 12:00 - Акция выходного дня → Все\n\n📊 Всего: <b>7 постов</b> в очереди', buttons: ['➕ Добавить пост', '✏️ Редактировать', '🗑 Удалить'] },
                    { type: 'user', text: '⚙️ Настройки' },
                    { type: 'bot', text: '', gersSettings: {
                        title: 'Настройки AutoPost', version: 'v2.0',
                        rows: [
                            { label: 'Instagram', desc: '@brand_official - 15.2K подписчиков', value: 'Подключён', color: '#E1306C' },
                            { label: 'VKонтакте', desc: 'Группа «Brand» - 8.4K подписчиков', value: 'Подключён', color: '#5B7CF7' },
                            { label: 'Telegram', desc: '@brand_channel - 5.1K подписчиков', value: 'Подключён', color: '#29B6F6' },
                            { label: 'Авто-хэштеги', desc: 'Добавлять хэштеги автоматически', value: 'Включены', color: '#4ADE80' },
                            { label: 'Водяной знак', desc: 'Логотип на изображениях', value: 'Включён', color: '#F59E0B' },
                            { label: 'Лучшее время', desc: 'AI подбор оптимального времени', value: 'Активен', color: '#C084FC' }
                        ]
                    }},
                ]
            },
            'auto-email': {
                name: 'GERS MailFlow',
                messages: [
                    { type: 'bot', text: '', gersCard: {
                        title: 'GERS',
                        subtitle: 'Email Marketing Automation',
                        features: [
                            { color: '#5B7CF7', label: 'Цепочки писем', desc: 'Автоматические серии для воронки продаж' },
                            { color: '#4ADE80', label: 'Триггеры', desc: 'Отправка по действиям пользователя' },
                            { color: '#F59E0B', label: 'A/B тесты', desc: 'Тестирование тем и контента' },
                            { color: '#60A5FA', label: 'Сегментация', desc: 'Персонализация по группам клиентов' },
                            { color: '#C084FC', label: 'Аналитика', desc: 'Open rate, CTR, конверсии' }
                        ],
                        version: 'v1.5'
                    }},
                    { type: 'user', text: '/start' },
                    { type: 'bot', text: '👋 Привет! Я <b>GERS MailFlow</b> - автоматизирую email-маркетинг.\n\nАктивных кампаний: <b>5</b>\nБаза подписчиков: <b>12 400</b>', buttons: ['📩 Новая кампания', '📊 Статистика', '🔗 Воронки', '⚙️ Настройки'] },
                    { type: 'user', text: '📊 Статистика' },
                    { type: 'bot', text: '', gersDashboard: {
                        title: 'GERS', subtitle: 'Email Marketing Automation', date: '28.02.2026', version: 'v1.5',
                        stats: [
                            { value: '12.4K', label: 'ПОДПИСЧИКИ', color: '#5B7CF7' },
                            { value: '34.2%', label: 'OPEN RATE', color: '#4ADE80' },
                            { value: '8.7%', label: 'CTR', color: '#F59E0B' },
                            { value: '4.2%', label: 'КОНВЕРСИЯ', color: '#00F0FF' }
                        ],
                        categories: [
                            { name: 'Welcome-серия', count: 4200, color: '#5B7CF7' },
                            { name: 'Промо-акции', count: 3800, color: '#F59E0B' },
                            { name: 'Реактивация', count: 2100, color: '#EF4444' },
                            { name: 'Триггерные', count: 1500, color: '#4ADE80' },
                            { name: 'Дайджест', count: 800, color: '#C084FC' }
                        ],
                        topPrices: [
                            { name: '«Скидка -40% сегодня»', shop: 'Промо · 27 фев', price: '42.1% open' },
                            { name: '«Добро пожаловать!»', shop: 'Welcome · авто', price: '38.5% open' },
                            { name: '«Новинки недели»', shop: 'Дайджест · 24 фев', price: '31.2% open' },
                            { name: '«Скучаем по вам»', shop: 'Реактивация · авто', price: '28.7% open' },
                            { name: '«Корзина ждёт»', shop: 'Триггер · авто', price: '24.3% open' }
                        ]
                    }},
                    { type: 'user', text: '🔗 Воронки' },
                    { type: 'bot', text: '🔗 <b>Активные воронки:</b>\n\n1️⃣ <b>Welcome-серия</b> (5 писем)\n   📩 Регистрация → Приветствие → Обзор → Кейсы → Оффер\n   ✅ Open rate: 38.5% · Конверсия: 12%\n\n2️⃣ <b>Брошенная корзина</b> (3 письма)\n   🛒 Через 1ч → Через 24ч → Скидка через 48ч\n   ✅ Open rate: 24.3% · Возврат: 18%\n\n3️⃣ <b>Реактивация</b> (4 письма)\n   😴 30 дней → 60 дней → Скидка → Прощание\n   ✅ Open rate: 28.7% · Возврат: 8%', buttons: ['➕ Создать воронку', '✏️ Редактировать', '📊 Детальная аналитика'] },
                    { type: 'user', text: '📩 Новая кампания' },
                    { type: 'bot', text: '📩 <b>Новая кампания</b>\n\nВыберите тип рассылки:', buttons: ['📢 Промо-акция', '📰 Дайджест', '🔄 Триггерная', '📋 Из шаблона'] },
                    { type: 'user', text: '📢 Промо-акция' },
                    { type: 'bot', text: '🎯 Выберите сегмент аудитории:', buttons: ['👥 Все подписчики (12.4K)', '🛒 Покупатели (3.2K)', '👀 Активные (5.8K)', '😴 Неактивные (3.4K)'] },
                    { type: 'user', text: '🛒 Покупатели (3.2K)' },
                    { type: 'bot', text: '✍️ Введите тему письма:\n\n💡 <i>Рекомендации:\n• Длина: 30-50 символов\n• Добавьте эмоджи\n• Создайте интригу</i>' },
                    { type: 'user', text: '🔥 Только для вас: -40% на всё до конца недели!' },
                    { type: 'bot', text: '✅ <b>Кампания создана!</b>\n\n📩 Тема: 🔥 Только для вас: -40%...\n👥 Получатели: 3 200 (покупатели)\n📅 Отправка: немедленно\n\n📊 Прогноз:\n• Open rate: ~35%\n• CTR: ~9%\n• Конверсия: ~4.5%', buttons: ['🚀 Отправить', '📅 Запланировать', '👁 Превью'] },
                    { type: 'user', text: '⚙️ Настройки' },
                    { type: 'bot', text: '', gersSettings: {
                        title: 'Настройки MailFlow', version: 'v1.5',
                        rows: [
                            { label: 'SMTP сервер', desc: 'Отправка через выделенный сервер', value: 'smtp.gers.pro', color: '#5B7CF7' },
                            { label: 'Отправитель', desc: 'Имя и email отправителя', value: 'GERS Store', color: '#4ADE80' },
                            { label: 'Частота рассылки', desc: 'Максимум писем в день на 1 подписчика', value: '1 / день', color: '#F59E0B' },
                            { label: 'Антиспам', desc: 'Проверка перед отправкой', value: 'SPF + DKIM', color: '#4ADE80' },
                            { label: 'Отписка', desc: 'Автоматическая обработка отписок', value: 'Включена', color: '#C084FC' },
                            { label: 'A/B тестирование', desc: 'Автовыбор лучшей темы', value: 'Включено', color: '#60A5FA' }
                        ]
                    }},
                ]
            },
            'auto-docs': {
                name: 'GERS DocGen',
                messages: [
                    { type: 'bot', text: '', gersCard: {
                        title: 'GERS',
                        subtitle: 'Document Generation Engine',
                        features: [
                            { color: '#5B7CF7', label: 'Шаблоны', desc: 'Договоры, счета, акты, КП' },
                            { color: '#4ADE80', label: 'Автозаполнение', desc: 'Данные клиента из CRM / базы' },
                            { color: '#F59E0B', label: 'PDF генерация', desc: 'Готовый документ за секунды' },
                            { color: '#60A5FA', label: 'Нумерация', desc: 'Автоматическая нумерация документов' },
                            { color: '#C084FC', label: 'Хранилище', desc: 'Архив всех сгенерированных документов' }
                        ],
                        version: 'v1.2'
                    }},
                    { type: 'user', text: '/start' },
                    { type: 'bot', text: '👋 Привет! Я <b>GERS DocGen</b> - генерирую документы из шаблонов.\n\nШаблонов: <b>12</b>\nСгенерировано: <b>2 480 документов</b>', buttons: ['📄 Создать документ', '📋 Шаблоны', '📊 Статистика', '⚙️ Настройки'] },
                    { type: 'user', text: '📊 Статистика' },
                    { type: 'bot', text: '', gersDashboard: {
                        title: 'GERS', subtitle: 'Document Generation Engine', date: '28.02.2026', version: 'v1.2',
                        stats: [
                            { value: '12', label: 'ШАБЛОНОВ', color: '#5B7CF7' },
                            { value: '2,480', label: 'ДОКУМЕНТОВ', color: '#4ADE80' },
                            { value: '248', label: 'ЗА МЕСЯЦ', color: '#F59E0B' },
                            { value: '-90%', label: 'ВРЕМЯ', color: '#00F0FF' }
                        ],
                        categories: [
                            { name: 'Договоры', count: 840, color: '#5B7CF7' },
                            { name: 'Счета', count: 720, color: '#4ADE80' },
                            { name: 'Акты', count: 480, color: '#F59E0B' },
                            { name: 'КП', count: 240, color: '#C084FC' },
                            { name: 'Накладные', count: 120, color: '#60A5FA' },
                            { name: 'Прочие', count: 80, color: '#EC4899' }
                        ],
                        topPrices: [
                            { name: 'Договор услуг', shop: 'Самый частый', price: '340 шт' },
                            { name: 'Счёт на оплату', shop: 'Авто из CRM', price: '720 шт' },
                            { name: 'Акт выполненных работ', shop: 'По закрытию проекта', price: '480 шт' },
                            { name: 'Коммерческое предложение', shop: 'По запросу', price: '240 шт' },
                            { name: 'Доп. соглашение', shop: 'Изменение условий', price: '180 шт' }
                        ]
                    }},
                    { type: 'user', text: '📄 Создать документ' },
                    { type: 'bot', text: '📄 Выберите тип документа:', buttons: ['📝 Договор', '💰 Счёт', '✅ Акт', '📋 КП', '📦 Накладная', '📄 Другое'] },
                    { type: 'user', text: '📝 Договор' },
                    { type: 'bot', text: '📝 Выберите шаблон договора:', buttons: ['🔧 Договор услуг', '💻 Договор разработки', '📢 Договор рекламы', '🏢 Договор аренды'] },
                    { type: 'user', text: '💻 Договор разработки' },
                    { type: 'bot', text: '🏢 Введите данные заказчика:\n\n<i>Компания, ИНН, контактное лицо\nИли выберите из базы:</i>', buttons: ['📋 Из CRM', '✍️ Ввести вручную'] },
                    { type: 'user', text: '📋 Из CRM' },
                    { type: 'bot', text: '🔍 Найдено в CRM:', buttons: ['ООО «ТехноСтарт» · ИНН 7712345678', 'ИП Иванов А.С. · ИНН 771234567890', 'ООО «ДигиталПро» · ИНН 7798765432'] },
                    { type: 'user', text: 'ООО «ТехноСтарт» · ИНН 7712345678' },
                    { type: 'bot', text: '💰 Сумма договора:' },
                    { type: 'user', text: '450 000' },
                    { type: 'bot', text: '✅ <b>Документ сгенерирован!</b>\n\n📝 Договор разработки ПО\n🔢 №GERS-2026-0341\n🏢 Заказчик: ООО «ТехноСтарт»\n💰 Сумма: 450 000₽\n📅 Дата: 28.02.2026\n\n📄 Формат: PDF\n📎 Файл отправлен! ⬇️', buttons: ['📄 Скачать PDF', '📝 Скачать DOCX', '✏️ Редактировать', '📩 Отправить клиенту'] },
                    { type: 'user', text: '⚙️ Настройки' },
                    { type: 'bot', text: '', gersSettings: {
                        title: 'Настройки DocGen', version: 'v1.2',
                        rows: [
                            { label: 'Компания', desc: 'Ваши реквизиты в документах', value: 'ООО «GERS»', color: '#5B7CF7' },
                            { label: 'Нумерация', desc: 'Формат номера документа', value: 'GERS-YYYY-XXXX', color: '#F59E0B' },
                            { label: 'CRM интеграция', desc: 'Автоподтягивание данных клиентов', value: 'Bitrix24', color: '#4ADE80' },
                            { label: 'Формат по умолчанию', desc: 'Основной формат выходного файла', value: 'PDF', color: '#EF4444' },
                            { label: 'ЭЦП', desc: 'Электронная подпись документов', value: 'Настроена', color: '#C084FC' },
                            { label: 'Хранилище', desc: 'Облачное хранение сгенерированных файлов', value: '2,480 файлов', color: '#60A5FA' }
                        ]
                    }},
                ]
            }
        };
        
        const chat = botChats[previewType] || botChats.pizza;
        const isAnimated = chat.animated === true;
        
        // Incremental time generator
        let _msgMinute = 30;
        const _baseHour = 14;
        const getTime = (msgType) => {
            const m = _msgMinute;
            _msgMinute += (msgType === 'user') ? 1 : Math.floor(Math.random() * 2) + 1;
            if (_msgMinute > 59) _msgMinute -= 60;
            const h = _baseHour + Math.floor(m > 59 ? 1 : 0);
            return `${h}:${String(m % 60).padStart(2, '0')}`;
        };
        
        // Track previous message type for grouping
        let _prevType = null;
        
        const renderMessage = (msg, idx) => {
            let extraHTML = '';
            const isGrouped = (msg.type === _prevType);
            const groupClass = isGrouped ? ' grouped' : '';
            _prevType = msg.type;
            const timeStr = getTime(msg.type);
            const readReceipt = msg.type === 'user' ? '<span class="msg-read">✓✓</span>' : '';
            const ava = msg.type === 'bot' ? `<div class="bot-msg-ava">${botEmoji}</div>` : '';
            
            // GERS branded card (welcome screen)
            if (msg.gersCard) {
                _prevType = 'bot';
                const gc = msg.gersCard;
                const featuresHTML = gc.features.map(f => `
                    <div class="gers-card-feature">
                        <span class="gers-card-dot" style="background:${f.color}"></span>
                        <div class="gers-card-feature-text">
                            <span class="gers-card-feature-label">${f.label}</span>
                            <span class="gers-card-feature-desc">${f.desc}</span>
                        </div>
                    </div>
                `).join('');
                extraHTML += `<div class="gers-welcome-card">
                    <div class="gers-card-header">
                        <div class="gers-card-logo">G</div>
                        <div class="gers-card-decor"></div>
                    </div>
                    <div class="gers-card-title">${gc.title}</div>
                    <div class="gers-card-subtitle">${gc.subtitle}</div>
                    <div class="gers-card-features">${featuresHTML}</div>
                    <div class="gers-card-footer">Используйте кнопки меню ниже</div>
                    <div class="gers-card-version">${gc.version}</div>
                </div>`;
                return `<div class="bot-msg bot gers-card-msg${groupClass}">${ava}<div class="bot-msg-inner"><span class="msg-sender">🤖 Бот</span>${extraHTML}<span class="msg-time">${timeStr}</span></div></div>`;
            }
            
            // GERS Dashboard Report
            if (msg.gersDashboard) {
                const d = msg.gersDashboard;
                const statsHTML = d.stats.map(s => `
                    <div class="gers-dash-stat">
                        <div class="gers-dash-stat-bar" style="background:${s.color}"></div>
                        <span class="gers-dash-stat-value">${s.value}</span>
                        <span class="gers-dash-stat-label">${s.label}</span>
                    </div>
                `).join('');
                const barsHTML = d.categories ? d.categories.map(c => {
                    const maxVal = Math.max(...d.categories.map(x => x.count));
                    const pct = (c.count / maxVal * 100).toFixed(0);
                    return `<div class="gers-dash-bar-row">
                        <span class="gers-dash-bar-label">${c.name}</span>
                        <div class="gers-dash-bar-track"><div class="gers-dash-bar-fill" style="width:${pct}%;background:${c.color}"></div></div>
                        <span class="gers-dash-bar-val">${c.count}</span>
                    </div>`;
                }).join('') : '';
                const topPricesHTML = d.topPrices ? d.topPrices.map((p, i) => `
                    <div class="gers-dash-top-row">
                        <span class="gers-dash-top-num" style="background:${['#F59E0B','#9CA3AF','#CD7F32','#5B7CF7','#C084FC'][i]}">${i+1}</span>
                        <div class="gers-dash-top-info">
                            <span class="gers-dash-top-name">${p.name}</span>
                            <span class="gers-dash-top-shop">${p.shop}</span>
                        </div>
                        <span class="gers-dash-top-price">${p.price}</span>
                    </div>
                `).join('') : '';
                const topDiscountsHTML = d.topDiscounts ? d.topDiscounts.map(dd => `
                    <div class="gers-dash-discount-row">
                        <span class="gers-dash-discount-badge">${dd.discount}</span>
                        <span class="gers-dash-discount-name">${dd.name}</span>
                        <span class="gers-dash-discount-old">${dd.oldPrice}</span>
                        <span class="gers-dash-discount-new">${dd.newPrice}</span>
                    </div>
                `).join('') : '';
                extraHTML += `<div class="gers-dashboard">
                    <div class="gers-dash-header">
                        <div class="gers-dash-header-left"><div class="gers-card-logo">G</div><div><span class="gers-dash-title">${d.title || 'GERS'}</span><span class="gers-dash-sub">${d.subtitle || ''}</span></div></div>
                        <span class="gers-dash-date">${d.date || ''}</span>
                    </div>
                    <div class="gers-dash-stats">${statsHTML}</div>
                    ${barsHTML ? `<div class="gers-dash-section"><h4 class="gers-dash-section-title">Товаров по категориям</h4>${barsHTML}</div>` : ''}
                    ${topPricesHTML ? `<div class="gers-dash-section"><h4 class="gers-dash-section-title">Top-5 лучших цен</h4>${topPricesHTML}</div>` : ''}
                    ${topDiscountsHTML ? `<div class="gers-dash-section"><h4 class="gers-dash-section-title">Top-5 скидок</h4>${topDiscountsHTML}</div>` : ''}
                    <div class="gers-dash-footer">GERS ${d.version || 'v1.0'} | ${d.subtitle || ''}</div>
                </div>`;
                return `<div class="bot-msg bot gers-card-msg${groupClass}">${ava}<div class="bot-msg-inner"><span class="msg-sender">🤖 Бот</span>${extraHTML}<span class="msg-time">${timeStr}</span></div></div>`;
            }
            
            // GERS Settings Panel
            if (msg.gersSettings) {
                const s = msg.gersSettings;
                const rowsHTML = s.rows.map(r => `
                    <div class="gers-settings-row">
                        <div class="gers-settings-row-border" style="background:${r.color}"></div>
                        <div class="gers-settings-row-info">
                            <span class="gers-settings-row-label">${r.label}</span>
                            <span class="gers-settings-row-desc">${r.desc}</span>
                        </div>
                        <span class="gers-settings-row-value" style="color:${r.color}">${r.value}</span>
                    </div>
                `).join('');
                extraHTML += `<div class="gers-dashboard gers-settings-panel">
                    <div class="gers-settings-header">
                        <div class="gers-card-logo">G</div>
                        <span class="gers-settings-title">${s.title}</span>
                    </div>
                    ${rowsHTML}
                    <div class="gers-dash-footer">GERS ${s.version || 'v1.0'} | Settings</div>
                </div>`;
                return `<div class="bot-msg bot gers-card-msg${groupClass}">${ava}<div class="bot-msg-inner"><span class="msg-sender">🤖 Бот</span>${extraHTML}<span class="msg-time">${timeStr}</span></div></div>`;
            }
            
            // Master cards (beauty salon)
            if (msg.masterCards) {
                extraHTML += `<div class="bot-master-cards">${msg.masterCards.map(m => `
                    <div class="bot-master-card">
                        <div class="bot-master-avatar">${m.avatar}</div>
                        <div class="bot-master-info">
                            <span class="bot-master-name">${m.name}</span>
                            <span class="bot-master-spec">${m.speciality}</span>
                            <span class="bot-master-rating">⭐ ${m.rating} · ${m.reviews} отзывов</span>
                        </div>
                    </div>
                `).join('')}</div>`;
                return `<div class="bot-msg bot${groupClass}">${ava}<div class="bot-msg-inner"><span class="msg-sender">🤖 Бот</span>${extraHTML}<span class="msg-time">${timeStr}</span></div></div>`;
            }
            
            // Doctor cards (clinic)
            if (msg.doctorCards) {
                extraHTML += `<div class="bot-doctor-cards">${msg.doctorCards.map(d => `
                    <div class="bot-doctor-card">
                        <div class="bot-doctor-left">
                            <div class="bot-doctor-avatar">${d.photo}</div>
                        </div>
                        <div class="bot-doctor-info">
                            <span class="bot-doctor-name">${d.name}</span>
                            <span class="bot-doctor-spec">${d.specialty}</span>
                            <div class="bot-doctor-meta">
                                <span>⭐ ${d.rating}</span>
                                <span>📝 ${d.reviews}</span>
                                <span>🕐 ${d.exp}</span>
                            </div>
                            <span class="bot-doctor-price">${d.price}</span>
                        </div>
                    </div>
                `).join('')}</div>`;
                return `<div class="bot-msg bot${groupClass}">${ava}<div class="bot-msg-inner"><span class="msg-sender">🤖 Бот</span>${extraHTML}<span class="msg-time">${timeStr}</span></div></div>`;
            }
            
            // Schedule slots
            if (msg.schedule) {
                extraHTML += `<div class="bot-schedule">${msg.schedule.map(day => `
                    <div class="bot-schedule-day">
                        <span class="bot-schedule-date">${day.day}</span>
                        <div class="bot-schedule-slots">${day.slots.map(s => `<span class="bot-schedule-slot">${s}</span>`).join('')}</div>
                    </div>
                `).join('')}</div>`;
                return `<div class="bot-msg bot${groupClass}">${ava}<div class="bot-msg-inner"><span class="msg-sender">🤖 Бот</span>${extraHTML}<span class="msg-time">${timeStr}</span></div></div>`;
            }
            
            // Booking confirmation card
            if (msg.bookingCard) {
                const b = msg.bookingCard;
                extraHTML += `<div class="bot-booking-card">
                    <div class="bot-booking-header">📋 Подтверждение</div>
                    <div class="bot-booking-row"><span class="bot-booking-label">Услуга</span><span class="bot-booking-value">${b.service}</span></div>
                    <div class="bot-booking-row"><span class="bot-booking-label">Специалист</span><span class="bot-booking-value">${b.master}</span></div>
                    <div class="bot-booking-row"><span class="bot-booking-label">Дата</span><span class="bot-booking-value">${b.date}</span></div>
                    <div class="bot-booking-row"><span class="bot-booking-label">Время</span><span class="bot-booking-value">${b.time}</span></div>
                    <div class="bot-booking-row"><span class="bot-booking-label">Длительность</span><span class="bot-booking-value">${b.duration}</span></div>
                    <div class="bot-booking-row bot-booking-price"><span class="bot-booking-label">Стоимость</span><span class="bot-booking-value">${b.price}</span></div>
                    ${b.note ? `<div class="bot-booking-note">💬 ${b.note}</div>` : ''}
                </div>`;
                return `<div class="bot-msg bot${groupClass}">${ava}<div class="bot-msg-inner"><span class="msg-sender">🤖 Бот</span>${extraHTML}<span class="msg-time">${timeStr}</span></div></div>`;
            }
            
            // Product grid (4 items)
            if (msg.products) {
                extraHTML += `<div class="bot-msg-product">${msg.products.map(p => {
                    const imgContent = p.img 
                        ? `<img src="${p.img}" alt="${p.name}">` 
                        : p.emoji;
                    const bgStyle = p.bg ? `background:${p.bg}` : '';
                    return `<div class="bot-product-card">
                        <div class="product-img" style="${bgStyle}">${imgContent}</div>
                        <div class="product-info">
                            <span class="product-name">${p.name}</span>
                            <span class="product-price">${p.price}</span>
                        </div>
                    </div>`;
                }).join('')}</div>`;
            }
            
            // Single product image
            if (msg.product) {
                const p = msg.product;
                const imgContent = p.img 
                    ? `<img src="${p.img}" alt="${p.name}">` 
                    : p.emoji;
                const bgStyle = p.bg ? `background:${p.bg}` : '';
                extraHTML += `<div class="bot-msg-product-single">
                    <div class="product-img" style="${bgStyle}">${imgContent}</div>
                    <div class="product-overlay">
                        <span class="product-name">${p.name}</span>
                        <span class="product-price">${p.price}</span>
                    </div>
                </div>`;
            }
            
            if (msg.buttons) {
                extraHTML += `<div class="bot-msg-buttons">${msg.buttons.map(b => `<span class="bot-msg-btn">${b}</span>`).join('')}</div>`;
            }
            
            const textHTML = msg.text ? `<span>${msg.text.replace(/\n/g, '<br>')}</span>` : '';
            const senderLabel = msg.type === 'bot' ? `${botEmoji} Бот` : '👤 Вы';
            return `<div class="bot-msg ${msg.type}${groupClass}">${ava}<div class="bot-msg-inner"><span class="msg-sender">${senderLabel}</span>${extraHTML}${textHTML}<span class="msg-time">${timeStr} ${readReceipt}</span></div></div>`;
        };
        
        // Bot-specific customization
        const botEmoji = chat.botEmoji || '🤖';
        const botColor = chat.botColor || '#FF2F8B';
        
        // Reset grouping state
        _prevType = null;
        _msgMinute = 30;
        
        const dateSep = `<div class="bot-chat-date-sep"><span>Сегодня</span></div>`;
        const messagesHTML = isAnimated ? '' : (dateSep + chat.messages.map((m, i) => renderMessage(m, i)).join(''));
        
        mainImage.innerHTML = `
            <div class="bot-phone-frame" style="box-shadow: 0 25px 80px rgba(0,0,0,0.6), 0 0 50px ${botColor}15;">
                <div class="bot-phone-notch"></div>
                <div class="bot-chat-preview ${isAnimated ? 'bot-chat-animated' : ''}" style="position:relative;">
                    <div class="bot-chat-header">
                        <div class="bot-chat-avatar" style="background: linear-gradient(135deg, ${botColor}30, ${botColor}10); border-color: ${botColor}50;">
                            <span style="font-size: 1.1rem;">${botEmoji}</span>
                        </div>
                        <div class="bot-chat-header-info">
                            <span class="bot-chat-name">${chat.name}</span>
                            <span class="bot-chat-status">онлайн</span>
                        </div>
                        <div class="bot-chat-header-actions">
                            <button title="Поиск"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg></button>
                            <button title="Меню"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg></button>
                        </div>
                    </div>
                    ${isAnimated ? '<div class="bot-chat-progress"><div class="bot-chat-progress-bar" id="botChatProgress"></div></div>' : ''}
                    <div class="bot-chat-messages" id="botChatMessages">${messagesHTML}</div>
                    <div class="bot-chat-input-mock">
                        <span>Написать сообщение...</span>
                        <svg viewBox="0 0 24 24"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg>
                    </div>
                    ${isAnimated ? '<button class="bot-chat-replay" id="botChatReplay" title="Перезапустить"><svg viewBox="0 0 24 24"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg></button>' : ''}
                </div>
                <div class="bot-phone-home"></div>
            </div>
        `;
        
        thumbnails.innerHTML = '';
        counter.textContent = '';
        
        // Override aspect ratio for phone frame
        mainImage.style.aspectRatio = 'unset';
        mainImage.style.maxHeight = '720px';
        mainImage.style.background = 'transparent';
        
        // Hide gallery nav arrows
        document.getElementById('galleryPrev').style.display = 'none';
        document.getElementById('galleryNext').style.display = 'none';
        document.getElementById('galleryFullscreen').style.display = 'none';
        
        // Animated message appearance
        if (isAnimated) {
            const chatContainer = document.getElementById('botChatMessages');
            if (!chatContainer) return;
            const progressBar = document.getElementById('botChatProgress');
            const replayBtn = document.getElementById('botChatReplay');
            
            // Reset grouping for animation
            _prevType = null;
            _msgMinute = 30;
            
            const startAnimation = () => {
                chatContainer.innerHTML = '<div class="bot-chat-date-sep"><span>Сегодня</span></div>';
                _prevType = null;
                _msgMinute = 30;
                let msgIndex = 0;
                const messages = chat.messages;
                if (replayBtn) { replayBtn.classList.remove('visible'); }
                if (progressBar) progressBar.style.width = '0%';
                
                const typingHTML = `<div class="bot-msg bot bot-typing-msg">
                    <div class="bot-msg-ava">${botEmoji}</div>
                    <div class="bot-msg-inner">
                        <div class="bot-typing"><span></span><span></span><span></span></div>
                    </div>
                </div>`;
                
                const updateProgress = () => {
                    if (progressBar) {
                        const pct = Math.min(100, ((msgIndex + 1) / messages.length) * 100);
                        progressBar.style.width = pct + '%';
                    }
                };
                
                const showNextMessage = () => {
                    if (msgIndex >= messages.length) {
                        if (replayBtn) replayBtn.classList.add('visible');
                        if (progressBar) progressBar.style.width = '100%';
                        return;
                    }
                    if (!document.getElementById('botChatMessages')) return;
                    
                    const msg = messages[msgIndex];
                    
                    if (msg.type === 'bot') {
                        chatContainer.insertAdjacentHTML('beforeend', typingHTML);
                        chatContainer.scrollTop = chatContainer.scrollHeight;
                        
                        setTimeout(() => {
                            const typingEl = chatContainer.querySelector('.bot-typing-msg');
                            if (typingEl) typingEl.remove();
                            
                            const html = renderMessage(msg, msgIndex);
                            const wrapper = document.createElement('div');
                            wrapper.innerHTML = html;
                            const msgEl = wrapper.firstElementChild;
                            msgEl.classList.add('bot-msg-appear');
                            chatContainer.appendChild(msgEl);
                            chatContainer.scrollTop = chatContainer.scrollHeight;
                            updateProgress();
                            
                            msgIndex++;
                            setTimeout(showNextMessage, 500 + Math.random() * 300);
                        }, 800 + Math.random() * 600);
                    } else {
                        setTimeout(() => {
                            const html = renderMessage(msg, msgIndex);
                            const wrapper = document.createElement('div');
                            wrapper.innerHTML = html;
                            const msgEl = wrapper.firstElementChild;
                            msgEl.classList.add('bot-msg-appear');
                            chatContainer.appendChild(msgEl);
                            chatContainer.scrollTop = chatContainer.scrollHeight;
                            updateProgress();
                            
                            msgIndex++;
                            setTimeout(showNextMessage, 400 + Math.random() * 200);
                        }, 350);
                    }
                };
                
                setTimeout(showNextMessage, 500);
            };
            
            startAnimation();
            
            // Replay button handler
            if (replayBtn) {
                replayBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    startAnimation();
                });
            }
        }
    }
    
    showVideoPreview(videoSrc, projectName) {
        const mainImage = document.getElementById('modalMainImage');
        const thumbnails = document.getElementById('modalThumbnails');
        const counter = document.getElementById('galleryCounter');
        const modalContent = this.modal.querySelector('.project-modal-content');
        
        // Add mobile layout class
        modalContent.classList.add('modal-mobile-layout');
        
        // Hide gallery nav
        document.getElementById('galleryPrev').style.display = 'none';
        document.getElementById('galleryNext').style.display = 'none';
        document.getElementById('galleryFullscreen').style.display = 'none';
        thumbnails.innerHTML = '';
        counter.textContent = '';
        
        // Override aspect ratio for phone frame
        mainImage.style.aspectRatio = 'unset';
        mainImage.style.background = 'transparent';
        mainImage.style.maxHeight = 'none';
        
        mainImage.innerHTML = `
            <div class="video-phone-frame">
                <div class="video-phone-notch"></div>
                <div class="video-phone-screen">
                    <video class="video-phone-player" autoplay muted loop playsinline>
                        <source src="${videoSrc}" type="video/mp4">
                        Ваш браузер не поддерживает видео.
                    </video>
                </div>
                <div class="video-phone-home"></div>
            </div>
        `;
        
        // Auto-play the video
        const video = mainImage.querySelector('.video-phone-player');
        if (video) {
            video.play().catch(() => {});
        }
    }
    
    showWebPreview(previewType, projectName) {
        this.screenshots = [];
        const mainImage = document.getElementById('modalMainImage');
        const thumbnails = document.getElementById('modalThumbnails');
        const counter = document.getElementById('galleryCounter');

        const webPreviews = {
            'ai-support': {
                title: 'GERS AI Support',
                sidebar: [
                    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>', label: 'Диалоги', active: true },
                    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>', label: 'Клиенты' },
                    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>', label: 'Аналитика' },
                    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>', label: 'Настройки' }
                ],
                stats: [
                    { value: '1,247', label: 'Всего диалогов', color: '#5B7CF7' },
                    { value: '94.2%', label: 'Решено AI', color: '#4ADE80' },
                    { value: '1.2 сек', label: 'Среднее время', color: '#F59E0B' },
                    { value: '4.8/5', label: 'Оценка', color: '#C084FC' }
                ],
                conversations: [
                    { name: 'Алексей М.', time: '2 мин назад', status: 'ai', preview: 'Подскажите статус моего заказа #4521', unread: true },
                    { name: 'Ирина К.', time: '5 мин назад', status: 'ai', preview: 'Как изменить адрес доставки?', unread: true },
                    { name: 'Дмитрий В.', time: '12 мин назад', status: 'resolved', preview: 'Спасибо, вопрос решён!' },
                    { name: 'Ольга С.', time: '18 мин назад', status: 'operator', preview: 'Перевод на оператора - возврат средств' },
                    { name: 'Максим Т.', time: '25 мин назад', status: 'resolved', preview: 'Где скачать приложение?' },
                    { name: 'Анна Р.', time: '31 мин назад', status: 'resolved', preview: 'Условия программы лояльности' },
                    { name: 'Сергей Л.', time: '45 мин назад', status: 'ai', preview: 'Не работает промокод SALE20' }
                ],
                chat: [
                    { from: 'client', text: 'Здравствуйте! Подскажите статус моего заказа #4521' },
                    { from: 'ai', text: 'Здравствуйте, Алексей! Проверяю информацию по заказу #4521...\n\nЗаказ #4521 - статус: В пути\nОтправлен: 28 февраля\nОжидаемая доставка: 2 марта\nТрек-номер: SDEK-78451239\n\nПосылка находится в сортировочном центре вашего города. Доставка завтра с 10:00 до 18:00.' },
                    { from: 'client', text: 'Можно ли изменить время доставки на утро?' },
                    { from: 'ai', text: 'Конечно! Я обновил интервал доставки.\n\nНовый интервал: 2 марта, 10:00 - 13:00\n\nКурьер позвонит за 30 минут до прибытия. Если потребуется ещё что-то - пишите.' },
                    { from: 'client', text: 'Отлично, спасибо!' },
                    { from: 'ai', text: 'Рад помочь! Хорошего дня.' }
                ]
            },
            'ai-content': {
                title: 'GERS Content AI',
                sidebar: [
                    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>', label: 'Генерация', active: true },
                    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>', label: 'Мои тексты' },
                    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>', label: 'Шаблоны' },
                    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>', label: 'Статистика' }
                ],
                stats: [
                    { value: '3,840', label: 'Текстов создано', color: '#5B7CF7' },
                    { value: '156', label: 'Сегодня', color: '#4ADE80' },
                    { value: '12', label: 'Шаблонов', color: '#F59E0B' },
                    { value: '98%', label: 'Уникальность', color: '#C084FC' }
                ],
                generatorForm: {
                    type: 'Описание товара',
                    product: 'Беспроводные наушники Sony WH-1000XM5',
                    tone: 'Продающий',
                    length: '150-200 слов'
                },
                generatedText: 'Sony WH-1000XM5 - наушники, которые меняют правила. Лучшая в классе система шумоподавления отсекает внешний мир, позволяя полностью погрузиться в музыку. 30 часов автономной работы - для тех, кто не привык останавливаться.\n\nДвойные микрофоны с технологией шумоподавления обеспечивают кристальную чистоту звонков. Мягкие амбушюры из экокожи и невесомая конструкция весом 250 грамм позволяют носить их весь день без дискомфорта.\n\nМультиточечное подключение: переключайтесь между ноутбуком и смартфоном одним касанием. Быстрая зарядка - 3 минуты дают 3 часа воспроизведения.',
                seoScore: { total: 92, readability: 95, keywords: 88, uniqueness: 98 },
                recentTexts: [
                    { title: 'iPhone 15 Pro Max - обзор', type: 'Описание', date: '28.02', score: 94 },
                    { title: 'Samsung Galaxy S24 Ultra', type: 'Описание', date: '28.02', score: 91 },
                    { title: 'Блог: тренды e-commerce 2026', type: 'Статья', date: '27.02', score: 89 },
                    { title: 'Пост VK: Весенняя акция', type: 'Соц. сети', date: '27.02', score: 96 },
                    { title: 'MacBook Air M3 - карточка', type: 'Описание', date: '26.02', score: 93 }
                ]
            },
            'marketplace-services': {
                title: 'GERS Services',
                sidebar: [
                    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>', label: 'Поиск', active: true },
                    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>', label: 'Каталог' },
                    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>', label: 'Избранное' },
                    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>', label: 'Сообщения' },
                    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>', label: 'Профиль' }
                ],
                stats: [
                    { value: '12,480', label: 'Объявлений', color: '#5B7CF7' },
                    { value: '3,720', label: 'Мастеров', color: '#4ADE80' },
                    { value: '8,940', label: 'Выполнено', color: '#F59E0B' },
                    { value: '4.9', label: 'Рейтинг', color: '#C084FC' }
                ],
                categories: [
                    { name: 'Сантехника', count: 842, icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2"/><path d="M12 10v12"/><path d="M8 22h8"/></svg>' },
                    { name: 'Электрика', count: 615, icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>' },
                    { name: 'Ремонт', count: 1230, icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 6V2"/></svg>' },
                    { name: 'Уборка', count: 490, icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/></svg>' },
                    { name: 'Репетиторы', count: 370, icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>' },
                    { name: 'Перевозки', count: 285, icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>' }
                ],
                listings: [
                    { title: 'Замена смесителя, установка раковины', price: 'от 2 500 Р', category: 'Сантехника', master: 'Андрей К.', rating: 4.9, reviews: 127, city: 'Москва', time: '2 часа назад', verified: true, online: true },
                    { title: 'Электромонтажные работы под ключ', price: 'от 3 000 Р', category: 'Электрика', master: 'Сергей В.', rating: 5.0, reviews: 84, city: 'Москва', time: '3 часа назад', verified: true, online: false },
                    { title: 'Косметический ремонт квартир', price: 'от 15 000 Р', category: 'Ремонт', master: 'Бригада "Мастер"', rating: 4.8, reviews: 203, city: 'Санкт-Петербург', time: '5 часов назад', verified: true, online: true },
                    { title: 'Генеральная уборка квартиры', price: 'от 4 500 Р', category: 'Уборка', master: 'CleanPro', rating: 4.7, reviews: 312, city: 'Москва', time: '6 часов назад', verified: false, online: true },
                    { title: 'Математика ЕГЭ - подготовка', price: '1 800 Р / час', category: 'Репетиторы', master: 'Елена М.', rating: 5.0, reviews: 56, city: 'Онлайн', time: '8 часов назад', verified: true, online: true },
                    { title: 'Квартирный переезд с грузчиками', price: 'от 6 000 Р', category: 'Перевозки', master: 'МувингПро', rating: 4.6, reviews: 178, city: 'Москва', time: '10 часов назад', verified: true, online: false },
                    { title: 'Установка розеток и выключателей', price: 'от 800 Р / шт', category: 'Электрика', master: 'Олег Н.', rating: 4.9, reviews: 91, city: 'Казань', time: '12 часов назад', verified: true, online: false },
                    { title: 'Укладка плитки, мозаики', price: 'от 1 200 Р / м2', category: 'Ремонт', master: 'ПлиткаМастер', rating: 4.8, reviews: 145, city: 'Москва', time: '1 день назад', verified: true, online: true }
                ],
                filters: {
                    priceFrom: '500',
                    priceTo: '50 000',
                    sortBy: 'По рейтингу',
                    onlyVerified: true,
                    onlyOnline: false
                }
            },
            'integration-1c': {
                title: 'GERS 1C Sync',
                sidebar: [
                    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="22 12 16 12 14 15 10 9 8 12 2 12"/></svg>', label: 'Синхронизация', active: true },
                    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>', label: 'Товары' },
                    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>', label: 'Цены' },
                    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>', label: 'Остатки' },
                    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>', label: 'Настройки' }
                ],
                stats: [
                    { value: '14,230', label: 'Товаров', color: '#5B7CF7' },
                    { value: '99.8%', label: 'Успешных синхр.', color: '#4ADE80' },
                    { value: '3.2 сек', label: 'Среднее время', color: '#F59E0B' },
                    { value: '24/7', label: 'Режим работы', color: '#C084FC' }
                ],
                products: [
                    { code: 'АРТ-001247', name: 'Кофемашина DeLonghi ECAM', price: '45 990', stock: 23, status: 'synced', updated: '2 мин назад' },
                    { code: 'АРТ-001248', name: 'Пылесос Dyson V15 Detect', price: '59 990', stock: 8, status: 'synced', updated: '2 мин назад' },
                    { code: 'АРТ-001249', name: 'Утюг Philips Azur 8000', price: '12 490', stock: 0, status: 'warning', updated: '5 мин назад' },
                    { code: 'АРТ-001250', name: 'Блендер Bosch VitaPower', price: '8 790', stock: 45, status: 'synced', updated: '2 мин назад' },
                    { code: 'АРТ-001251', name: 'Микроволновая печь Samsung', price: '15 990', stock: 12, status: 'synced', updated: '2 мин назад' },
                    { code: 'АРТ-001252', name: 'Фен Dyson Supersonic', price: '39 990', stock: 3, status: 'warning', updated: '8 мин назад' },
                    { code: 'АРТ-001253', name: 'Чайник Xiaomi Mi Kettle Pro', price: '3 490', stock: 67, status: 'synced', updated: '2 мин назад' }
                ],
                syncLog: [
                    { time: '14:32:05', event: 'Синхронизация завершена', type: 'success', details: '14 230 товаров, 0 ошибок' },
                    { time: '14:32:02', event: 'Обновление остатков', type: 'success', details: 'Склад Москва: 342 позиции' },
                    { time: '14:31:58', event: 'Обновление цен', type: 'success', details: '89 товаров - новые цены' },
                    { time: '14:31:55', event: 'Низкий остаток', type: 'warning', details: 'АРТ-001249: 0 шт., АРТ-001252: 3 шт.' },
                    { time: '14:30:00', event: 'Запуск синхронизации', type: 'info', details: 'Автоматический запуск по расписанию' },
                    { time: '14:02:05', event: 'Синхронизация завершена', type: 'success', details: '14 228 товаров, 0 ошибок' },
                    { time: '13:32:04', event: 'Синхронизация завершена', type: 'success', details: '14 225 товаров, 1 предупреждение' }
                ]
            },
            'integration-acquiring': {
                title: 'GERS Pay',
                sidebar: [
                    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>', label: 'Транзакции', active: true },
                    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>', label: 'Аналитика' },
                    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>', label: 'Выплаты' },
                    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>', label: 'Возвраты' },
                    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>', label: 'Настройки' }
                ],
                stats: [
                    { value: '2.4M', label: 'Оборот, руб', color: '#4ADE80' },
                    { value: '1,847', label: 'Транзакций', color: '#5B7CF7' },
                    { value: '1,298', label: 'Средний чек', color: '#F59E0B' },
                    { value: '97.3%', label: 'Успешных', color: '#C084FC' }
                ],
                transactions: [
                    { id: '#TXN-8924', amount: '4 590', method: 'ЮKassa', card: '•••• 4276', status: 'success', time: '14:28' },
                    { id: '#TXN-8923', amount: '12 800', method: 'CloudPayments', card: '•••• 8891', status: 'success', time: '14:25' },
                    { id: '#TXN-8922', amount: '890', method: 'СБП', card: 'Т-Банк', status: 'success', time: '14:21' },
                    { id: '#TXN-8921', amount: '23 400', method: 'Stripe', card: '•••• 5521', status: 'success', time: '14:18' },
                    { id: '#TXN-8920', amount: '1 200', method: 'ЮKassa', card: '•••• 7703', status: 'refunded', time: '14:15' },
                    { id: '#TXN-8919', amount: '6 990', method: 'CloudPayments', card: '•••• 3342', status: 'success', time: '14:10' },
                    { id: '#TXN-8918', amount: '540', method: 'СБП', card: 'Сбер', status: 'pending', time: '14:08' },
                    { id: '#TXN-8917', amount: '15 600', method: 'Stripe', card: '•••• 9914', status: 'success', time: '14:02' }
                ],
                paymentMethods: [
                    { name: 'ЮKassa', share: 42, amount: '1.01M', color: '#5B7CF7' },
                    { name: 'CloudPayments', share: 28, amount: '672K', color: '#4ADE80' },
                    { name: 'Stripe', share: 18, amount: '432K', color: '#F59E0B' },
                    { name: 'СБП', share: 12, amount: '288K', color: '#C084FC' }
                ]
            },
            'integration-crm': {
                title: 'GERS CRM Bridge',
                sidebar: [
                    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>', label: 'Лиды', active: true },
                    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="22 12 16 12 14 15 10 9 8 12 2 12"/></svg>', label: 'Воронка' },
                    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>', label: 'Заявки' },
                    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>', label: 'Отчёты' },
                    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>', label: 'Настройки' }
                ],
                stats: [
                    { value: '342', label: 'Новых лидов', color: '#5B7CF7' },
                    { value: '28.4%', label: 'Конверсия', color: '#4ADE80' },
                    { value: '86', label: 'В работе', color: '#F59E0B' },
                    { value: '0', label: 'Потеряно', color: '#C084FC' }
                ],
                pipeline: [
                    { stage: 'Новая заявка', count: 24, color: '#5B7CF7', leads: ['ООО «ТехноСтарт»', 'ИП Ковалёв', 'АО «Интер Групп»'] },
                    { stage: 'Квалификация', count: 18, color: '#60A5FA', leads: ['ООО «Вега Трейд»', 'ЗАО «ПромСнаб»'] },
                    { stage: 'Коммерч. предложение', count: 15, color: '#F59E0B', leads: ['ООО «МедиаПлюс»', 'ИП Соколова'] },
                    { stage: 'Переговоры', count: 12, color: '#C084FC', leads: ['ООО «СтройМир»', 'АО «Логистик»'] },
                    { stage: 'Сделка закрыта', count: 97, color: '#4ADE80', leads: ['ООО «Альфа»', 'ИП Новиков'] }
                ],
                recentLeads: [
                    { name: 'Анна Петрова', company: 'ООО «ТехноСтарт»', source: 'Сайт - форма заявки', stage: 'Новая заявка', time: '3 мин назад', phone: '+7 (999) •••-••-47' },
                    { name: 'Дмитрий Ковалёв', company: 'ИП Ковалёв', source: 'Сайт - калькулятор', stage: 'Новая заявка', time: '12 мин назад', phone: '+7 (916) •••-••-23' },
                    { name: 'Мария Сидорова', company: 'АО «Интер Групп»', source: 'Сайт - чат виджет', stage: 'Новая заявка', time: '25 мин назад', phone: '+7 (925) •••-••-81' },
                    { name: 'Алексей Волков', company: 'ООО «Вега Трейд»', source: 'Сайт - обратный звонок', stage: 'Квалификация', time: '1 час назад', phone: '+7 (903) •••-••-55' },
                    { name: 'Елена Козлова', company: 'ЗАО «ПромСнаб»', source: 'Сайт - форма заявки', stage: 'Квалификация', time: '2 часа назад', phone: '+7 (985) •••-••-19' },
                    { name: 'Сергей Морозов', company: 'ООО «МедиаПлюс»', source: 'Сайт - калькулятор', stage: 'КП отправлено', time: '3 часа назад', phone: '+7 (977) •••-••-66' }
                ]
            },
            'ai-docs': {
                title: 'GERS Doc Scanner',
                sidebar: [
                    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>', label: 'Документы', active: true },
                    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="22 12 16 12 14 15 10 9 8 12 2 12"/></svg>', label: 'Обработка' },
                    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>', label: 'Извлечение' },
                    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>', label: 'Экспорт' }
                ],
                stats: [
                    { value: '8,420', label: 'Обработано', color: '#5B7CF7' },
                    { value: '99.1%', label: 'Точность OCR', color: '#4ADE80' },
                    { value: '2.4 сек', label: 'Среднее время', color: '#F59E0B' },
                    { value: '340', label: 'Сегодня', color: '#C084FC' }
                ],
                documents: [
                    { name: 'Договор_поставки_ООО_Вега.pdf', type: 'Договор', status: 'done', fields: 14, date: '28.02' },
                    { name: 'Счёт_№1247_от_27.02.pdf', type: 'Счёт', status: 'done', fields: 8, date: '28.02' },
                    { name: 'Акт_выполненных_работ.pdf', type: 'Акт', status: 'processing', fields: null, date: '28.02' },
                    { name: 'Накладная_ТОРГ-12_№589.pdf', type: 'Накладная', status: 'done', fields: 22, date: '27.02' },
                    { name: 'Счёт-фактура_№834.pdf', type: 'Счёт-фактура', status: 'done', fields: 16, date: '27.02' },
                    { name: 'Договор_аренды_офиса.pdf', type: 'Договор', status: 'done', fields: 18, date: '26.02' }
                ],
                extractedData: {
                    docName: 'Договор поставки №DP-2026/147',
                    fields: [
                        { label: 'Поставщик', value: 'ООО «Вега Трейд»' },
                        { label: 'ИНН', value: '7728456123' },
                        { label: 'Покупатель', value: 'ООО «ТехноСтарт»' },
                        { label: 'Сумма', value: '1 250 000 руб.' },
                        { label: 'НДС', value: '208 333.33 руб.' },
                        { label: 'Дата', value: '25.02.2026' },
                        { label: 'Срок поставки', value: '15 рабочих дней' },
                        { label: 'Предмет', value: 'Серверное оборудование' }
                    ]
                }
            },

            /* ── Mobile App Previews ── */
            'mobile-fitness': {
                title: 'GERS Fitness',
                isMobile: true,
                mobileTheme: 'theme-mob-fitness',
                greeting: 'Привет, Алексей!',
                subtitle: 'Сегодня день ног - не пропусти',
                stats: [
                    { value: '12', label: 'Тренировки', color: '#fff' },
                    { value: '8,450', label: 'Калории', color: '#fff' },
                    { value: '85%', label: 'Прогресс', color: '#fff' }
                ],
                trainers: [
                    { name: 'Марина', color: '#FF6B35' },
                    { name: 'Дмитрий', color: '#3B82F6' },
                    { name: 'Ольга', color: '#EC4899' },
                    { name: 'Артём', color: '#8B5CF6' }
                ],
                workouts: [
                    { name: 'Силовая тренировка', meta: 'Тренер Марина · Зал 2', time: '10:00', iconColor: '#FF6B35', icon: 'dumbbell' },
                    { name: 'Йога для начинающих', meta: 'Тренер Ольга · Зал 5', time: '12:00', iconColor: '#8B5CF6', icon: 'yoga' },
                    { name: 'Кардио HIIT', meta: 'Тренер Дмитрий · Зал 1', time: '14:30', iconColor: '#EF4444', icon: 'cardio' },
                    { name: 'Бокс', meta: 'Тренер Артём · Ринг', time: '16:00', iconColor: '#F59E0B', icon: 'box' },
                    { name: 'Растяжка', meta: 'Тренер Ольга · Зал 5', time: '18:00', iconColor: '#10B981', icon: 'stretch' },
                    { name: 'Функциональный тренинг', meta: 'Тренер Марина · Зал 3', time: '19:30', iconColor: '#3B82F6', icon: 'functional' }
                ],
                progress: {
                    ring: 85,
                    bars: [
                        { label: 'Грудь', pct: 90, color: '#FF6B35' },
                        { label: 'Ноги', pct: 75, color: '#3B82F6' },
                        { label: 'Спина', pct: 82, color: '#8B5CF6' },
                        { label: 'Руки', pct: 68, color: '#10B981' }
                    ]
                },
                schedule: [
                    { name: 'Абонемент «Безлимит»', meta: 'до 15.06.2026', status: 'active' },
                    { name: 'Персональные (5/10)', meta: 'осталось 5 занятий', status: 'warning' }
                ]
            },

            'mobile-taxi': {
                title: 'GERS Ride',
                isMobile: true,
                mobileTheme: 'theme-mob-taxi',
                greeting: 'Куда едем?',
                subtitle: 'Быстрая подача - от 2 минут',
                stats: [
                    { value: '2', label: 'мин подача', color: '#A3E635' },
                    { value: '47', label: 'поездок', color: '#A3E635' },
                    { value: '4.9', label: 'рейтинг', color: '#FBBF24' }
                ],
                from: 'ул. Пушкина, 15',
                to: 'БЦ «Высота», Ленина 42',
                rides: [
                    { cls: 'Эконом', price: '249 ₽', time: '~18 мин', seats: '4', eta: '2 мин' },
                    { cls: 'Комфорт', price: '389 ₽', time: '~18 мин', seats: '4', eta: '4 мин' },
                    { cls: 'Бизнес', price: '620 ₽', time: '~16 мин', seats: '3', eta: '6 мин' }
                ],
                driver: { name: 'Сергей К.', car: 'Toyota Camry · A 777 AA', rating: '4.95' },
                history: [
                    { from: 'Дом', to: 'Офис', price: '195 ₽', date: '03.03.2026' },
                    { from: 'ТЦ «Мега»', to: 'Дом', price: '320 ₽', date: '02.03.2026' },
                    { from: 'Аэропорт', to: 'Отель Grand', price: '890 ₽', date: '28.02.2026' }
                ]
            },

            'mobile-corporate': {
                title: 'GERS Portal',
                isMobile: true,
                mobileTheme: 'theme-mob-corp',
                greeting: 'Добрый день!',
                subtitle: 'GERS Group · 3 новых уведомления',
                stats: [
                    { value: '2,048', label: 'Сотрудники', color: '#1a2744' },
                    { value: '12', label: 'Заявки', color: '#3B82F6' },
                    { value: '5', label: 'Новости', color: '#10B981' }
                ],
                quickActions: [
                    { name: 'Заявка', color: '#3B82F6', icon: 'doc' },
                    { name: 'Отпуск', color: '#10B981', icon: 'calendar' },
                    { name: 'Оплата', color: '#F59E0B', icon: 'wallet' },
                    { name: 'Помощь', color: '#EC4899', icon: 'help' }
                ],
                news: [
                    { badge: 'Важно', badgeColor: '#EF4444', title: 'Переезд офиса в новое здание', text: 'С 15 марта головной офис переезжает на ул. Ленина, 42. Подробности в разделе документов.', date: '04.03.2026', imgColor: 'linear-gradient(135deg, #3B82F6, #6366F1)' },
                    { badge: 'HR', badgeColor: '#10B981', title: 'Открыт набор в команду разработки', text: 'Ищем frontend и backend разработчиков. Реферальный бонус - 50 000 ₽.', date: '03.03.2026', imgColor: 'linear-gradient(135deg, #10B981, #14B8A6)' },
                    { badge: 'Событие', badgeColor: '#F59E0B', title: 'Корпоратив в честь 5 лет GERS', text: 'Празднуем юбилей компании 20 марта. Регистрация через приложение.', date: '02.03.2026', imgColor: 'linear-gradient(135deg, #F59E0B, #EF4444)' }
                ],
                chats: [
                    { name: 'Анна Иванова', msg: 'Документы подписаны, жду от вас', time: '10:24', avatar: 'АИ', color: '#EC4899', unread: 2 },
                    { name: 'IT-поддержка', msg: 'Ваша заявка #1847 решена', time: '09:15', avatar: 'IT', color: '#3B82F6', unread: 0 },
                    { name: 'Общий чат', msg: 'Дмитрий: Всем доброе утро!', time: 'Вчера', avatar: 'ОЧ', color: '#10B981', unread: 14 },
                    { name: 'Бухгалтерия', msg: 'Зарплата зачислена', time: 'Вчера', avatar: 'БХ', color: '#F59E0B', unread: 0 }
                ]
            }
        };

        const preview = webPreviews[previewType];
        if (!preview) { this.updateGallery([]); return; }

        /* ── MOBILE PREVIEW RENDERING ── */
        if (preview.isMobile) {
            let mobileContent = '';
            let headerHTML = '';

            /* ──── 1. FITNESS - Apple Fitness+ style, dark neon ──── */
            if (previewType === 'mobile-fitness') {
                const gradients = [
                    'linear-gradient(135deg,#FF375F 0%,#FF6B81 50%,#FF375F 100%)',
                    'linear-gradient(135deg,#5E5CE6 0%,#BF5AF2 50%,#5E5CE6 100%)',
                    'linear-gradient(135deg,#30D158 0%,#63E6BE 50%,#30D158 100%)',
                    'linear-gradient(135deg,#FF9F0A 0%,#FFD60A 50%,#FF9F0A 100%)',
                    'linear-gradient(135deg,#64D2FF 0%,#0A84FF 50%,#64D2FF 100%)',
                    'linear-gradient(135deg,#FF375F 0%,#BF5AF2 50%,#FF375F 100%)'
                ];

                headerHTML = `
                    <div class="fit-hero">
                        <div class="fit-hero-greeting">Добрый вечер</div>
                        <div class="fit-hero-name">Алексей</div>
                        <div class="fit-hero-sub">Сегодня день ног - не пропусти</div>
                    </div>
                `;

                // Stats pills
                const statsHTML = `
                    <div class="fit-stats-row">
                        <div class="fit-stat-pill accent-red"><div class="fit-stat-value">680</div><div class="fit-stat-label">ккал</div></div>
                        <div class="fit-stat-pill accent-green"><div class="fit-stat-value">34</div><div class="fit-stat-label">мин</div></div>
                        <div class="fit-stat-pill accent-purple"><div class="fit-stat-value">12</div><div class="fit-stat-label">тренировок</div></div>
                    </div>
                `;

                // Activity rings (SVG)
                const rings = [
                    { pct: 85, color: '#FF375F', label: '680' },
                    { pct: 72, color: '#30D158', label: '34' },
                    { pct: 58, color: '#5E5CE6', label: '8' }
                ];
                const ringsHTML = rings.map((r, i) => {
                    const radius = 22 - i * 6;
                    const circ = 2 * Math.PI * radius;
                    const off = circ - (circ * r.pct / 100);
                    return `<div class="fit-ring-wrap">
                        <svg class="fit-ring-svg" viewBox="0 0 56 56">
                            <circle cx="28" cy="28" r="${radius}" class="fit-ring-bg" stroke="${r.color}"/>
                            <circle cx="28" cy="28" r="${radius}" class="fit-ring-fg" stroke="${r.color}" stroke-dasharray="${circ}" style="stroke-dashoffset:${off};animation-delay:${i*0.2}s"/>
                        </svg>
                        <div class="fit-ring-label">${r.label}</div>
                    </div>`;
                }).join('');

                const legendHTML = `<div class="fit-rings-legend">
                    <div class="fit-legend-item"><div class="fit-legend-dot" style="background:#FF375F;box-shadow:0 0 6px #FF375F"></div>Движ.<span class="fit-legend-val">680/800</span></div>
                    <div class="fit-legend-item"><div class="fit-legend-dot" style="background:#30D158;box-shadow:0 0 6px #30D158"></div>Упражн.<span class="fit-legend-val">34/45</span></div>
                    <div class="fit-legend-item"><div class="fit-legend-dot" style="background:#5E5CE6;box-shadow:0 0 6px #5E5CE6"></div>Стоя<span class="fit-legend-val">8/12 ч</span></div>
                </div>`;

                // Weekly chart
                const weekDays = ['ПН','ВТ','СР','ЧТ','ПТ','СБ','ВС'];
                const weekPcts = [65, 80, 45, 90, 70, 55, 85];
                const weekColors = ['#FF375F','#30D158','#5E5CE6','#FF375F','#BF5AF2','#30D158','#FF375F'];
                const weekHTML = weekDays.map((d,i) => `
                    <div class="fit-week-bar ${i===6?'today':''}" data-day="${d}" style="height:${weekPcts[i]}%;background:linear-gradient(180deg,${weekColors[i]},${weekColors[i]}88)"></div>
                `).join('');

                const trainersHTML = preview.trainers.map((t,i) => `
                    <div class="fit-trainer">
                        <div class="fit-trainer-avatar" style="background:${t.color};border-color:${t.color};box-shadow:0 0 12px ${t.color}44">${t.name.charAt(0)}</div>
                        <span class="fit-trainer-name">${t.name}</span>
                        <span class="fit-trainer-spec">${['Сила','Йога','Кардио','Бокс'][i] || ''}</span>
                    </div>
                `).join('');

                const workoutsHTML = preview.workouts.map((w,i) => `
                    <div class="fit-workout-card">
                        <div class="fit-workout-banner" style="background:${gradients[i % gradients.length]}">
                            <div class="fit-workout-banner-text">
                                <div class="fit-workout-name">${w.name}</div>
                                <div class="fit-workout-meta">${w.meta}</div>
                            </div>
                        </div>
                        <div class="fit-workout-bottom">
                            <div class="fit-workout-tags"><span class="fit-workout-tag">${w.icon.toUpperCase()}</span></div>
                            <div class="fit-workout-time">${w.time}</div>
                        </div>
                    </div>
                `).join('');

                const barsHTML = preview.progress.bars.map(b => `
                    <div class="fit-bar-row">
                        <span class="fit-bar-label">${b.label}</span>
                        <div class="fit-bar-track"><div class="fit-bar-fill" style="width:${b.pct}%;background:linear-gradient(90deg,${b.color},${b.color}aa);box-shadow:0 0 8px ${b.color}44"></div></div>
                        <span class="fit-bar-val">${b.pct}%</span>
                    </div>
                `).join('');

                mobileContent = `
                    ${statsHTML}
                    <div class="fit-rings-row">${ringsHTML}${legendHTML}</div>
                    <div class="fit-section"><div class="fit-section-title">Активность за неделю</div></div>
                    <div class="fit-week-chart">${weekHTML}</div>
                    <div class="fit-section" style="margin-top:20px"><div class="fit-section-title">Тренеры</div></div>
                    <div class="fit-trainer-row">${trainersHTML}</div>
                    <div class="fit-section"><div class="fit-section-title">Расписание</div></div>
                    <div class="fit-section">${workoutsHTML}</div>
                    <div class="fit-achievement" style="background:linear-gradient(135deg,rgba(255,55,95,0.15),rgba(191,90,242,0.1));border:1px solid rgba(255,55,95,0.15)">
                        <div class="fit-achieve-icon" style="background:linear-gradient(135deg,#FF375F,#BF5AF2)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 22V8a4 4 0 0 1 4 0v14"/><path d="M8 9h8"/><path d="M12 2v2"/></svg></div>
                        <div class="fit-achieve-text">
                            <div class="fit-achieve-title">Серия: 12 дней подряд!</div>
                            <div class="fit-achieve-sub">Ещё 3 дня до нового рекорда</div>
                        </div>
                    </div>
                    <div class="fit-section"><div class="fit-section-title">Прогресс за месяц</div></div>
                    <div class="fit-progress-card">
                        <div class="fit-progress-title">Группы мышц</div>
                        ${barsHTML}
                    </div>
                `;
            }

            /* ──── 2. TAXI - Uber / Yandex Go style, light + map ──── */
            if (previewType === 'mobile-taxi') {
                headerHTML = ''; // no separate header - map IS the header

                const classIconsSvg = [
                    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 17m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0"/><path d="M17 17m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0"/><path d="M5 17H3v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2"/><path d="M9 17h6"/><path d="M5 6l2-2h5l3 2"/></svg>',
                    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 17m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0"/><path d="M17 17m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0"/><path d="M5 17H3v-4a1 1 0 0 1 1-1h2l3-5h6l3 5h2a1 1 0 0 1 1 1v4h-2"/><path d="M9 17h6"/></svg>',
                    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 17m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0"/><path d="M17 17m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0"/><path d="M5 17H3v-4l2-6h10l4 6h2v4h-2"/><path d="M9 17h6"/><path d="M14 7l-4-3H6"/></svg>'
                ];
                const classesHTML = preview.rides.map((r,i) => `
                    <div class="taxi-class-pill ${i===0 ? 'active' : ''}">
                        <div class="taxi-class-icon">${classIconsSvg[i] || classIconsSvg[0]}</div>
                        <div class="taxi-class-name">${r.cls}</div>
                        <div class="taxi-class-price">${r.price}</div>
                        <div class="taxi-class-eta">${r.eta}</div>
                    </div>
                `).join('');

                const historyHTML = preview.history.map((h,i) => `
                    <div class="taxi-recent-item" style="animation-delay:${0.3+i*0.1}s">
                        <div class="taxi-recent-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
                        <div class="taxi-recent-text">
                            <div class="taxi-recent-route">${h.from} → ${h.to}</div>
                            <div class="taxi-recent-date">${h.date}</div>
                        </div>
                        <div class="taxi-recent-price">${h.price}</div>
                    </div>
                `).join('');

                mobileContent = `
                    <div class="taxi-map">
                        <div class="taxi-map-streets"></div>
                        <div class="taxi-map-buildings"></div>
                        <div class="taxi-map-water"></div>
                        <div class="taxi-map-park"></div>
                        <div class="taxi-map-park2"></div>
                        <div class="taxi-map-route-line"></div>
                        <div class="taxi-map-pin-a"></div>
                        <div class="taxi-map-pin-b"></div>
                        <div class="taxi-map-car-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg></div>
                        <div class="taxi-map-eta">
                            <div class="taxi-map-eta-dot"></div>
                            <div>
                                <div class="taxi-map-eta-text">2 мин</div>
                                <div class="taxi-map-eta-sub">до подачи</div>
                            </div>
                        </div>
                    </div>
                    <div class="taxi-sheet">
                        <div class="taxi-sheet-handle"></div>
                        <div class="taxi-where">
                            <div class="taxi-where-dots">
                                <div class="taxi-where-dot blue"></div>
                                <div class="taxi-where-line"></div>
                                <div class="taxi-where-dot dark"></div>
                            </div>
                            <div class="taxi-where-inputs">
                                <div class="taxi-where-input">${preview.from}</div>
                                <div class="taxi-where-input">${preview.to}</div>
                            </div>
                        </div>
                        <div class="taxi-promo" style="background:linear-gradient(135deg,#EFF6FF,#DBEAFE);border:1px solid #BFDBFE">
                            <div class="taxi-promo-icon" style="background:linear-gradient(135deg,#276EF1,#5B9BF7)"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>
                            <div class="taxi-promo-text">
                                <div class="taxi-promo-title">Скидка 20% на первую поездку</div>
                                <div class="taxi-promo-sub">Промокод GERS20 · до 15.03</div>
                            </div>
                        </div>
                        <div class="taxi-classes">${classesHTML}</div>
                        <div class="taxi-order-btn">Заказать · ${preview.rides[0].price}</div>
                        <div class="taxi-driver-info">
                            <div class="taxi-drv-photo">${preview.driver.name.charAt(0)}</div>
                            <div>
                                <div class="taxi-drv-name">${preview.driver.name}</div>
                                <div class="taxi-drv-car">${preview.driver.car}</div>
                            </div>
                            <div class="taxi-drv-rating"><svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>${preview.driver.rating}</div>
                        </div>
                        <div class="taxi-recent">
                            <div class="taxi-recent-title">Недавние поездки</div>
                            ${historyHTML}
                        </div>
                    </div>
                `;
            }

            /* ──── 3. CORPORATE - Teams/Slack style, indigo + white ──── */
            if (previewType === 'mobile-corporate') {
                const actionsIcons = {
                    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
                    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
                    wallet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
                    help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
                };

                headerHTML = `
                    <div class="corp-header">
                        <div class="corp-header-top">
                            <div class="corp-header-title">GERS Portal</div>
                            <div style="display:flex;gap:12px;align-items:center">
                                <div class="corp-header-notif">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                                    <div class="corp-header-notif-badge">3</div>
                                </div>
                                <div class="corp-header-avatar">АИ</div>
                            </div>
                        </div>
                        <div class="corp-search">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                            <span>Поиск по порталу...</span>
                        </div>
                    </div>
                `;

                // Stats row
                const corpStatsHTML = `
                    <div class="corp-stats-row">
                        <div class="corp-stat-card"><div class="corp-stat-value">2,048</div><div class="corp-stat-label">Сотрудники</div></div>
                        <div class="corp-stat-card"><div class="corp-stat-value" style="color:#10B981">12</div><div class="corp-stat-label">Заявки</div></div>
                        <div class="corp-stat-card"><div class="corp-stat-value" style="color:#EF4444">3</div><div class="corp-stat-label">Срочные</div></div>
                    </div>
                `;

                const teamColors = ['#4F46E5','#EC4899','#10B981','#F59E0B','#EF4444'];
                const teamNames = ['Анна И.','Дмитрий','Ольга К.','Михаил','Юлия'];
                const teamHTML = teamNames.map((n,i) => `
                    <div class="corp-team-person">
                        <div class="corp-team-ava" style="border-color:${teamColors[i]}">
                            <div class="corp-team-ava-inner" style="background:${teamColors[i]}">${n.charAt(0)}</div>
                        </div>
                        <div class="corp-team-name">${n}</div>
                    </div>
                `).join('');

                const actionsHTML = preview.quickActions.map(a => `
                    <div class="corp-quick-item">
                        <div class="corp-quick-icon" style="background:linear-gradient(135deg,${a.color},${a.color}cc)">${actionsIcons[a.icon] || actionsIcons.doc}</div>
                        <div class="corp-quick-label">${a.name}</div>
                    </div>
                `).join('');

                // Tasks
                const tasks = [
                    { name: 'Согласовать бюджет Q2', meta: 'Срок: сегодня', done: false, priority: 'Срочно', priColor: '#EF4444', borderColor: '#EF4444' },
                    { name: 'Отчёт по KPI за февраль', meta: 'Срок: 05.03.2026', done: false, priority: 'Важно', priColor: '#F59E0B', borderColor: '#F59E0B' },
                    { name: 'Оформить пропуск для гостей', meta: 'Выполнено вчера', done: true, priority: '', priColor: '', borderColor: '#10B981' }
                ];
                const tasksHTML = tasks.map((t,i) => `
                    <div class="corp-task-item" style="border-left-color:${t.borderColor};animation-delay:${0.1+i*0.08}s">
                        <div class="corp-task-check ${t.done ? 'done' : ''}"></div>
                        <div class="corp-task-info">
                            <div class="corp-task-name ${t.done ? 'done-text' : ''}">${t.name}</div>
                            <div class="corp-task-meta">${t.meta}</div>
                        </div>
                        ${t.priority ? `<div class="corp-task-priority" style="background:${t.priColor}18;color:${t.priColor}">${t.priority}</div>` : ''}
                    </div>
                `).join('');

                const newsHTML = preview.news.map((n,i) => `
                    <div class="corp-news-card" style="animation-delay:${0.1+i*0.1}s">
                        <div class="corp-news-img" style="background:${n.imgColor}">
                            <span class="corp-news-img-badge">${n.badge}</span>
                        </div>
                        <div class="corp-news-body">
                            <div class="corp-news-title">${n.title}</div>
                            <div class="corp-news-text">${n.text}</div>
                        </div>
                        <div class="corp-news-footer">
                            <span class="corp-news-date">${n.date}</span>
                            <span class="corp-news-likes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>${12 + i * 7}</span>
                        </div>
                    </div>
                `).join('');

                const msgsHTML = preview.chats.map(c => `
                    <div class="corp-msg-item">
                        <div class="corp-msg-ava" style="background:${c.color}">${c.avatar}${c.unread > 0 ? '<div class="corp-msg-online"></div>' : ''}</div>
                        <div class="corp-msg-info">
                            <div class="corp-msg-name">${c.name}</div>
                            <div class="corp-msg-text">${c.msg}</div>
                        </div>
                        <div class="corp-msg-right">
                            <span class="corp-msg-time">${c.time}</span>
                            ${c.unread > 0 ? `<div class="corp-msg-badge">${c.unread}</div>` : ''}
                        </div>
                    </div>
                `).join('');

                mobileContent = `
                    ${corpStatsHTML}
                    <div class="corp-team-row">${teamHTML}</div>
                    <div class="corp-quick-grid">${actionsHTML}</div>
                    <div class="corp-feed">
                        <div class="corp-feed-title">Мои задачи <span>Все →</span></div>
                    </div>
                    <div class="corp-tasks">${tasksHTML}</div>
                    <div class="corp-feed">
                        <div class="corp-feed-title">Новости <span>Все →</span></div>
                        ${newsHTML}
                        <div class="corp-feed-title">Сообщения <span>${preview.chats.reduce((a,c)=>a+c.unread,0)} новых</span></div>
                    </div>
                    <div class="corp-msgs">
                        <div class="corp-msg-card">${msgsHTML}</div>
                    </div>
                `;
            }

            /* Bottom nav icons per app */
            let bottomNavHTML = '';
            if (previewType === 'mobile-fitness') {
                bottomNavHTML = `
                    <div class="mobile-nav-item active"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg><span>Активность</span></div>
                    <div class="mobile-nav-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg><span>Запись</span></div>
                    <div class="mobile-nav-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg><span>Прогресс</span></div>
                    <div class="mobile-nav-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg><span>Профиль</span></div>
                `;
            } else if (previewType === 'mobile-taxi') {
                bottomNavHTML = `
                    <div class="mobile-nav-item active"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg><span>Поездка</span></div>
                    <div class="mobile-nav-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7M9 20l6-3M9 20V7m6 10l5.447 2.724A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-.553-.894L15 4M15 17V4M9 7l6-3"/></svg><span>Адреса</span></div>
                    <div class="mobile-nav-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg><span>Оплата</span></div>
                    <div class="mobile-nav-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg><span>Ещё</span></div>
                `;
            } else if (previewType === 'mobile-corporate') {
                bottomNavHTML = `
                    <div class="mobile-nav-item active"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg><span>Главная</span></div>
                    <div class="mobile-nav-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg><span>Документы</span></div>
                    <div class="mobile-nav-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span>Чат</span></div>
                    <div class="mobile-nav-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg><span>Команда</span></div>
                `;
            }

            mainImage.innerHTML = `
                <div class="mobile-preview-wrap">
                    <div class="mobile-phone ${preview.mobileTheme}">
                        <div class="mobile-phone-notch"></div>
                        <div class="mobile-status-bar">
                            <span class="status-time">19:01</span>
                            <span class="status-icons">
                                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>
                                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>
                            </span>
                        </div>
                        ${headerHTML}
                        <div class="mobile-app-content">${mobileContent}</div>
                        <div class="mobile-bottom-nav">${bottomNavHTML}</div>
                        <div class="mob-home-indicator"></div>
                    </div>
                </div>
            `;

            mainImage.style.aspectRatio = 'unset';
            mainImage.style.background = 'transparent';
            thumbnails.innerHTML = '';
            counter.textContent = 'Превью проекта';
            document.getElementById('galleryPrev').style.display = 'none';
            document.getElementById('galleryNext').style.display = 'none';
            document.getElementById('galleryFullscreen').style.display = 'none';
            return;
        }

        // Build sidebar
        const sidebarHTML = preview.sidebar.map(item => `
            <div class="web-sidebar-item ${item.active ? 'active' : ''}">
                ${item.icon}
                <span>${item.label}</span>
            </div>
        `).join('');

        // Build stats
        const statsHTML = preview.stats.map(s => `
            <div class="web-stat-card">
                <div class="web-stat-value" style="color:${s.color}">${s.value}</div>
                <div class="web-stat-label">${s.label}</div>
            </div>
        `).join('');

        // Build content area based on type
        let contentHTML = '';

        if (previewType === 'ai-support') {
            const convHTML = preview.conversations.map(c => {
                const statusClass = c.status === 'ai' ? 'status-ai' : c.status === 'operator' ? 'status-operator' : 'status-resolved';
                const statusText = c.status === 'ai' ? 'AI' : c.status === 'operator' ? 'Оператор' : 'Решено';
                return `<div class="web-conv-item ${c.unread ? 'unread' : ''}">
                    <div class="web-conv-avatar">${c.name.charAt(0)}</div>
                    <div class="web-conv-info">
                        <div class="web-conv-top">
                            <span class="web-conv-name">${c.name}</span>
                            <span class="web-conv-time">${c.time}</span>
                        </div>
                        <div class="web-conv-bottom">
                            <span class="web-conv-preview">${c.preview}</span>
                            <span class="web-conv-status ${statusClass}">${statusText}</span>
                        </div>
                    </div>
                </div>`;
            }).join('');

            const chatHTML = preview.chat.map(m => `
                <div class="web-chat-msg ${m.from}">
                    <div class="web-chat-bubble">${m.text.replace(/\n/g, '<br>')}</div>
                </div>
            `).join('');

            contentHTML = `
                <div class="web-content-split">
                    <div class="web-conv-list">
                        <div class="web-conv-search">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                            <span>Поиск диалогов...</span>
                        </div>
                        ${convHTML}
                    </div>
                    <div class="web-chat-area">
                        <div class="web-chat-top">
                            <div class="web-chat-top-avatar">А</div>
                            <div class="web-chat-top-info">
                                <span class="web-chat-top-name">Алексей М.</span>
                                <span class="web-chat-top-status">AI отвечает</span>
                            </div>
                            <span class="web-chat-top-badge status-ai">AI</span>
                        </div>
                        <div class="web-chat-messages">${chatHTML}</div>
                        <div class="web-chat-input">
                            <span>Ответ генерируется AI...</span>
                        </div>
                    </div>
                </div>`;
        }

        if (previewType === 'ai-content') {
            const g = preview.generatorForm;
            const seo = preview.seoScore;
            const recentHTML = preview.recentTexts.map(t => `
                <div class="web-recent-item">
                    <div class="web-recent-info">
                        <span class="web-recent-title">${t.title}</span>
                        <span class="web-recent-meta">${t.type} / ${t.date}</span>
                    </div>
                    <div class="web-recent-score" style="color:${t.score >= 93 ? '#4ADE80' : t.score >= 90 ? '#F59E0B' : '#60A5FA'}">${t.score}%</div>
                </div>
            `).join('');

            contentHTML = `
                <div class="web-content-cols">
                    <div class="web-generator-panel">
                        <div class="web-panel-title">Новый текст</div>
                        <div class="web-form-group">
                            <label>Тип контента</label>
                            <div class="web-form-select">${g.type}</div>
                        </div>
                        <div class="web-form-group">
                            <label>Товар / тема</label>
                            <div class="web-form-input">${g.product}</div>
                        </div>
                        <div class="web-form-row">
                            <div class="web-form-group half">
                                <label>Тон</label>
                                <div class="web-form-select">${g.tone}</div>
                            </div>
                            <div class="web-form-group half">
                                <label>Длина</label>
                                <div class="web-form-select">${g.length}</div>
                            </div>
                        </div>
                        <div class="web-form-btn">Сгенерировать</div>
                        <div class="web-panel-title" style="margin-top:16px">Последние</div>
                        ${recentHTML}
                    </div>
                    <div class="web-result-panel">
                        <div class="web-panel-title">Результат</div>
                        <div class="web-generated-text">${preview.generatedText.replace(/\n/g, '<br>')}</div>
                        <div class="web-seo-bar">
                            <div class="web-seo-title">SEO-анализ</div>
                            <div class="web-seo-scores">
                                <div class="web-seo-item">
                                    <span>Общий</span>
                                    <div class="web-seo-progress"><div class="web-seo-fill" style="width:${seo.total}%;background:#4ADE80"></div></div>
                                    <span class="web-seo-val">${seo.total}%</span>
                                </div>
                                <div class="web-seo-item">
                                    <span>Читаемость</span>
                                    <div class="web-seo-progress"><div class="web-seo-fill" style="width:${seo.readability}%;background:#5B7CF7"></div></div>
                                    <span class="web-seo-val">${seo.readability}%</span>
                                </div>
                                <div class="web-seo-item">
                                    <span>Ключевые</span>
                                    <div class="web-seo-progress"><div class="web-seo-fill" style="width:${seo.keywords}%;background:#F59E0B"></div></div>
                                    <span class="web-seo-val">${seo.keywords}%</span>
                                </div>
                                <div class="web-seo-item">
                                    <span>Уникальность</span>
                                    <div class="web-seo-progress"><div class="web-seo-fill" style="width:${seo.uniqueness}%;background:#C084FC"></div></div>
                                    <span class="web-seo-val">${seo.uniqueness}%</span>
                                </div>
                            </div>
                        </div>
                        <div class="web-result-actions">
                            <span class="web-action-btn">Копировать</span>
                            <span class="web-action-btn">Скачать</span>
                            <span class="web-action-btn">Перегенерировать</span>
                        </div>
                    </div>
                </div>`;
        }

        if (previewType === 'marketplace-services') {
            const catTabsHTML = preview.categories.map((c, i) => `
                <div class="mp-cat-tab ${i === 0 ? 'active' : ''}">
                    <span class="mp-cat-icon">${c.icon}</span>
                    <span class="mp-cat-name">${c.name}</span>
                    <span class="mp-cat-count">${c.count}</span>
                </div>
            `).join('');

            const listingsHTML = preview.listings.map((l, i) => {
                const stars = Math.floor(l.rating);
                const starsHTML = Array(5).fill(0).map((_, si) => `<span class="mp-star ${si < stars ? 'filled' : ''}">★</span>`).join('');
                const colors = ['#5B7CF7', '#4ADE80', '#F59E0B', '#C084FC', '#60A5FA', '#EC4899', '#EF4444', '#14B8A6'];
                const bgColor = colors[i % colors.length];
                return `<div class="mp-listing-card">
                    <div class="mp-listing-img" style="background:${bgColor}15;border:1px solid ${bgColor}30">
                        <svg viewBox="0 0 24 24" fill="none" stroke="${bgColor}" stroke-width="1.2" style="width:28px;height:28px;opacity:0.7"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
                        ${l.verified ? '<span class="mp-listing-verified" title="Проверен"><svg viewBox="0 0 24 24" fill="#4ADE80" stroke="#fff" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span>' : ''}
                    </div>
                    <div class="mp-listing-body">
                        <div class="mp-listing-title">${l.title}</div>
                        <div class="mp-listing-price">${l.price}</div>
                        <div class="mp-listing-meta">
                            <span class="mp-listing-master">${l.master}</span>
                            ${l.online ? '<span class="mp-listing-online">online</span>' : ''}
                        </div>
                        <div class="mp-listing-bottom">
                            <span class="mp-listing-stars">${starsHTML} <span class="mp-listing-rating">${l.rating}</span> <span class="mp-listing-reviews">(${l.reviews})</span></span>
                            <span class="mp-listing-location"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:11px;height:11px"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>${l.city}</span>
                        </div>
                        <div class="mp-listing-time">${l.time}</div>
                    </div>
                </div>`;
            }).join('');

            const f = preview.filters;
            contentHTML = `
                <div class="mp-board">
                    <div class="mp-search-bar">
                        <div class="mp-search-input">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                            <span>Поиск услуг, мастеров...</span>
                        </div>
                        <div class="mp-search-location">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            <span>Москва</span>
                        </div>
                        <div class="mp-search-btn">Найти</div>
                    </div>
                    <div class="mp-categories-row">${catTabsHTML}</div>
                    <div class="mp-content-area">
                        <div class="mp-filters-panel">
                            <div class="mp-filter-title">Фильтры</div>
                            <div class="mp-filter-group">
                                <label>Цена, Р</label>
                                <div class="mp-filter-range">
                                    <span class="mp-filter-input">от ${f.priceFrom}</span>
                                    <span class="mp-filter-dash">-</span>
                                    <span class="mp-filter-input">до ${f.priceTo}</span>
                                </div>
                            </div>
                            <div class="mp-filter-group">
                                <label>Сортировка</label>
                                <div class="mp-filter-select">${f.sortBy}</div>
                            </div>
                            <div class="mp-filter-group">
                                <div class="mp-filter-check ${f.onlyVerified ? 'checked' : ''}">
                                    <span class="mp-check-box"></span>
                                    <span>Только проверенные</span>
                                </div>
                                <div class="mp-filter-check ${f.onlyOnline ? 'checked' : ''}">
                                    <span class="mp-check-box"></span>
                                    <span>Сейчас онлайн</span>
                                </div>
                            </div>
                            <div class="mp-filter-apply">Применить</div>
                            <div class="mp-filter-reset">Сбросить</div>
                        </div>
                        <div class="mp-listings-grid">${listingsHTML}</div>
                    </div>
                </div>`;
        }

        if (previewType === 'integration-1c') {
            const productsHTML = preview.products.map(p => {
                const iconClass = p.status === 'synced' ? 'ok' : 'warn';
                const iconSvg = p.status === 'synced'
                    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>'
                    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
                const stockClass = p.stock === 0 ? 'zero' : p.stock <= 5 ? 'low' : 'ok';
                return `<div class="intg-row">
                    <div class="intg-row-icon ${iconClass}">${iconSvg}</div>
                    <div class="intg-row-body">
                        <div class="intg-row-code">${p.code}</div>
                        <div class="intg-row-name">${p.name}</div>
                    </div>
                    <div class="intg-row-right">
                        <span class="intg-price">${p.price} &#8381;</span>
                        <span class="intg-stock ${stockClass}">${p.stock} шт.</span>
                        <span class="intg-time">${p.updated}</span>
                    </div>
                </div>`;
            }).join('');

            const logHTML = preview.syncLog.map(l => {
                const iconClass = l.type === 'success' ? 'ok' : l.type === 'warning' ? 'warn' : 'info';
                const iconSvg = l.type === 'success'
                    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>'
                    : l.type === 'warning'
                    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
                    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>';
                return `<div class="intg-log">
                    <span class="intg-log-time">${l.time}</span>
                    <div class="intg-row-icon ${iconClass}">${iconSvg}</div>
                    <div class="intg-log-body">
                        <div class="intg-log-event">${l.event}</div>
                        <div class="intg-log-details">${l.details}</div>
                    </div>
                </div>`;
            }).join('');

            contentHTML = `
                <div class="web-content-split">
                    <div class="web-doc-list" style="flex:1.3">
                        <div class="intg-section-header">
                            <span class="intg-section-title">Товары - Синхронизация</span>
                            <span class="intg-section-badge"><span class="intg-live-dot"></span>Онлайн</span>
                        </div>
                        <div class="intg-scroll-area">${productsHTML}</div>
                    </div>
                    <div class="web-doc-detail" style="flex:0.7">
                        <div class="intg-section-header">
                            <span class="intg-section-title">Журнал</span>
                        </div>
                        <div class="intg-scroll-area">${logHTML}</div>
                    </div>
                </div>`;
        }

        if (previewType === 'integration-acquiring') {
            const txnHTML = preview.transactions.map(t => {
                const statusClass = t.status === 'success' ? 'success' : t.status === 'refunded' ? 'refunded' : 'pending';
                const statusText = t.status === 'success' ? 'Успешно' : t.status === 'refunded' ? 'Возврат' : 'Обработка';
                return `<div class="intg-txn">
                    <span class="intg-txn-id">${t.id}</span>
                    <span class="intg-txn-method">${t.method} <span class="intg-txn-card">${t.card}</span></span>
                    <span class="intg-txn-amount">${t.amount} &#8381;</span>
                    <span class="intg-txn-badge ${statusClass}">${statusText}</span>
                    <span class="intg-txn-time">${t.time}</span>
                </div>`;
            }).join('');

            const methodsHTML = preview.paymentMethods.map(m => `
                <div class="intg-method">
                    <div class="intg-method-icon" style="background:${m.color}15;border:1px solid ${m.color}30">
                        <svg viewBox="0 0 24 24" fill="none" stroke="${m.color}" stroke-width="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                    </div>
                    <div class="intg-method-info">
                        <div class="intg-method-name">${m.name}</div>
                        <div class="intg-method-amount">${m.amount} руб.</div>
                    </div>
                    <div class="intg-method-right">
                        <div class="intg-method-share" style="color:${m.color}">${m.share}%</div>
                        <div class="intg-method-bar"><div class="intg-method-fill" style="width:${m.share}%;background:${m.color}"></div></div>
                    </div>
                </div>
            `).join('');

            contentHTML = `
                <div class="web-content-split">
                    <div class="web-doc-list" style="flex:1.3">
                        <div class="intg-section-header">
                            <span class="intg-section-title">Транзакции</span>
                            <span class="intg-section-badge"><span class="intg-live-dot"></span>247 сегодня</span>
                        </div>
                        <div class="intg-scroll-area">${txnHTML}</div>
                    </div>
                    <div class="web-doc-detail" style="flex:0.7">
                        <div class="intg-section-header">
                            <span class="intg-section-title">Платёжные системы</span>
                        </div>
                        <div class="intg-scroll-area">${methodsHTML}</div>
                        <div class="intg-revenue">
                            <div class="intg-revenue-label">Выручка сегодня</div>
                            <div class="intg-revenue-value">287 430 &#8381;</div>
                        </div>
                    </div>
                </div>`;
        }

        if (previewType === 'integration-crm') {
            const pipelineHTML = preview.pipeline.map(p => `
                <div class="intg-stage" style="background:${p.color}0a;border:1px solid ${p.color}20">
                    <div class="intg-stage-name">${p.stage}</div>
                    <div class="intg-stage-count" style="color:${p.color}">${p.count}</div>
                    ${p.leads.map(l => `<div class="intg-stage-lead">${l}</div>`).join('')}
                </div>
            `).join('');

            const leadsHTML = preview.recentLeads.map(l => `
                <div class="intg-lead">
                    <div class="intg-lead-avatar">${l.name.charAt(0)}</div>
                    <div class="intg-lead-body">
                        <div class="intg-lead-top">
                            <span class="intg-lead-name">${l.name}</span>
                            <span class="intg-lead-time">${l.time}</span>
                        </div>
                        <div class="intg-lead-company">${l.company}</div>
                        <div class="intg-lead-tags">
                            <span class="intg-lead-tag source">${l.source}</span>
                            <span class="intg-lead-tag stage">${l.stage}</span>
                        </div>
                        <div class="intg-lead-phone">${l.phone}</div>
                    </div>
                </div>
            `).join('');

            contentHTML = `
                <div style="display:flex;flex-direction:column;gap:14px">
                    <div>
                        <div class="intg-section-title" style="margin-bottom:8px;padding:0 4px">Воронка продаж</div>
                        <div class="intg-pipeline">${pipelineHTML}</div>
                    </div>
                    <div class="web-content-split" style="margin-top:0">
                        <div class="web-doc-list" style="flex:1">
                            <div class="intg-section-header">
                                <span class="intg-section-title">Последние лиды</span>
                                <span class="intg-section-badge"><span class="intg-live-dot"></span>Все с сайта</span>
                            </div>
                            <div class="intg-scroll-area">${leadsHTML}</div>
                        </div>
                    </div>
                </div>`;
        }

        if (previewType === 'ai-docs') {
            const docsHTML = preview.documents.map(d => {
                const statusIcon = d.status === 'done' 
                    ? '<svg viewBox="0 0 24 24" fill="none" stroke="#4ADE80" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>'
                    : '<div class="web-doc-spinner"></div>';
                return `<div class="web-doc-item">
                    <div class="web-doc-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <div class="web-doc-info">
                        <span class="web-doc-name">${d.name}</span>
                        <span class="web-doc-meta">${d.type} / ${d.date}${d.fields ? ' / ' + d.fields + ' полей' : ''}</span>
                    </div>
                    <div class="web-doc-status">${statusIcon}</div>
                </div>`;
            }).join('');

            const fieldsHTML = preview.extractedData.fields.map(f => `
                <div class="web-field-row">
                    <span class="web-field-label">${f.label}</span>
                    <span class="web-field-value">${f.value}</span>
                </div>
            `).join('');

            contentHTML = `
                <div class="web-content-split">
                    <div class="web-doc-list">
                        <div class="web-doc-upload">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                            <span>Загрузить документ</span>
                        </div>
                        ${docsHTML}
                    </div>
                    <div class="web-doc-detail">
                        <div class="web-doc-detail-header">
                            <div class="web-panel-title">${preview.extractedData.docName}</div>
                            <span class="web-doc-detail-badge">Распознано</span>
                        </div>
                        <div class="web-doc-fields">${fieldsHTML}</div>
                        <div class="web-result-actions">
                            <span class="web-action-btn">В 1С</span>
                            <span class="web-action-btn">Excel</span>
                            <span class="web-action-btn">JSON</span>
                            <span class="web-action-btn">Редактировать</span>
                        </div>
                    </div>
                </div>`;
        }

        const themeMap = { 'ai-support': 'theme-ai-chat', 'ai-content': 'theme-ai-gen', 'ai-docs': 'theme-ai-scan', 'marketplace-services': 'theme-marketplace', 'integration-1c': 'theme-gers-1c', 'integration-acquiring': 'theme-gers-pay', 'integration-crm': 'theme-gers-crm' };
        const themeClass = themeMap[previewType] || 'theme-light';

        mainImage.innerHTML = `
            <div class="web-app-preview ${themeClass}">
                <div class="web-app-topbar">
                    <div class="web-app-logo">
                        <span class="web-app-logo-icon">G</span>
                        <span class="web-app-logo-text">${preview.title}</span>
                    </div>
                    <div class="web-app-topbar-right">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                        <div class="web-app-user">
                            <span>Admin</span>
                            <div class="web-app-user-avatar">A</div>
                        </div>
                    </div>
                </div>
                <div class="web-app-body">
                    <div class="web-app-sidebar">${sidebarHTML}</div>
                    <div class="web-app-main">
                        <div class="web-app-stats">${statsHTML}</div>
                        ${contentHTML}
                    </div>
                </div>
            </div>
        `;

        mainImage.style.aspectRatio = 'unset';
        mainImage.style.background = 'transparent';

        thumbnails.innerHTML = '';
        counter.textContent = 'Превью проекта';
        document.getElementById('galleryPrev').style.display = 'none';
        document.getElementById('galleryNext').style.display = 'none';
        document.getElementById('galleryFullscreen').style.display = 'none';
    }
    
    updateGallery(screenshots) {
        this.screenshots = screenshots;
        this.currentIndex = 0;
        
        const mainImage = document.getElementById('modalMainImage');
        const thumbnails = document.getElementById('modalThumbnails');
        const counter = document.getElementById('galleryCounter');
        
        // Restore gallery nav and styles (might be changed by bot preview)
        document.getElementById('galleryPrev').style.display = '';
        document.getElementById('galleryNext').style.display = '';
        document.getElementById('galleryFullscreen').style.display = '';
        mainImage.style.aspectRatio = '';
        mainImage.style.maxHeight = '';
        mainImage.style.background = '';
        
        if (screenshots.length > 0) {
            this.showImage(0);
            counter.textContent = `1 / ${screenshots.length}`;
            
            thumbnails.innerHTML = screenshots.map((src, i) => `
                <div class="project-modal-thumb ${i === 0 ? 'active' : ''}" data-index="${i}">
                    <img src="${src}" alt="Экран ${i + 1}">
                </div>
            `).join('');
            
            thumbnails.querySelectorAll('.project-modal-thumb').forEach(thumb => {
                thumb.addEventListener('click', () => {
                    const index = parseInt(thumb.dataset.index);
                    this.goToImage(index);
                });
            });
        } else {
            mainImage.innerHTML = `
                <div class="project-modal-main-image-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21,15 16,10 5,21"/>
                    </svg>
                    <span>Скриншот проекта</span>
                </div>
            `;
            thumbnails.innerHTML = `
                <div class="project-modal-thumb active">Экран 1</div>
                <div class="project-modal-thumb">Экран 2</div>
                <div class="project-modal-thumb">Экран 3</div>
                <div class="project-modal-thumb">Экран 4</div>
            `;
            counter.textContent = '1 / 4';
        }
    }
    
    showImage(index) {
        const mainImage = document.getElementById('modalMainImage');
        const img = mainImage.querySelector('.modal-main-img');
        
        if (img) {
            img.classList.add('fade-out');
            setTimeout(() => {
                img.src = this.screenshots[index];
                img.classList.remove('fade-out');
            }, 150);
        } else {
            mainImage.innerHTML = `<img src="${this.screenshots[index]}" alt="Скриншот проекта" class="modal-main-img">`;
        }
        
        // Update counter
        document.getElementById('galleryCounter').textContent = `${index + 1} / ${this.screenshots.length}`;
        if (this.isFullscreen) {
            document.getElementById('fullscreenCounter').textContent = `${index + 1} / ${this.screenshots.length}`;
            document.getElementById('fullscreenImage').innerHTML = `<img src="${this.screenshots[index]}" alt="Скриншот">`;
        }
        
        // Update thumbnails
        document.querySelectorAll('.project-modal-thumb').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }
    
    goToImage(index) {
        if (index < 0 || index >= this.screenshots.length) return;
        this.currentIndex = index;
        this.showImage(index);
    }
    
    prevImage() {
        if (this.screenshots.length === 0) return;
        this.currentIndex = (this.currentIndex - 1 + this.screenshots.length) % this.screenshots.length;
        this.showImage(this.currentIndex);
    }
    
    nextImage() {
        if (this.screenshots.length === 0) return;
        this.currentIndex = (this.currentIndex + 1) % this.screenshots.length;
        this.showImage(this.currentIndex);
    }
    
    openFullscreen() {
        if (this.screenshots.length === 0) return;
        this.isFullscreen = true;
        this.fullscreenViewer.classList.add('visible');
        document.getElementById('fullscreenImage').innerHTML = `<img src="${this.screenshots[this.currentIndex]}" alt="Скриншот">`;
        document.getElementById('fullscreenCounter').textContent = `${this.currentIndex + 1} / ${this.screenshots.length}`;
    }
    
    closeFullscreen() {
        this.isFullscreen = false;
        this.fullscreenViewer?.classList.remove('visible');
    }
    
}

// ═══════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    // Start preloader first
    new Preloader();
    
    // Safe init helper - prevents one broken module from crashing the rest
    function safeInit(name, factory) {
        try { factory(); } catch(e) { console.warn('[GERS] ' + name + ' failed:', e.message); }
    }
    
    // Wait for preloader to complete before initializing other components
    window.addEventListener('preloaderComplete', () => {
        safeInit('GridCanvas',          () => new GridCanvas());
        safeInit('TechMeta',            () => new TechMeta());
        safeInit('CounterAnimation',    () => new CounterAnimation());
        safeInit('ScrollReveal',        () => new ScrollReveal());
        safeInit('ManifestoReveal',     () => new ManifestoReveal());
        safeInit('MetricProgress',      () => new MetricProgress());
        safeInit('MagneticElements',    () => new MagneticElements());
        safeInit('SmoothScroll',        () => new SmoothScroll());
        safeInit('CardTilt',            () => new CardTilt());
        safeInit('GlitchEffect',        () => new GlitchEffect());
        safeInit('ParallaxEffect',      () => new ParallaxEffect());
        safeInit('TypeWriter',          () => new TypeWriter());
        safeInit('FormEffects',         () => new FormEffects());
        safeInit('ScrollProgress',      () => new ScrollProgress());
        safeInit('FloatingCTA',         () => new FloatingCTA());
        safeInit('ThemeToggle',         () => new ThemeToggle());
        safeInit('LeadMagnetPopup',     () => new LeadMagnetPopup());
        safeInit('SoundEffects',        () => new SoundEffects());
        safeInit('WebNetwork',          () => new WebNetwork());
        safeInit('TestimonialsSlider',  () => new TestimonialsSlider());
        safeInit('CostCalculator',      () => new CostCalculator());
        safeInit('FAQAccordion',        () => new FAQAccordion());
        safeInit('LiveChat',            () => new LiveChat());
        safeInit('ProjectModal',        () => new ProjectModal());

        /* ── Mobile nav burger toggle ── */
        const navBurger = document.getElementById('navBurger');
        const navMenu = document.querySelector('.nav');
        if (navBurger && navMenu) {
            /* -- Nav links are clean (no numbers/arrows) -- */

            /* -- Add logo at top -- */
            if (!navMenu.querySelector('.mob-nav-logo')) {
                navMenu.insertAdjacentHTML('afterbegin',
                    `<div class="mob-nav-logo"><a href="/"><img src="assets/gers-logo-pink.png" alt="GERS"></a></div>`);
            }

            /* -- Add bottom section (Telegram) -- */
            if (!navMenu.querySelector('.mob-nav-bottom')) {
                navMenu.insertAdjacentHTML('beforeend', `
                    <div class="mob-nav-bottom">
                        <a href="https://t.me/gers_agent" target="_blank" class="mob-nav-tg">
                            <svg viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.57 8.15l-1.84 8.66c-.14.62-.5.77-1.01.48l-2.8-2.06-1.35 1.3c-.15.15-.28.28-.57.28l.2-2.85 5.18-4.68c.23-.2-.05-.31-.35-.12L8.69 13.2l-2.74-.86c-.6-.18-.61-.6.12-.88l10.7-4.12c.5-.18.93.12.77.88l.03-.07z"/></svg>
                            <span>Написать в Telegram</span>
                        </a>
                    </div>
                `);
            }

            /* -- Create dark overlay -- */
            let overlay = document.querySelector('.mob-nav-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'mob-nav-overlay';
                document.body.appendChild(overlay);
            }

            function openNav() {
                navMenu.classList.add('open');
                navBurger.classList.add('active');
                overlay.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
            function closeNav() {
                navMenu.classList.remove('open');
                navBurger.classList.remove('active');
                overlay.classList.remove('open');
                document.body.style.overflow = '';
            }

            /* -- Toggle menu -- */
            navBurger.addEventListener('click', () => {
                navMenu.classList.contains('open') ? closeNav() : openNav();
            });

            /* -- Close on link click -- */
            navMenu.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => closeNav());
            });

            /* -- Close on overlay click -- */
            overlay.addEventListener('click', () => closeNav());
        }
        
        console.log('%c[GERS] System initialized', 'color: #1a1a1a; font-family: monospace;');
        console.log('%c[GERS] All modules loaded', 'color: #1a1a1a; font-family: monospace;');
    });
});
