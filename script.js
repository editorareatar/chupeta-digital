// Função simples para gerar confetes CSS ao carregar
function createConfetti() {
    const colors = ['#8B5CF6', '#F97316', '#10B981', '#FCD34D'];
    const wrapper = document.getElementById('confetti-wrapper');
    
    for (let i = 0; i < 50; i++) {
        const div = document.createElement('div');
        div.classList.add('confetti');
        div.style.left = Math.random() * 100 + 'vw';
        div.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        div.style.animationDuration = (Math.random() * 3 + 2) + 's';
        div.style.opacity = Math.random();
        wrapper.appendChild(div);
    }
}

// Estilo da animação de queda
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fall {
        0% { top: -10px; transform: translateX(0) rotate(0); }
        100% { top: 100vh; transform: translateX(${Math.random() * 100 - 50}px) rotate(720deg); }
    }
`;
document.head.appendChild(style);

window.onload = createConfetti;