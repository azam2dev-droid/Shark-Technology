/* ============================================
   Shark Technology - الوظائف الرئيسية
   شركة سودانية 🇸🇩
   ============================================ */

const App = {
    currentLang: 'ar',
    currentTheme: 'dark',

    init() {
        this.loadPreferences();
        this.setupProgressBar();
        this.setupHeader();
        this.setupDrawer();
        this.setupTheme();
        this.setupLanguage();
        this.setupRevealAnimations();
        this.setupCounters();
        this.setupForm();
        this.setupScrollTop();
        this.setupSmoothScroll();
        this.setupCardHover();
    },

    loadPreferences() {
        const savedLang = localStorage.getItem('shark_lang');
        const savedTheme = localStorage.getItem('shark_theme');
        
        if (savedLang && translations[savedLang]) {
            this.currentLang = savedLang;
        } else {
            const browserLang = (navigator.language || 'ar').slice(0, 2);
            this.currentLang = browserLang === 'ar' ? 'ar' : 'en';
        }
        
        this.currentTheme = savedTheme || 'dark';
        document.body.setAttribute('data-theme', this.currentTheme);
        this.applyLanguage(this.currentLang);
    },

    setupProgressBar() {
        const bar = document.getElementById('progressBar');
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollTop = window.pageYOffset;
                    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
                    bar.style.transform = `scaleX(${progress})`;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    },

    setupHeader() {
        const header = document.getElementById('header');
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    header.classList.toggle('scrolled', window.pageYOffset > 30);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    },

    setupDrawer() {
        const btn = document.getElementById('menuBtn');
        const drawer = document.getElementById('mobileDrawer');
        const overlay = document.getElementById('drawerOverlay');
        
        const toggle = (open) => {
            btn.classList.toggle('active', open);
            drawer.classList.toggle('open', open);
            overlay.classList.toggle('open', open);
            document.body.classList.toggle('menu-open', open);
        };
        
        btn.addEventListener('click', () => toggle(!drawer.classList.contains('open')));
        overlay.addEventListener('click', () => toggle(false));
        
        drawer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => toggle(false));
        });
    },

    setupTheme() {
        const btn = document.getElementById('themeBtn');
        
        btn.addEventListener('click', () => {
            this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
            document.body.setAttribute('data-theme', this.currentTheme);
            localStorage.setItem('shark_theme', this.currentTheme);
        });
    },

    setupLanguage() {
        const btn = document.getElementById('langBtn');
        const label = document.getElementById('langLabel');
        
        label.textContent = this.currentLang === 'ar' ? 'EN' : 'ع';
        
        btn.addEventListener('click', () => {
            this.currentLang = this.currentLang === 'ar' ? 'en' : 'ar';
            this.applyLanguage(this.currentLang);
            localStorage.setItem('shark_lang', this.currentLang);
            label.textContent = this.currentLang === 'ar' ? 'EN' : 'ع';
        });
    },

    applyLanguage(lang) {
        const html = document.documentElement;
        const t = translations[lang];
        
        html.lang = lang;
        html.dir = lang === 'ar' ? 'rtl' : 'ltr';
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) el.innerHTML = t[key];
        });
        
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (t[key]) el.placeholder = t[key];
        });
        
        document.title = lang === 'ar' 
            ? 'Shark Technology | شركة تطوير برمجيات وتحليل أنظمة في السودان'
            : 'Shark Technology | Software Development & Systems Analysis in Sudan';
    },

    setupRevealAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -60px 0px'
        });
        
        document.querySelectorAll('.reveal, .service-card, .testimonial').forEach(el => {
            observer.observe(el);
        });
    },

    setupCounters() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        document.querySelectorAll('[data-count]').forEach(el => {
            observer.observe(el);
        });
    },

    animateCounter(el) {
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000;
        const startTime = performance.now();
        const isArabic = this.currentLang === 'ar';
        
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(eased * target);
            
            el.textContent = current.toLocaleString(isArabic ? 'ar-EG' : 'en-US') + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target.toLocaleString(isArabic ? 'ar-EG' : 'en-US') + suffix;
            }
        };
        
        requestAnimationFrame(update);
    },

    setupForm() {
        const form = document.getElementById('contactForm');
        const status = document.getElementById('formStatus');
        const submitBtn = document.getElementById('submitBtn');
        const submitText = submitBtn.querySelector('span');
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const data = {
                name: form.name.value.trim(),
                email: form.email.value.trim(),
                phone: form.phone.value.trim(),
                service: form.service.value,
                message: form.message.value.trim()
            };
            
            // التحقق
            if (!data.name || !data.email || !data.service || !data.message) {
                status.className = 'form-status error';
                status.textContent = translations[this.currentLang]['form.error'];
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                status.className = 'form-status error';
                status.textContent = this.currentLang === 'ar' 
                    ? '⚠️ البريد الإلكتروني غير صحيح' 
                    : '⚠️ Invalid email address';
                return;
            }
            
            // إرسال (محاكاة - استبدل بـ Formspree)
            submitBtn.disabled = true;
            submitText.textContent = this.currentLang === 'ar' ? 'جاري الإرسال...' : 'Sending...';
            
            // للإرسال الحقيقي:
            // await fetch('https://formspree.io/f/YOUR_ID', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // });
            
            setTimeout(() => {
                status.className = 'form-status success';
                status.textContent = translations[this.currentLang]['form.success'];
                
                form.reset();
                submitBtn.disabled = false;
                submitText.textContent = translations[this.currentLang]['form.submit'];
                
                setTimeout(() => {
                    status.className = 'form-status';
                    status.textContent = '';
                }, 6000);
            }, 1500);
        });
    },

    setupScrollTop() {
        const btn = document.getElementById('scrollTop');
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    btn.classList.toggle('show', window.pageYOffset > 600);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
        
        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    },

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offset = 80;
                    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            });
        });
    },

    setupCardHover() {
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                card.style.setProperty('--mx', x + '%');
                card.style.setProperty('--my', y + '%');
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());