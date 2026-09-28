/* ============================================
   Shark Technology - عداد الزوار
   ============================================ */

const VisitorCounter = {
    namespace: 'shark-tech-sd-2025',
    fallbackCount: 1250,

    async init() {
        const el = document.getElementById('visitorCount');
        if (!el) return;
        
        try {
            const count = await this.getCount();
            this.animateCount(el, count);
        } catch (error) {
            console.warn('Visitor counter failed, using fallback');
            const fallback = this.getFallbackCount();
            this.animateCount(el, fallback);
        }
    },

    async getCount() {
        const response = await fetch(
            `https://api.countapi.xyz/hit/${this.namespace}/visits`,
            { method: 'GET' }
        );
        
        if (!response.ok) throw new Error('API failed');
        
        const data = await response.json();
        return data.value;
    },

    getFallbackCount() {
        let count = localStorage.getItem('shark_visitor_fallback');
        
        if (!count) {
            count = this.fallbackCount;
        } else {
            count = parseInt(count, 10);
            if (!sessionStorage.getItem('shark_session')) {
                count += 1;
                sessionStorage.setItem('shark_session', 'true');
            }
        }
        
        localStorage.setItem('shark_visitor_fallback', count);
        return count;
    },

    animateCount(el, target) {
        const duration = 2000;
        const startTime = performance.now();
        const isArabic = document.documentElement.lang === 'ar';
        
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(eased * target);
            
            el.textContent = current.toLocaleString(isArabic ? 'ar-EG' : 'en-US');
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target.toLocaleString(isArabic ? 'ar-EG' : 'en-US');
            }
        };
        
        requestAnimationFrame(update);
    }
};

document.addEventListener('DOMContentLoaded', () => VisitorCounter.init());