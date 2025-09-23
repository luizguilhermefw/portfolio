// Função auxiliar para escapar HTML e prevenir XSS simples
function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
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

        btnTopo.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
        
        window.addEventListener('scroll', toggleBtnTopoVisibility);
        toggleBtnTopoVisibility();
    }

    // --- Buscar e renderizar posts do blog ---
    fetchPostsAndRender();

    // --- Renderizar dados da Sidebar ---
    fetchSidebarDataAndRender();

    // --- Event listener para o formulário de busca ---
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const searchInput = searchForm.querySelector('input[name="q"]');
            const query = searchInput.value.trim();
            window.location.href = `blog.html?search=${encodeURIComponent(query)}`;
        });
    }

    // --- Event listener para os botões de excluir (delegação de evento) ---
    const postsGrid = document.querySelector('.posts-grid');
    if (postsGrid) {
        postsGrid.addEventListener('click', async (event) => {
            const targetButton = event.target.closest('.btn-excluir-post');
            if (targetButton) {
                event.preventDefault();
                const postId = targetButton.dataset.postId;
                if (confirm(`Tem certeza que deseja excluir o post ID ${postId}? Esta ação não pode ser desfeita.`)) {
                    try {
                        const formData = new FormData();
                        formData.append('post_id', postId);
                        const response = await fetch('delete_post.php', { method: 'POST', body: formData });
                        const result = await response.json();
                        if (result.success) {
                            targetButton.closest('.blog-post-card').remove();
                            alert('Post excluído com sucesso!');
                        } else {
                            alert(`Erro ao excluir o post: ${result.error || 'Erro desconhecido.'}`);
                        }
                    } catch (error) {
                        console.error('Erro ao tentar excluir o post:', error);
                        alert('Erro de comunicação ao tentar excluir o post.');
                    }
                }
            }

            // Lógica para o botão de like
            const likeButton = event.target.closest('.btn-like-post');
            if (likeButton) {
                event.preventDefault();
                const postId = likeButton.dataset.postId;
                const likeIcon = likeButton.querySelector('i');
                const likeCountSpan = likeButton.querySelector('.like-count');

                try {
                    const formData = new FormData();
                    formData.append('post_id', postId);
                    const response = await fetch('like_post.php', { method: 'POST', body: formData });
                    const result = await response.json();

                    if (result.success) {
                        likeCountSpan.textContent = result.likes_count;
                        likeIcon.classList.toggle('fas'); // Preenchido
                        likeIcon.classList.toggle('far'); // Contorno
                    } else {
                        alert(`Erro ao interagir com o like: ${result.error || 'Erro desconhecido.'}`);
                    }
                } catch (error) {
                    console.error('Erro na requisição de like:', error);
                    alert('Erro de comunicação ao tentar curtir o post.');
                }
            }
        });
    }
});

// Função para verificar o status do admin
async function getAdminStatus() {
    try {
        const response = await fetch('check_admin.php');
        return await response.json();
    } catch (error) {
        console.error("Erro ao verificar status do admin:", error);
        return { isAdmin: false };
    }
}

// Função para buscar posts e renderizá-los
async function fetchPostsAndRender() {
    const postsGrid = document.querySelector('.posts-grid');
    if (!postsGrid) {
        console.error('Elemento .posts-grid não encontrado.');
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    const searchTerm = params.get('search');

    // --- Atualiza o título principal dinamicamente ---
    const mainTitle = document.querySelector('.blog-main-content h2');
    if (mainTitle) {
        if (category) {
            mainTitle.innerHTML = `Posts na categoria: <span class="filter-term">"${escapeHTML(category)}"</span>`;
        } else if (searchTerm) {
            mainTitle.innerHTML = `Resultados da busca por: <span class="filter-term">"${escapeHTML(searchTerm)}"</span>`;
        } else {
            mainTitle.textContent = 'Últimos Posts';
        }
    }
    // ------------------------------------------------

    let fetchUrl = 'get_posts.php';
    const queryParams = [];
    if (category) queryParams.push(`category=${encodeURIComponent(category)}`);
    if (searchTerm) queryParams.push(`search=${encodeURIComponent(searchTerm)}`);

    if (queryParams.length > 0) {
        fetchUrl += `?${queryParams.join('&')}`;
    }

    const adminStatus = await getAdminStatus(); // Verifica o status do admin
    
    try {
        const response = await fetch(fetchUrl); // Chama o script PHP com os filtros
        if (!response.ok) {
            // Se a resposta do servidor não for OK (ex: erro 404, 500), lança um erro
            throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        }
        const posts = await response.json(); // Converte a resposta JSON em objeto JavaScript

        postsGrid.innerHTML = ''; // Limpa a grade antes de adicionar novos posts

        if (posts.error) {
            // Se o JSON retornado pelo PHP contiver uma chave 'error'
            console.error('Erro ao buscar posts (do PHP):', posts.error);
            postsGrid.innerHTML = `<p>Ocorreu um erro ao carregar os posts: ${escapeHTML(posts.error)}</p>`;
            return;
        }

        if (posts.length === 0) {
            postsGrid.innerHTML = '<p>Nenhum post encontrado.</p>';
            return;
        }

        posts.forEach(post => {
            const postElement = createPostElement(post, adminStatus.isAdmin);
            postsGrid.appendChild(postElement);
        });

    } catch (error) {
        // Captura erros de rede ou erros ao processar a resposta
        console.error('Falha ao buscar ou renderizar posts (JavaScript):', error);
        postsGrid.innerHTML = '<p>Ocorreu um erro ao carregar os posts. Verifique o console para mais detalhes.</p>';
    }
}

// Função para buscar e renderizar os dados da sidebar (categorias e posts recentes)
async function fetchSidebarDataAndRender() {
    const categoryList = document.getElementById('category-list');
    const recentPostsList = document.getElementById('recent-posts-list');

    if (!categoryList || !recentPostsList) {
        console.error('Elementos da sidebar não encontrados.');
        return;
    }

    try {
        const response = await fetch('get_sidebar_data.php');
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const data = await response.json();

        // Limpa as listas antes de popular
        categoryList.innerHTML = '';
        recentPostsList.innerHTML = '';

        // Popula a lista de categorias
        if (data.categories && data.categories.length > 0) {
            data.categories.forEach(cat => {
                const li = document.createElement('li');
                li.innerHTML = `<a href="blog.html?category=${encodeURIComponent(cat.category)}">${escapeHTML(cat.category)} (${cat.post_count})</a>`;
                categoryList.appendChild(li);
            });
        }

        // Popula a lista de posts recentes
        if (data.recent_posts && data.recent_posts.length > 0) {
            data.recent_posts.forEach(post => {
                const li = document.createElement('li');
                li.innerHTML = `<a href="post_individual.html?id=${post.id}">${escapeHTML(post.title)}</a>`;
                recentPostsList.appendChild(li);
            });
        }

    } catch (error) {
        console.error('Falha ao buscar dados da sidebar:', error);
    }
}

// Função para criar o HTML de um post individual
function createPostElement(post, isAdmin) {
    const article = document.createElement('article');
    article.classList.add('blog-post-card');

    const readMoreLink = `post_individual.html?id=${post.id}`;

    let imageHTML = '';
    // Verifica se image_url existe, não é nula e não é uma string vazia
    if (post.image_url && post.image_url.trim() !== "") {
        imageHTML = `
            <div class="post-thumbnail">
                <a href="${readMoreLink}" title="Ver o post: ${escapeHTML(post.title)}"><img src="${escapeHTML(post.image_url)}" alt="Imagem de destaque do post ${escapeHTML(post.title)}"></a>
            </div>
        `;
    } else {
        // Imagem placeholder se não houver image_url ou estiver vazia/nula
        imageHTML = `
            <div class="post-thumbnail">
                <a href="${readMoreLink}" title="Ver o post: ${escapeHTML(post.title)}"><img src="https://via.placeholder.com/400x250/BBBBBB/808080?text=Post" alt="Imagem placeholder"></a>
            </div>        
        `;
    }

    // Formatando a data
    const date = new Date(post.created_at);
    const formattedDate = date.toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    // Criando um resumo do conteúdo
    const excerptLength = 150; // Número de caracteres para o resumo
    const contentText = post.content || ""; // Garante que content não seja null/undefined
    const excerpt = contentText.length > excerptLength
                    ? escapeHTML(contentText.substring(0, excerptLength)) + '...'
                    : escapeHTML(contentText);

    const editLink = `edit_post.php?id=${post.id}`;
    const initialLikes = post.likes_count || 0;

    let adminActionsHTML = '';
    if (isAdmin) {
        adminActionsHTML = `<a href="${editLink}" class="btn-editar-post">Editar <i class="fas fa-edit"></i></a>
                            <button data-post-id="${post.id}" class="btn-excluir-post">Excluir <i class="fas fa-trash"></i></button>`;

    }

    // Botão de Like
    // Para saber se o usuário atual já curtiu, precisaríamos de mais lógica (ex: checar IP no backend e retornar essa info)
    // Por simplicidade, vamos começar com o ícone de contorno (far)
    const likeButtonHTML = `
        <button class="btn-like-post" data-post-id="${post.id}" title="Curtir">
            <i class="far fa-heart"></i> <span class="like-count">${initialLikes}</span>
        </button>`;

    article.innerHTML = `
        ${imageHTML}
        <div class="post-content">
            <h3><a href="${readMoreLink}">${escapeHTML(post.title)}</a></h3>
            <p class="post-meta">Publicado em: <time datetime="${post.created_at}">${formattedDate}</time> por Luiz Guilherme</p>
            <p class="post-excerpt">${excerpt}</p>
            <div class="post-actions">
                <a href="${readMoreLink}" class="btn-ler-mais">Ler Mais <i class="fas fa-arrow-right"></i></a>
                ${likeButtonHTML}
                 <div class="admin-action-buttons">${adminActionsHTML}</div>
            </div>
        </div>
    `;

    return article;
}

// Função de animação da constelação (mantida como estava)
function initConstellationCanvasAnimation(canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray;

    function resizeCanvas() {
        const backgroundEl = canvas.parentElement;
        if (backgroundEl) {
            canvas.width = backgroundEl.clientWidth;
            canvas.height = backgroundEl.clientHeight;
        } else {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    }

    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
    resizeCanvas();

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        update() {
            if (this.x + this.size > canvas.width || this.x - this.size < 0) { this.directionX = -this.directionX; }
            if (this.y + this.size > canvas.height || this.y - this.size < 0) { this.directionY = -this.directionY; }
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
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
                const distance = Math.sqrt(
                    Math.pow(particlesArray[a].x - particlesArray[b].x, 2) +
                    Math.pow(particlesArray[a].y - particlesArray[b].y, 2)
                );
                if (distance < maxDistance) {
                    const opacity = 1 - (distance / maxDistance);
                    let r = parseInt(accentColor.slice(1, 3), 16);
                    let g = parseInt(accentColor.slice(3, 5), 16);
                    let b_color = parseInt(accentColor.slice(5, 7), 16);

                    ctx.strokeStyle = `rgba(${r}, ${g}, ${b_color}, ${opacity * 0.4})`;
                    ctx.lineWidth = 0.3;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
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

    initParticles();
    animate();
}
