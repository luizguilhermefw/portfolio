<?php
session_start();
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit;
}

$save_success_message = '';
if (isset($_SESSION['save_success_message'])) {
    $save_success_message = $_SESSION['save_success_message'];
    unset($_SESSION['save_success_message']); // Limpa a mensagem da sessão após lê-la
}

$save_error_message = '';
if (isset($_SESSION['save_error_message'])) {
    $save_error_message = $_SESSION['save_error_message'];
    unset($_SESSION['save_error_message']); // Limpa a mensagem da sessão após lê-la
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Adicionar Novo Post</title>
    <link rel="stylesheet" href="style_adm_blog.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
    <div class="background">
        <canvas id="constellation-canvas"></canvas>
    </div>

    <header class="blog-header">
        <h1>Área Administrativa - Novo Post</h1>
        <nav class="admin-nav">
            <span>Olá, <?php echo htmlspecialchars($_SESSION['admin_username']); ?>!</span>
            <a href="blog.html">Ver Blog</a> |
            <a href="index.html">Voltar ao Portfólio</a> |
            <a href="logout.php">Logout</a>
        </nav>
    </header>
    
    <main class="admin-container">
        <h2>Adicionar Novo Post ao Blog</h2>

        <?php if (!empty($save_success_message)): ?>
            <p style="color: green; background-color: #e6ffe6; border: 1px solid green; padding: 10px; border-radius: 4px; margin-bottom:15px;"><?php echo htmlspecialchars($save_success_message); ?></p>
        <?php endif; ?>
        <?php if (!empty($save_error_message)): ?>
            <p style="color: red; background-color: #ffe6e6; border: 1px solid red; padding: 10px; border-radius: 4px; margin-bottom:15px;"><?php echo htmlspecialchars($save_error_message); ?></p>
        <?php endif; ?>

         <form action="save_post.php" method="POST" enctype="multipart/form-data">
            <div>
                <label for="title">Título:</label>
                <input type="text" id="title" name="title" required>
            </div>
            <div>
                <label for="image_url">URL da Imagem de Destaque (opcional):</label>
                <input type="text" id="image_url" name="image_url" placeholder="Cole a URL ou envie um arquivo abaixo">
            </div>
            <div>
                <label for="image_file">Ou Enviar Imagem da Máquina (opcional):</label>
                <input type="file" id="image_file" name="image_file" accept="image/png, image/jpeg, image/gif">
                <small>Tipos permitidos: PNG, JPG, GIF. Tamanho máximo: 2MB.</small>
            </div>
            <div>
                <label for="content">Conteúdo:</label>
                <textarea id="content" name="content" rows="10" required></textarea>
            </div>
            <!-- Nova seção para upload de imagem inline -->
            <div class="inline-image-uploader" style="margin-bottom: 20px; padding: 15px; border: 1px dashed var(--border-color); border-radius: 4px;">
                <label for="inline_image_file" style="font-weight:bold;">Inserir Imagem no Conteúdo:</label>
                <input type="file" id="inline_image_file" name="inline_image_file" accept="image/png, image/jpeg, image/gif" style="margin-top:5px; margin-bottom:10px;">
                <button type="button" id="btnUploadInlineImage" class="button-base" style="background-color: var(--secondary-color); color: var(--text-color); padding: 8px 12px; border: 1px solid var(--accent-color); border-radius:3px;">Enviar Imagem Inline</button>
                <div id="inlineImagePathPreview" style="margin-top:10px; font-size:0.9em;">
                    <small>Após enviar, copie a tag da imagem e cole no campo "Conteúdo" acima.</small>
                </div>
            </div>
            <div>
                <button type="submit">Salvar Post</button>
            </div>
        </form>
    </main>

    <button id="btnTopo" class="button-base" title="Subir para o topo">
        <i class="fas fa-rocket"></i>
    </button>

    <footer>
        <p><small>&copy; <?php echo date("Y"); ?> Área Administrativa.</small></p>
    </footer>

    <script src="script_adm_shared.js"></script> <!-- Script compartilhado para canvas e botão topo -->
    <script>
        // Lógica para upload de imagem inline (específica desta página)
        const btnUploadInlineImage = document.getElementById('btnUploadInlineImage');
        const inlineImageFile = document.getElementById('inline_image_file');
        const inlineImagePathPreview = document.getElementById('inlineImagePathPreview');
        const contentTextarea = document.getElementById('content');

        if (btnUploadInlineImage && inlineImageFile && inlineImagePathPreview && contentTextarea) {
            btnUploadInlineImage.addEventListener('click', async () => {
                if (inlineImageFile.files.length === 0) {
                    inlineImagePathPreview.innerHTML = '<small style="color:red;">Selecione um arquivo primeiro.</small>';
                    return;
                }

                const formData = new FormData();
                formData.append('inline_image', inlineImageFile.files[0]);

                inlineImagePathPreview.innerHTML = '<small>Enviando...</small>';

                try {
                    const response = await fetch('upload_inline_image.php', {
                        method: 'POST',
                        body: formData
                    });
                    const result = await response.json();

                    if (result.success && result.filePath) {
                        const rawImgTag = `<img src="${result.filePath}" alt="Imagem inline" style="max-width:100%; height:auto;">`;
                        const escapedImgTagForInputDisplay = escapeHTML(rawImgTag);
                        const imgTagArgumentForJSFunction = rawImgTag.replace(/'/g, "\\'");
                        
                        inlineImagePathPreview.innerHTML = `
                            <small>Imagem enviada! Copie e cole no conteúdo ou clique para inserir:</small><br>
                            <input type="text" value="${escapedImgTagForInputDisplay}" readonly onclick="this.select(); document.execCommand('copy');" style="width:calc(100% - 22px); margin-top:5px; padding: 5px; background-color: var(--primary-color); color: var(--text-color); border: 1px solid var(--border-color);" title="Clique para copiar">
                            <button type="button" onclick="insertImageTag('${imgTagArgumentForJSFunction}')" class="button-base" style="padding: 5px 10px; margin-left:5px; background-color: var(--accent-color); color: var(--primary-color); border:none; border-radius:3px;">Inserir</button>
                        `;
                        inlineImageFile.value = ''; // Limpa o input file
                    } else {
                        inlineImagePathPreview.innerHTML = `<small style="color:red;">Erro: ${escapeHTML(result.error || 'Falha no upload.')}</small>`;
                    }
                } catch (error) {
                    console.error('Erro no upload inline:', error);
                    inlineImagePathPreview.innerHTML = '<small style="color:red;">Erro de comunicação ao enviar imagem.</small>';
                }
            });
        }

        function insertImageTag(tag) {
            const textarea = document.getElementById('content');
            const scrollPos = textarea.scrollTop;
            const cursorPos = textarea.selectionStart;
            const front = textarea.value.substring(0, cursorPos);
            const back = textarea.value.substring(textarea.selectionEnd, textarea.value.length);
            textarea.value = front + tag + back;
            textarea.selectionStart = textarea.selectionEnd = cursorPos + tag.length;
            textarea.focus();
            textarea.scrollTop = scrollPos;
        }

        function escapeHTML(str) {
            if (typeof str !== 'string') return '';
            return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
        }
    </script>
</body>
</html>
