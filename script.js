// Função para pausar vídeo do YouTube em um modal
function pauseYouTubeVideo(modal) {
    const iframe = modal.querySelector('iframe');
    // Verifica se é um iframe do YouTube e se contentWindow está acessível
    if (iframe && iframe.src.includes('youtube.com/embed') && iframe.contentWindow) {
        iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    }
}

// Função para fechar um modal específico e pausar vídeo
function closeModal(modal) {
    if (modal) {
        modal.style.display = "none";
        pauseYouTubeVideo(modal);
    }
}

// Função para abrir o modal
function abrirModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "block";
        // Opcional: Se desejar que o vídeo comece a tocar ao abrir (requer autoplay no iframe e permissões do navegador)
        // const iframe = modal.querySelector('iframe[src*="youtube.com/embed"]');
        // if (iframe && iframe.contentWindow) {
        //     iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        // }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // --- Animação de Estrelas ---
    const background = document.querySelector('.background');
    if (background) {
        const numberOfStars = 100;
        const starSpeedFactor = 1; // Ajuste este valor para controlar a velocidade base das estrelas (menor = mais lento)

        function addStarsToBackground() { // Renomeada para evitar conflito com a função global addStars se existir
            for (let i = 0; i < numberOfStars; i++) {
                const star = document.createElement('div');
                star.classList.add('star');
                star.style.top = Math.random() * 100 + '%';
                star.style.left = Math.random() * 100 + '%';
                // Velocidades variadas, com um mínimo para garantir movimento
                star.dataset.speed = Math.random() * starSpeedFactor + 0.1;
                background.appendChild(star);
            }
            requestAnimationFrame(moveStars);
        }

        function moveStars() {
            const stars = document.querySelectorAll('.star');
            stars.forEach(star => {
                let speed = parseFloat(star.dataset.speed);
                let x = parseFloat(star.style.left);
                x -= speed / 20; // Ajuste o divisor para alterar a sensibilidade da velocidade

                if (x < -1) { // Se a estrela saiu completamente à esquerda
                    x = 101; // Reposiciona à direita, fora da tela
                    star.style.top = Math.random() * 100 + '%'; // RE-ADICIONADO: Nova posição Y aleatória para variedade ao reentrar
                }
                star.style.left = x + '%';
            });
            requestAnimationFrame(moveStars);
        }
        addStarsToBackground(); // Chama a função renomeada
    }

    // --- Navegação Suave e Seções Ativas ---
    document.querySelectorAll('.menu ul li a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Verifica se é um link interno (começa com #)
            if (href.startsWith('#')) {
                e.preventDefault(); // Previne a ação padrão apenas para links internos
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    const isCurrentlyActive = targetSection.classList.contains('active');

                    // Primeiro, desativa todas as outras seções ativas
                    document.querySelectorAll('.content.active').forEach(activeSection => {
                        if (activeSection !== targetSection) {
                            activeSection.classList.remove('active');
                        }
                    });

                    if (isCurrentlyActive) {
                        // Se a seção clicada já estava ativa, remove a classe 'active' para escondê-la
                        targetSection.classList.remove('active');
                    } else {
                        // Se a seção clicada não estava ativa, adiciona 'active' para mostrá-la
                        targetSection.classList.add('active');
                        // E então rola suavemente para ela
                        targetSection.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                }
            } // Para links externos (como blog.html), não fazemos nada aqui, permitindo a navegação padrão.
        });
    });

    // --- Botão Voltar ao Topo ---
    const btnTopo = document.getElementById('btnTopo');
    if (btnTopo) {
        const toggleBtnTopoVisibility = () => {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                btnTopo.style.display = "block";
            } else {
                btnTopo.style.display = "none";
            }
        };

        btnTopo.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
        
        window.addEventListener('scroll', toggleBtnTopoVisibility);
        toggleBtnTopoVisibility(); // Chama uma vez para definir o estado inicial
    }

    // Abrir Modais pelos botões de demonstração
    const modalTriggers = document.querySelectorAll('.btn-demonstracao[data-modal-target]');
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.getAttribute('data-modal-target');
            abrirModal(modalId);
        });
    });

    // Fechar Modais pelos botões/spans de fechar
    const modalClosers = document.querySelectorAll('.fechar[data-modal-close]');
    modalClosers.forEach(closer => {
        closer.addEventListener('click', () => {
            const modalId = closer.getAttribute('data-modal-close');
            const modalToClose = document.getElementById(modalId);
            closeModal(modalToClose);
        });
    });

    // Fechar Modal com a tecla Escape
    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            document.querySelectorAll('.modal').forEach(modal => {
                if (modal.style.display === "block") { 
                    closeModal(modal);
                }
            });
        }
    });

    // Fechar o modal se o usuário clicar fora da área de conteúdo do modal
    window.addEventListener('click', function(event) {
        document.querySelectorAll('.modal').forEach(modal => {
            // Verifica se o clique foi diretamente no elemento modal (o fundo escuro)
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });
});

// Função para expandir/contrair descrição dos projetos
function toggleDescription(button) {
    const description = button.parentElement;
    const preview = description.querySelector('.description-preview');
    const full = description.querySelector('.description-full');
    
    if (full.style.display === 'none') {
        // Expandir
        preview.style.display = 'none';
        full.style.display = 'inline';
        button.textContent = 'Leia menos';
        button.classList.add('expanded');
    } else {
        // Contrair
        preview.style.display = 'inline';
        full.style.display = 'none';
        button.textContent = 'Leia mais';
        button.classList.remove('expanded');
    }
}
