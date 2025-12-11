function startTimer(duration, display) {
    var timer = duration, hours, minutes, seconds;
    setInterval(function () {
        hours = parseInt(timer / 3600, 10); minutes = parseInt((timer % 3600) / 60, 10); seconds = parseInt(timer % 60, 10);
        hours = hours < 10 ? "0" + hours : hours; minutes = minutes < 10 ? "0" + minutes : minutes; seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = hours + ":" + minutes + ":" + seconds;
        if (--timer < 0) timer = duration;
    }, 1000);
}

// Script para o FAQ (Acordeão)
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            faqItems.forEach(other => { if (other !== item) other.classList.remove('active'); });
            item.classList.toggle('active');
        });
    });
}

window.onload = function () {
    // Timer 24h
    var twentyFourHours = 60 * 60 * 24;
    var display = document.querySelector('#timer');
    startTimer(twentyFourHours, display);
    
    // Inicia Lógica do FAQ
    initFAQ();
    
    // LÓGICA DE PUSH-UP DA BARRA DE URGÊNCIA
    window.addEventListener('scroll', function() {
        var bar = document.getElementById('urgency-bar-delay');
        var footer = document.querySelector('footer');
        
        // Se a barra ou o footer não existem ou não estão visíveis, não faz nada
        if (!bar || !footer || bar.style.display === 'none') return;

        var footerRect = footer.getBoundingClientRect();
        var windowHeight = window.innerHeight;

        // Se o topo do footer estiver visível na janela
        if (footerRect.top < windowHeight) {
            // Calcula quanto do footer está visível
            var visiblePart = windowHeight - footerRect.top;
            // Empurra a barra pra cima (20px margem original + altura visível do footer)
            bar.style.bottom = (20 + visiblePart) + 'px';
        } else {
            // Se o footer não tá visível, volta pro padrão
            bar.style.bottom = '20px';
        }
    });
    
    // DELAY GERAL
    var elementosIds = [
        'botao-delay', 
        'urgency-bar-delay', 
        'badges-delay', 
        'transformation-delay', 
        'testimonials-delay', 
        'offer-delay',
        'final-warning-delay',
        'faq-delay',
        'footer-delay'
    ];
    
    var tempoSegundos = 5; // <--- DEFINA O TEMPO AQUI (Ex: 900 para 15 min)

    setTimeout(function() {
        elementosIds.forEach(function(id) {
            var el = document.getElementById(id);
            if(el) { 
                // Itens de bloco vs flex
                if (['transformation-delay', 'testimonials-delay', 'offer-delay', 'final-warning-delay', 'faq-delay', 'footer-delay'].includes(id)) {
                    el.style.display = 'block';
                } else {
                    el.style.display = 'flex';
                }
                
                setTimeout(function() { el.classList.add('visible'); }, 50); 
            }
        });
    }, tempoSegundos * 1000);
};