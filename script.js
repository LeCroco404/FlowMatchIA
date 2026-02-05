// ============================================
// SMOOTH SCROLL
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');

        // Si le lien est juste "#", ne rien faire
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            // Fermer le menu mobile si ouvert
            const nav = document.getElementById('nav');
            const menuToggle = document.getElementById('menuToggle');
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
            }

            // Scroll vers l'élément
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// HEADER SCROLL EFFECT
// ============================================

const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Ajouter une classe 'scrolled' quand on scroll
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ============================================
// MOBILE MENU TOGGLE
// ============================================

const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    nav.classList.toggle('active');
});

// Fermer le menu si on clique en dehors
document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
    }
});

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optionnel : arrêter d'observer après l'animation
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observer toutes les sections avec la classe 'section-fade'
document.querySelectorAll('.section-fade').forEach(section => {
    observer.observe(section);
});

// Observer les cartes individuellement pour un effet décalé
const cards = document.querySelectorAll('.why-card, .service-card, .step');
cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
});

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            cardObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

cards.forEach(card => {
    cardObserver.observe(card);
});

// ============================================
// FORM VALIDATION & SUBMISSION
// ============================================

const contactForm = document.getElementById('contactForm');
const toast = document.getElementById('toast');

// Fonction pour afficher le toast
function showToast(message) {
    toast.querySelector('span').textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Validation email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validation des champs
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');

    // Réinitialiser le style
    field.style.borderColor = '';

    // Validation selon le type de champ
    switch(fieldName) {
        case 'name':
            if (value.length < 2) {
                field.style.borderColor = '#EF4444';
                return false;
            }
            break;

        case 'email':
            if (!isValidEmail(value)) {
                field.style.borderColor = '#EF4444';
                return false;
            }
            break;

        case 'company':
            if (value.length < 2) {
                field.style.borderColor = '#EF4444';
                return false;
            }
            break;

        case 'need':
            if (value.length < 10) {
                field.style.borderColor = '#EF4444';
                return false;
            }
            break;
    }

    field.style.borderColor = '#10B981';
    return true;
}

// Validation en temps réel
const formInputs = contactForm.querySelectorAll('input, textarea');
formInputs.forEach(input => {
    input.addEventListener('blur', function() {
        validateField(this);
    });

    input.addEventListener('input', function() {
        // Réinitialiser le style si l'utilisateur tape
        if (this.style.borderColor === 'rgb(239, 68, 68)') {
            this.style.borderColor = '';
        }
    });
});

// Soumission du formulaire
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    let isValid = true;
    const formData = {
        name: '',
        email: '',
        company: '',
        need: ''
    };

    // Valider tous les champs
    formInputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        } else {
            formData[input.name] = input.value.trim();
        }
    });

    if (!isValid) {
        showToast('⚠️ Veuillez corriger les champs en rouge');

        // Scroll vers le premier champ invalide
        const firstInvalidField = contactForm.querySelector('input[style*="rgb(239, 68, 68)"], textarea[style*="rgb(239, 68, 68)"]');
        if (firstInvalidField) {
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstInvalidField.focus();
        }
        return;
    }

    // Animation du bouton
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="animation: spin 1s linear infinite;">
            <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" stroke-dasharray="50" stroke-linecap="round" opacity="0.3"/>
            <path d="M10 2C14.4183 2 18 5.58172 18 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span>Envoi en cours...</span>
    `;

    // Ajouter l'animation de rotation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // Simuler l'envoi (à remplacer par un vrai appel API)
    setTimeout(() => {
        console.log('Données du formulaire:', formData);

        // Afficher le message de succès
        showToast('✓ Message envoyé avec succès !');

        // Réinitialiser le formulaire
        contactForm.reset();
        formInputs.forEach(input => {
            input.style.borderColor = '';
        });

        // Restaurer le bouton
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        // Retirer le style d'animation
        document.head.removeChild(style);
    }, 1500);
});

// ============================================
// ANIMATION DES STATISTIQUES
// ============================================

function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + (end === 100 ? '%' : '+');
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Observer pour les statistiques
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const isPercentage = text.includes('%');
                const number = parseInt(text);
                stat.textContent = '0';
                animateValue(stat, 0, number, 2000);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ============================================
// PARALLAX EFFECT (LÉGER)
// ============================================

let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-background');

    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });

    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
});

// ============================================
// INITIALISATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 FlowMatchAI - Site chargé avec succès');

    // Animation d'entrée pour les éléments du hero
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .btn-primary, .hero-stats');
    heroElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';

        setTimeout(() => {
            element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// ============================================
// EASTER EGG (optionnel)
// ============================================

let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-konamiSequence.length);

    if (konamiCode.join('') === konamiSequence.join('')) {
        document.body.style.animation = 'rainbow 2s linear infinite';
        showToast('🎉 Code Konami activé ! Vous êtes un vrai geek !');

        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            document.body.style.animation = '';
            document.head.removeChild(style);
        }, 5000);
    }
});