function addStars() {
    const background = document.querySelector('.background');
    const numberOfStars = 100;
    const starSpeed = 10; // Velocidade das estrelas em pixels por segundo

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.top = Math.random() * 100 + '%';
        star.style.left = Math.random() * 100 + '%';
        star.dataset.speed = Math.random() * starSpeed + 1; // Define a velocidade da estrela
        background.appendChild(star);
    }

    moveStars();
}

function moveStars() {
    const stars = document.querySelectorAll('.star');

    stars.forEach(star => {
        let speed = parseFloat(star.dataset.speed);
        let x = parseFloat(star.style.left);
        x -= speed / 10; // Dividido por 10 para ajustar a velocidade

        if (x < -1) {
            x = 101; // Reposiciona a estrela fora da tela para reiniciar o movimento
        }

        star.style.left = x + '%';
    });

    requestAnimationFrame(moveStars);
}

addStars();

let contador = 0;
const contadorElemento = document.getElementById("contador-numero");

function atualizarContador() {
    contador++;
    contadorElemento.textContent = contador;
}

// Chamada inicial para iniciar o contador
atualizarContador();


document.querySelectorAll('.menu ul li a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            if (targetSection.classList.contains('active')) {
                targetSection.classList.remove('active');
            } else {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });

                // Adiciona a classe 'active' à seção correspondente
                targetSection.classList.add('active');

                // Remove a classe 'active' de todas as outras seções
                document.querySelectorAll('.content').forEach(section => {
                    if (section !== targetSection) {
                        section.classList.remove('active');
                    }
                });
            }
        }
    });
});



document.querySelectorAll('.menu ul li a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Botão subir ao topo 
function subirTopo() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

const username = 'eziul';
const repoName = 'game-man-vs-dino';
const url = `https://api.github.com/repos/${username}/${repoName}`;

fetch(url)
  .then(response => response.json())
  .then(repo => {
    const projectsContainer = document.getElementById('repos-container');
    const repoElement = document.createElement('div');
    repoElement.classList.add('repo-box');
    repoElement.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${repo.description || 'Descrição não disponível'}</p>
        <a href="${repo.html_url}" target="_blank" class="github-link"><i id="icon-projetos" class="fab fa-github"></i></a>
        <a href="https://eziul.github.io/game-man-vs-dino/" target="_blank" class="github-game"><i class="fas fa-gamepad"></i> <span>Jogar</span></a>`;
    projectsContainer.appendChild(repoElement);
  })
  .catch(error => console.error('Erro ao carregar o repositório do GitHub:', error));







