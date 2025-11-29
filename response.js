// response.js - Anna Laura AI visual & interaction script (final)
class AIVisualEffects {
    constructor() {
        this.init();
    }

    init() {
        this.createParticles();
        this.initScrollAnimations();
        this.initButtonEffects();
        this.initCounterAnimation();
        this.initInteractiveBackground();
        this.initFloatingElements();
        this.initContactForm();
    }

    // Floating Particles DOM generator (small DOM particles are decorative — heavy visuals use CSS background)
    createParticles() {
        const particlesContainer = document.querySelector('.floating-particles');
        if (!particlesContainer) return;
        const particleCount = 40;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 3 + 1;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const delay = Math.random() * 20;
            const duration = Math.random() * 15 + 10;
            const opacity = Math.random() * 0.4 + 0.05;

            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(255,255,255,${opacity});
                border-radius: 50%;
                left: ${posX}%;
                top: ${posY}%;
                animation: floatParticle ${duration}s ease-in-out ${delay}s infinite;
                filter: blur(${Math.random()*1}px);
                pointer-events: none;
                transform: translate3d(0,0,0);
            `;

            particlesContainer.appendChild(particle);
        }
        this.addParticleAnimationStyle();
    }

    addParticleAnimationStyle() {
        if (document.querySelector('#particle-anim-style')) return;
        const style = document.createElement('style');
        style.id = 'particle-anim-style';
        style.textContent = `
            @keyframes floatParticle {
                0%,100% { transform: translate3d(0,0,0) rotate(0deg); opacity: 0.35; }
                25% { transform: translate3d(60px,-30px,0) rotate(90deg); opacity: 0.7; }
                50% { transform: translate3d(30px,-60px,0) rotate(180deg); opacity: 0.45; }
                75% { transform: translate3d(-30px,-30px,0) rotate(270deg); opacity: 0.8; }
            }
            @keyframes ripple { to { transform: scale(4); opacity: 0; } }
        `;
        document.head.appendChild(style);
    }

    // Floating neuron animations - uses existing CSS delays (no heavy JS)
    initFloatingElements() {
        const neurons = document.querySelectorAll('.neuron');
        neurons.forEach((neuron, index) => {
            neuron.style.animationDelay = `${index * 0.4}s`;
        });
    }

    // Intersection & scroll
    initScrollAnimations() {
        const observerOptions = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    if (entry.target.classList.contains('features')) {
                        // handled in animateFeatureCards (if needed)
                    }
                }
            });
        }, observerOptions);

        document.querySelectorAll('.feature-card, .stat-item, .package-box, .hero-content, .lead').forEach(el => {
            observer.observe(el);
        });

        window.addEventListener('scroll', this.handleParallax.bind(this));
    }

    handleParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.background-effects, .orb');
        parallaxElements.forEach((el, index) => {
            const speed = 0.15 + (index * 0.05);
            const yPos = -(scrolled * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    }

    // Button effects + special demo explosion
    initButtonEffects() {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', this.createRipple.bind(this));
            button.addEventListener('click', this.createClickEffect.bind(this));
        });

        const exploreBtn = document.getElementById('exploreBtn');
        if (exploreBtn) exploreBtn.addEventListener('click', this.exploreEffect.bind(this));
        const learnBtn = document.getElementById('learnBtn');
        if (learnBtn) learnBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const about = document.querySelector('#about');
            if (about) about.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    createRipple(e) {
        const button = e.currentTarget;
        // ensure ripple container style
        button.style.position = button.style.position || getComputedStyle(button).position;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255,255,255,0.12);
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 9999;
        `;
        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 650);
    }

    createClickEffect(e) {
        // small particle burst inside the button
        const button = e.currentTarget;
        const particles = 8;
        for (let i = 0; i < particles; i++) {
            const p = document.createElement('div');
            p.className = 'btn-particle';
            p.style.cssText = `
                position: absolute; width:6px; height:6px; border-radius:50%;
                background: rgba(255,255,255,0.9); left:50%; top:50%;
                transform: translate(-50%,-50%); pointer-events:none; z-index:9999;
            `;
            button.appendChild(p);
            const angle = (i / particles) * Math.PI * 2;
            const dx = Math.cos(angle) * (30 + Math.random()*20);
            const dy = Math.sin(angle) * (30 + Math.random()*20);
            p.animate([
                { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
                { transform: `translate(${dx}px, ${dy}px) scale(0.3)`, opacity: 0 }
            ], { duration: 600 + Math.random()*200, easing: 'cubic-bezier(.2,.8,.2,1)' })
            .onfinish = () => p.remove();
        }
    }

    exploreEffect(e) {
        // gentle expand effect, then follow link
        if (!e.currentTarget.href) return;
        e.preventDefault();

        const explosion = document.createElement('div');
        explosion.style.cssText = `
            position: fixed; top:50%; left:50%; width:120px; height:120px;
            background: radial-gradient(circle, rgba(255,255,255,0.85), transparent 60%);
            border-radius:50%; transform: translate(-50%,-50%) scale(0); z-index:10000; pointer-events:none;
        `;
        document.body.appendChild(explosion);

        if (!document.querySelector('#explore-style')) {
            const s = document.createElement('style'); s.id = 'explore-style';
            s.textContent = `
                @keyframes exploreExpand {
                    0% { transform: translate(-50%,-50%) scale(0); opacity:1; }
                    100% { transform: translate(-50%,-50%) scale(25); opacity:0; }
                }
            `;
            document.head.appendChild(s);
        }

        explosion.style.animation = 'exploreExpand 0.8s ease-out forwards';
        setTimeout(() => {
            explosion.remove();
            window.location.href = e.currentTarget.href;
        }, 820);
    }

    // Counters
    initCounterAnimation() {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounters();
                    obs.disconnect();
                }
            });
        }, { threshold: 0.25 });

        const statsSection = document.querySelector('.stats');
        if (statsSection) observer.observe(statsSection);
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target')) || 0;
            const duration = 1600;
            const stepTime = Math.max(16, Math.floor(duration / Math.max(target,1)));
            let current = 0;
            const increment = Math.max(1, Math.floor(target / (duration / stepTime)));
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current);
                }
            }, stepTime);
        });
    }

    // Interactive background reacts to mouse (non cumulative transforms)
    initInteractiveBackground() {
        this.lastMouse = { x: 0, y: 0 };
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    }

    handleMouseMove(e) {
        const mouseX = (e.clientX / window.innerWidth) - 0.5;
        const mouseY = (e.clientY / window.innerHeight) - 0.5;

        const orbs = document.querySelectorAll('.orb');
        orbs.forEach((orb, index) => {
            const strength = 18 + (index * 6);
            const x = (mouseX * strength);
            const y = (mouseY * strength);
            orb.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });

        // subtle move for DOM particles (not the CSS background)
        const particles = document.querySelectorAll('.floating-particles .particle');
        particles.forEach((particle, idx) => {
            const speed = (idx % 3) * 0.6;
            const x = mouseX * speed * 12;
            const y = mouseY * speed * 12;
            particle.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });
    }

    // Simple contact form handling (no real backend) — provides UX feedback
    initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const submit = form.querySelector('button[type="submit"]');
            const origText = submit.textContent;
            submit.disabled = true;
            submit.textContent = 'Sending...';

            // simulate sending
            setTimeout(() => {
                submit.disabled = false;
                submit.textContent = 'Sent ✓';
                form.reset();
                setTimeout(() => submit.textContent = origText, 1800);
            }, 900);
        });
    }
}

// attach additional styles from original responses (if not already present)
(function addExtraStyles(){
    if (document.querySelector('#al-extra-styles')) return;
    const style = document.createElement('style');
    style.id = 'al-extra-styles';
    style.textContent = `
        .feature-card, .package-box { opacity: 0; transform: translateY(30px); transition: all 0.6s ease; }
        .feature-card.animate-in, .package-box.animate-in { opacity: 1; transform: translateY(0); }
        .stat-item { opacity: 0; transform: translateY(20px); }
        .stat-item.animate-in { opacity: 1; transform: translateY(0); }
    `;
    document.head.appendChild(style);
})();

document.addEventListener('DOMContentLoaded', () => {
    new AIVisualEffects();
    // reveal animated elements gracefully
    setTimeout(() => {
        document.querySelectorAll('.feature-card, .package-box, .stat-item').forEach((el, i) => {
            setTimeout(()=> el.classList.add('animate-in'), i * 80);
        });
    }, 300);
    console.log("Anna Laura AI — visual script initialized");
});
