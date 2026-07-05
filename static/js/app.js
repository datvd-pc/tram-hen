// Trạm Hẹn Hò - Frontend JavaScript (v2 - Pink Theme)

// ==================== TOAST SYSTEM ====================
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span>${icons[type] || 'ℹ️'}</span>
        <span>${message}</span>
    `;
    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100px)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ==================== SECURITY: HTML ESCAPING ====================
function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(String(str)));
    return div.innerHTML;
}

// ==================== API HELPERS ====================
async function apiCall(url, optionsOrMethod = 'GET', body = null, headers = {}) {
    let options;
    
    // Support both apiCall(url, {method, body}) and apiCall(url, method, body)
    if (typeof optionsOrMethod === 'object' && optionsOrMethod !== null) {
        options = {
            method: optionsOrMethod.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(optionsOrMethod.headers || {})
            }
        };
        if (optionsOrMethod.body) {
            options.body = optionsOrMethod.body;
        }
    } else {
        options = {
            method: optionsOrMethod,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };
        if (body) {
            options.body = JSON.stringify(body);
        }
    }

    try {
        const res = await fetch(url, options);
        const data = await res.json();
        return data;
    } catch (err) {
        console.error('API Error:', err);
        return { success: false, error: 'Lỗi kết nối server' };
    }
}

// ==================== FORMAT HELPERS ====================
function formatMoney(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount);
}

function formatNumber(num) {
    return new Intl.NumberFormat('vi-VN').format(num);
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// ==================== CONFETTI EFFECT ====================
function showConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden;';
    document.body.appendChild(container);

    const colors = ['#ec4899', '#8b5cf6', '#f472b6', '#c026d3', '#d946ef', '#a78bfa'];

    for (let i = 0; i < 80; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: absolute;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            animation: confettiFall ${Math.random() * 3 + 2}s ease-in forwards;
            animation-delay: ${Math.random() * 0.5}s;
            transform: rotate(${Math.random() * 360}deg);
        `;
        container.appendChild(confetti);
    }

    if (!document.getElementById('confetti-style')) {
        const style = document.createElement('style');
        style.id = 'confetti-style';
        style.textContent = `
            @keyframes confettiFall {
                0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
                100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    setTimeout(() => container.remove(), 5000);
}

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ==================== NAVBAR SCROLL EFFECT ====================
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
        navbar.style.background = 'rgba(255, 255, 255, 0.97)';
        navbar.style.boxShadow = '0 2px 20px rgba(124, 58, 237, 0.08)';
    } else {
        navbar.classList.remove('scrolled');
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    lastScroll = currentScroll;
});

// ==================== INIT ====================
console.log('💕 Trạm Hẹn Hò v2 - Pink Theme loaded');
