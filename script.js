// Variável global para o player do YouTube
let player;
let videoStarted = false; // Controla se o vídeo já foi iniciado pelo usuário

// Esta função é chamada automaticamente pela API do YouTube quando o código é carregado
function onYouTubeIframeAPIReady() {
    player = new YT.Player('vsl-player', {
        events: {
            'onReady': onPlayerReady
        }
    });
}

// Esta função é chamada quando o player está pronto
function onPlayerReady(event) {
    // Seleciona os elementos necessários
    const playOverlay = document.querySelector('.play-overlay');
    const videoOverlay = document.querySelector('.video-overlay');
    const videoContainer = document.querySelector('.video-container');

    // Adiciona um único listener de clique no overlay principal
    if (videoOverlay && videoContainer) {
        videoOverlay.addEventListener('click', () => {
            if (!videoStarted) {
                // Primeiro clique: Inicia o vídeo
                player.playVideo();
                if (playOverlay) playOverlay.style.display = 'none'; // Esconde o botão de play
                videoStarted = true;
            } else {
                // Cliques seguintes: Alterna o mudo
                toggleMute(videoContainer);
            }
        });
    }
}

// Função para alternar o estado de mudo
function toggleMute(container) {
    if (player.isMuted()) {
        player.unMute();
        container.classList.remove('is-muted');
    } else {
        player.mute();
        container.classList.add('is-muted');
    }
}