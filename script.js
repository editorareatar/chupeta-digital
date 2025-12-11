/* ===========================================================
   FUNÇÃO 1: TIMER PERSISTENTE (Salva no LocalStorage)
   =========================================================== */
function startPersistentTimer(durationInSeconds, display) {
    var timerKey = 'offerEndTime'; // Nome da "gaveta" onde guardamos a hora
    var now = new Date().getTime();
    var endTime = localStorage.getItem(timerKey);

    // Se não existir data salva OU se a data salva já passou (timer zerou)
    if (!endTime || now > endTime) {
        // Define uma nova meta: Agora + Duração em segundos * 1000 (ms)
        endTime = now + (durationInSeconds * 1000);
        localStorage.setItem(timerKey, endTime);
    }

    // Função que atualiza o visual a cada segundo
    function updateTimer() {
        var currentTime = new Date().getTime();
        var distance = endTime - currentTime;

        // Se o tempo acabou
        if (distance < 0) {
            // Reinicia o ciclo para mais 24h (Oferta Evergreen)
            endTime = new Date().getTime() + (durationInSeconds * 1000);
            localStorage.setItem(timerKey, endTime);
            distance = durationInSeconds * 1000;
        }

        // Cálculos matemáticos para horas, minutos e segundos
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Adiciona o zero à esquerda se for menor que 10
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = hours + ":" + minutes + ":" + seconds;
    }

    // Chama uma vez imediatamente para não ter delay de 1s ao carregar
    updateTimer();
    // Inicia o intervalo de 1 segundo
    setInterval(updateTimer, 1000);
}

/* ===========================================================
   FUNÇÃO 2: SIMULADOR DE ESTOQUE (Escassez)
   =========================================================== */
function startStockSimulator() {
    var display = document.getElementById('stock-counter');
    if (!display) return;

    // Tenta pegar o estoque salvo, se não existir, começa em 47
    var savedStock = localStorage.getItem('currentStock');
    var currentStock = savedStock ? parseInt(savedStock) : 47;
    
    var minStock = 7; // Limite mínimo

    // Atualiza o display inicial
    display.textContent = currentStock;

    var interval = setInterval(function() {
        if (currentStock <= minStock) {
            clearInterval(interval);
            return;
        }

        // Diminui entre 1 e 3 unidades
        var drop = Math.floor(Math.random() * 3) + 1;
        currentStock -= drop;

        if (currentStock < minStock) {
            currentStock = minStock;
        }

        // Salva o novo estoque no navegador também (opcional, mas bom pra consistência)
        localStorage.setItem('currentStock', currentStock);
        
        display.textContent = currentStock;

    }, Math.floor(Math.random() * (3600000 - 50000 + 1)) + 50000); // Random entre 50s e 1h
}

/* ===========================================================
   FUNÇÃO 3: FAQ (Acordeão)
   =========================================================== */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            // Fecha os outros
            faqItems.forEach(other => { 
                if (other !== item) other.classList.remove('active'); 
            });
            // Abre/Fecha o atual
            item.classList.toggle('active');
        });
    });
}

/* ===========================================================
   FUNÇÃO 4: CONFETES (Página de Obrigado)
   =========================================================== */
function createConfetti() {
    const wrapper = document.getElementById('confetti-wrapper');
    if (!wrapper) return;

    const colors = ['#8B5CF6', '#F97316', '#10B981', '#FCD34D'];
    
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

/* ===========================================================
   INICIALIZAÇÃO (Window OnLoad)
   =========================================================== */
window.onload = function () {
    
    // 1. INICIA O TIMER PERSISTENTE (24 horas = 86400 segundos)
    var displayTimer = document.querySelector('#timer');
    if (displayTimer) {
        var twentyFourHoursInSeconds = 60 * 60 * 24;
        startPersistentTimer(twentyFourHoursInSeconds, displayTimer);
    }
    
    // 2. INICIA SIMULADOR DE ESTOQUE
    startStockSimulator();
    
    // 3. INICIA FAQ
    initFAQ();
    
    // 4. LÓGICA DA BARRA DE URGÊNCIA (FLUTUANTE)
    window.addEventListener('scroll', function() {
        var bar = document.getElementById('urgency-bar-delay');
        var footer = document.querySelector('footer');
        
        if (!bar || !footer || bar.style.display === 'none') return;

        var footerRect = footer.getBoundingClientRect();
        var windowHeight = window.innerHeight;

        // Se o footer aparecer na tela, empurra a barra pra cima
        if (footerRect.top < windowHeight) {
            var visiblePart = windowHeight - footerRect.top;
            bar.style.bottom = (20 + visiblePart) + 'px';
        } else {
            bar.style.bottom = '20px';
        }
    });
    
    // 5. DELAY GERAL DE ELEMENTOS (VSL)
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
    
    // TEMPO DO DELAY EM SEGUNDOS
    var tempoSegundos = 5; 

    setTimeout(function() {
        elementosIds.forEach(function(id) {
            var el = document.getElementById(id);
            if(el) { 
                // Define display based on logic (block for sections, flex for bars/buttons)
                if (['transformation-delay', 'testimonials-delay', 'offer-delay', 'final-warning-delay', 'faq-delay', 'footer-delay'].includes(id)) {
                    el.style.display = 'block';
                } else {
                    el.style.display = 'flex';
                }
                
                // Adiciona classe para animação de fade-in
                setTimeout(function() { el.classList.add('visible'); }, 50); 
            }
        });
    }, tempoSegundos * 1000);

    // 6. Confetes (apenas se existir o container)
    createConfetti();
};
