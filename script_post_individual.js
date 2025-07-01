// Funções auxiliares movidas para o topo para clareza
function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

function nl2br(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/(\r\n|\n\r|\r|\n)/g, '<br>');
}

document.addEventListener('DOMContentLoaded', () => {
    // --- Animação de Constelação no Canvas ---
    const canvasElement = document.getElementById('constellation-canvas');
    if (canvasElement) {
        initConstellationCanvasAnimation(canvasElement);
    }

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
        btnTopo.addEventListener('click', () => window.scrollTo({ top: 0, behavior: "smooth" }));
        window.addEventListener('scroll', toggleBtnTopoVisibility);
        toggleBtnTopoVisibility();
    }

    // --- Buscar e renderizar o post individual ---
    fetchSinglePost();
});

async function fetchSinglePost() {
    const postContentArea = document.getElementById('single-post-content-area');
    const postTitleHeader = document.getElementById('post-title-header');
    
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');

    if (!postId) {
        postContentArea.innerHTML = '<p>Erro: ID do post não fornecido na URL.</p>';
        if(postTitleHeader) postTitleHeader.textContent = 'Erro';
        return;
    }

    try {
        const response = await fetch(`get_single_post.php?id=${postId}`);
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        }
        const post = await response.json();

        if (post.error) {
            if(postContentArea) postContentArea.innerHTML = `<p>Erro ao carregar o post: ${escapeHTML(post.error)}</p>`;
            if(postTitleHeader) postTitleHeader.textContent = 'Erro ao Carregar';
            document.title = 'Erro ao Carregar Post';
            return;
        }

        if (!post.id) {
            if(postContentArea) postContentArea.innerHTML = '<p>Post não encontrado.</p>';
            if(postTitleHeader) postTitleHeader.textContent = 'Post Não Encontrado';
            document.title = 'Post Não Encontrado';
            return;
        }
        
        document.title = `${escapeHTML(post.title)} - Blog`;
        if(postTitleHeader) postTitleHeader.textContent = escapeHTML(post.title);

        let imageHTML = '';
        if (post.image_url && post.image_url.trim() !== "") {
            imageHTML = `<img src="${escapeHTML(post.image_url)}" alt="Imagem de destaque do post ${escapeHTML(post.title)}" class="post-image-full">`;
        }

        const date = new Date(post.created_at);
        const formattedDate = date.toLocaleDateString('pt-BR', {
            day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        if(postContentArea) {
            postContentArea.innerHTML = `
                ${imageHTML}
                <p class="post-meta-single">Publicado em: <time datetime="${post.created_at}">${formattedDate}</time> por Luiz Guilherme</p>
                <div class="post-content-full">
                    ${nl2br(post.content)}
                </div>
                <a href="blog.html" class="back-to-blog"><i class="fas fa-arrow-left"></i> Voltar para todos os posts</a>
            `;
        }

    } catch (error) {
        console.error('Falha ao buscar o post individual:', error);
        if(postContentArea) postContentArea.innerHTML = '<p>Ocorreu um erro ao carregar o post. Tente novamente mais tarde.</p>';
        if(postTitleHeader) postTitleHeader.textContent = 'Erro ao Carregar';
        document.title = 'Erro ao Carregar Post';
    }
}

// Função de animação da constelação
function initConstellationCanvasAnimation(canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray;

    function resizeCanvas() {
        const backgroundEl = canvas.parentElement;
        canvas.width = backgroundEl ? backgroundEl.clientWidth : window.innerWidth;
        canvas.height = backgroundEl ? backgroundEl.clientHeight : window.innerHeight;
    }

    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
    resizeCanvas();

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY; this.size = size; this.color = color;
        }
        draw() {
            ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false); ctx.fillStyle = this.color; ctx.fill();
        }
        update() {
            if (this.x + this.size > canvas.width || this.x - this.size < 0) { this.directionX = -this.directionX; }
            if (this.y + this.size > canvas.height || this.y - this.size < 0) { this.directionY = -this.directionY; }
            this.x += this.directionX; this.y += this.directionY; this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        const numberOfParticles = Math.floor((canvas.width * canvas.height) / 12000);
        for (let i = 0; i < numberOfParticles; i++) {
            const size = Math.random() * 1.5 + 0.5;
            const x = Math.random() * (canvas.width - size * 2) + size;
            const y = Math.random() * (canvas.height - size * 2) + size;
            const directionX = (Math.random() * 0.3) - 0.15;
            const directionY = (Math.random() * 0.3) - 0.15;
            const particleColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color')?.trim() || 'rgba(224, 224, 220, 0.7)';
            particlesArray.push(new Particle(x, y, directionX, directionY, size, particleColor));
        }
    }

    function connectParticles() {
        const maxDistance = Math.min(canvas.width, canvas.height) / 6;
        const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color')?.trim() || '#00ffff';
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a + 1; b < particlesArray.length; b++) {
                const distance = Math.sqrt(Math.pow(particlesArray[a].x - particlesArray[b].x, 2) + Math.pow(particlesArray[a].y - particlesArray[b].y, 2));
                if (distance < maxDistance) {
                    const opacity = 1 - (distance / maxDistance);
                    let r = parseInt(accentColor.slice(1, 3), 16);
                    let g = parseInt(accentColor.slice(3, 5), 16);
                    let b_color = parseInt(accentColor.slice(5, 7), 16);
                    ctx.strokeStyle = `rgba(${r}, ${g}, ${b_color}, ${opacity * 0.4})`;
                    ctx.lineWidth = 0.3;
                    ctx.beginPath(); ctx.moveTo(particlesArray[a].x, particlesArray[a].y); ctx.lineTo(particlesArray[b].x, particlesArray[b].y); ctx.stroke();
                }
            }
        }
    }
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particlesArray.forEach(particle => particle.update());
        connectParticles();
        requestAnimationFrame(animate);
    }
    initParticles(); animate();
}
