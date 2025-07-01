<?php
session_start();
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit;
}

// Configurações do Banco de Dados
require_once 'db_config.php';

// Criar a conexão
$conn = new mysqli($servername, $username_db, $password_db, $dbname);

if ($conn->connect_error) {
    die("Falha na conexão com o banco: " . $conn->connect_error);
}
$conn->set_charset("utf8mb4");

$post_id = isset($_GET['id']) ? intval($_GET['id']) : 0;
$post_title = '';
$post_content = '';
$post_image_url = '';
$error_message = '';
$success_message = ''; // Para mensagens de sucesso após atualização

if ($post_id > 0) {
    $sql = "SELECT title, content, image_url FROM posts WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $post_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows === 1) {
        $post = $result->fetch_assoc();
        $post_title = $post['title'];
        $post_content = $post['content'];
        $post_image_url = $post['image_url'];
    } else {
        $error_message = "Post não encontrado.";
    }
    $stmt->close();
} else {
    $error_message = "ID do post inválido.";
}

// Verificar se há mensagem de sucesso da atualização
if (isset($_SESSION['update_success_message'])) {
    $success_message = $_SESSION['update_success_message'];
    unset($_SESSION['update_success_message']); // Limpar a mensagem da sessão
}
if (isset($_SESSION['update_error_message'])) {
    $error_message = $_SESSION['update_error_message'];
    unset($_SESSION['update_error_message']);
}

$conn->close();
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Editar Post</title>
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
        <h1>Área Administrativa - Editar Post</h1>
        <nav class="admin-nav">
            <span>Olá, <?php echo htmlspecialchars($_SESSION['admin_username']); ?>!</span>
            <a href="blog.html">Ver Blog</a> |
            <a href="admin.php">Adicionar Novo</a> |
            <a href="index.html">Voltar ao Portfólio</a> |
            <a href="logout.php">Logout</a>
        </nav>
    </header>
    
    <main class="admin-container">
        <h2>Editando Post: <?php echo htmlspecialchars($post_title); ?></h2>

        <?php if (!empty($success_message)): ?>
            <p style="color: green; background-color: #e6ffe6; border: 1px solid green; padding: 10px; border-radius: 4px; margin-bottom:15px;"><?php echo htmlspecialchars($success_message); ?></p>
        <?php endif; ?>
        <?php if (!empty($error_message) && $post_id > 0 && !$success_message): // Não mostrar erro de post não encontrado se já há um erro de update ?>
            <p style="color: red; background-color: #ffe6e6; border: 1px solid red; padding: 10px; border-radius: 4px; margin-bottom:15px;"><?php echo htmlspecialchars($error_message); ?></p>
        <?php endif; ?>

        <?php if ($post_id > 0 && empty($error_message) || !empty($success_message) || (isset($_SESSION['update_error_message']) && !empty($post_title))): // Mostra o formulário se o post foi encontrado ou se houve tentativa de update ?>
        <form action="update_post.php" method="POST" enctype="multipart/form-data">
            <input type="hidden" name="post_id" value="<?php echo $post_id; ?>">
            <div>
                <label for="title">Título:</label>
                <input type="text" id="title" name="title" value="<?php echo htmlspecialchars($post_title); ?>" required>
            </div>
            <div>
                <label for="image_url">URL da Imagem de Destaque (opcional):</label>
                <input type="text" id="image_url" name="image_url" value="<?php echo htmlspecialchars($post_image_url); ?>" placeholder="Cole a URL ou envie um arquivo abaixo">
                <?php if (!empty($post_image_url) && filter_var($post_image_url, FILTER_VALIDATE_URL) || file_exists($post_image_url)): ?>
                    <small>Imagem atual:</small><br>
                    <img src="<?php echo htmlspecialchars($post_image_url); ?>" alt="Imagem atual" style="max-width: 200px; max-height: 100px; margin-top: 5px; margin-bottom: 10px; border-radius: 4px; border: 1px solid var(--border-color);">
                <?php endif; ?>
            </div>
            <div>
                <label for="image_file">Ou Enviar Nova Imagem da Máquina (substitui a atual):</label>
                <input type="file" id="image_file" name="image_file" accept="image/png, image/jpeg, image/gif">
                <small>Tipos permitidos: PNG, JPG, GIF. Tamanho máximo: 2MB.</small>
            </div>
            <div>
                <label for="content">Conteúdo:</label>
                <textarea id="content" name="content" rows="15" required><?php echo htmlspecialchars($post_content); ?></textarea>
            </div>
            <!-- A seção de upload de imagem inline pode ser adicionada aqui se desejado, similar ao admin.php -->
            <div>
                <button type="submit">Atualizar Post</button>
            </div>
        </form>
        <?php elseif ($post_id <= 0 || !empty($error_message)): ?>
             <p style="color: red;"><?php echo htmlspecialchars($error_message ?: "ID do post inválido ou post não encontrado."); ?></p>
        <?php endif; ?>
    </main>

    <button id="btnTopo" class="button-base" title="Subir para o topo">
        <i class="fas fa-rocket"></i>
    </button>

    <footer>
        <p><small>&copy; <?php echo date("Y"); ?> Área Administrativa.</small></p>
    </footer>

    <script src="script_adm_shared.js"></script> <!-- Script para canvas e botão topo, pode ser um arquivo compartilhado -->
    <!-- Se precisar de JS específico para a página de edição (como o uploader inline), adicione aqui -->
</body>
</html>