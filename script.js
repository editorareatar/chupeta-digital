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
    
    // --- VERIFICAÇÃO DE PÁGINA DE SUCESSO (CHECKOUT) ---
    var successPage = document.getElementById('confetti-wrapper');
    if (successPage) {
        localStorage.removeItem('offerEndTime');
        localStorage.removeItem('currentStock');
        createConfetti();
        return; // Para o script aqui
    }

    // --- LÓGICA DA PÁGINA DE VENDAS ---

    // 1. Inicia Timer e Estoque
    var displayTimer = document.querySelector('#timer');
    if (displayTimer) {
        var twentyFourHoursInSeconds = 60 * 60 * 24;
        startPersistentTimer(twentyFourHoursInSeconds, displayTimer);
    }
    startStockSimulator();
    initFAQ();

    // 2. Lógica da Barra de Urgência (Scroll)
    window.addEventListener('scroll', function() {
        var bar = document.getElementById('urgency-bar-delay');
        var footer = document.querySelector('footer');
        
        if (!bar || !footer || bar.style.display === 'none') return; // Só roda se a barra já estiver visível

        var footerRect = footer.getBoundingClientRect();
        var windowHeight = window.innerHeight;

        if (footerRect.top < windowHeight) {
            var visiblePart = windowHeight - footerRect.top;
            bar.style.bottom = (20 + visiblePart) + 'px';
        } else {
            bar.style.bottom = '20px';
        }
    });

    // =========================================================
    // 3. VSL DELAY (LÓGICA DO TEMPO DO VÍDEO)
    // =========================================================
    
    // IDs dos elementos que ficam escondidos
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

    // Tempo alvo: 4 minutos e 28 segundos = 268 segundos
    // Multiplicamos por 1000 para virar milissegundos
    var tempoDelay = 180 * 1000; 

    // Verifica se o usuário JÁ VIU a oferta antes (Cookies/LocalStorage)
    var jaViuOferta = localStorage.getItem('userHasSeenOffer');

    // Função que mostra tudo
    function showElements() {
        elementosIds.forEach(function(id) {
            var el = document.getElementById(id);
            if(el) { 
                // Define se é block ou flex dependendo do elemento
                if (['transformation-delay', 'testimonials-delay', 'offer-delay', 'final-warning-delay', 'faq-delay', 'footer-delay'].includes(id)) {
                    el.style.display = 'block';
                } else {
                    el.style.display = 'flex';
                }
                // Adiciona o fade-in suave
                setTimeout(function() { el.classList.add('visible'); }, 50); 
            }
        });
        
        // Salva que o usuário já viu (para a próxima vez ser instantâneo)
        localStorage.setItem('userHasSeenOffer', 'true');
    }

    if (jaViuOferta) {
        // Se já viu antes, mostra rápido (apenas 1 segundo de carregamento)
        setTimeout(showElements, 1000);
    } else {
        // Se é a primeira vez, espera os 4:28 (268 segundos)
        setTimeout(showElements, tempoDelay);
    }
};