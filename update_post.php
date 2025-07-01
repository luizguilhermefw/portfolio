<?php
session_start();

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    $_SESSION['update_error_message'] = "Acesso não autorizado.";
    header('Location: login.php'); // Ou para edit_post.php com erro
    exit;
}

require_once 'db_config.php';

$conn = new mysqli($servername, $username_db, $password_db, $dbname);

if ($conn->connect_error) {
    $_SESSION['update_error_message'] = "Falha na conexão com o banco: " . $conn->connect_error;
    // Não podemos redirecionar para edit_post.php?id= sem o ID aqui, então talvez para admin.php
    header('Location: admin.php'); 
    exit;
}
$conn->set_charset("utf8mb4");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $post_id = isset($_POST['post_id']) ? intval($_POST['post_id']) : 0;
    $title = isset($_POST['title']) ? htmlspecialchars($_POST['title']) : '';
    
    $raw_content = isset($_POST['content']) ? $_POST['content'] : '';
    $allowed_tags = '<p><a><img><b><strong><i><em><ul><ol><li><br><h2><h3><h4><h5><h6><blockquote><code><pre>';
    $content = strip_tags($raw_content, $allowed_tags);

    $image_url_input = isset($_POST['image_url']) ? htmlspecialchars($_POST['image_url']) : null;
    $final_image_path = $image_url_input; // Começa com a URL existente ou nova do campo de texto

    if ($post_id <= 0) {
        $_SESSION['update_error_message'] = "ID do post inválido.";
        header('Location: admin.php'); // Ou alguma página de erro geral
        exit;
    }

    // Lógica de Upload de Novo Arquivo (se um novo arquivo for enviado)
    if (isset($_FILES['image_file']) && $_FILES['image_file']['error'] == UPLOAD_ERR_OK) {
        $upload_dir = 'uploads/';
        if (!is_dir($upload_dir)) {
            if (!mkdir($upload_dir, 0755, true)) {
                $_SESSION['update_error_message'] = "Erro ao criar o diretório de uploads.";
                header("Location: edit_post.php?id=" . $post_id);
                exit;
            }
        }

        $file_tmp_path = $_FILES['image_file']['tmp_name'];
        $file_name = basename($_FILES['image_file']['name']);
        $file_ext_array = explode('.', $file_name);
        $file_ext = strtolower(end($file_ext_array));
        $allowed_extensions = ['jpg', 'jpeg', 'png', 'gif'];
        $max_file_size = 2 * 1024 * 1024; // 2MB

        if (in_array($file_ext, $allowed_extensions) && $_FILES['image_file']['size'] <= $max_file_size) {
            // TODO: Considerar deletar a imagem antiga se ela foi um upload local e está sendo substituída.
            $new_file_name = uniqid('postimg_', true) . '.' . $file_ext;
            $dest_path = $upload_dir . $new_file_name;
            if (move_uploaded_file($file_tmp_path, $dest_path)) {
                $final_image_path = $dest_path; // Substitui o image_url pelo caminho do novo arquivo
            } else {
                $_SESSION['update_error_message'] = "Erro ao mover o novo arquivo enviado.";
                header("Location: edit_post.php?id=" . $post_id);
                exit;
            }
        } else {
            $_SESSION['update_error_message'] = "Novo arquivo inválido (tipo ou tamanho).";
            header("Location: edit_post.php?id=" . $post_id);
            exit;
        }
    }
    // Se nenhum arquivo novo foi enviado, $final_image_path continua sendo o valor do campo image_url.
    // Se o campo image_url foi apagado e nenhum novo arquivo enviado, $final_image_path será null/empty.

    if (empty($title) || empty($content)) {
        $_SESSION['update_error_message'] = "Título e Conteúdo são obrigatórios!";
        header("Location: edit_post.php?id=" . $post_id);
        exit;
    }

    $sql = "UPDATE posts SET title = ?, content = ?, image_url = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    if ($stmt) {
        $stmt->bind_param("sssi", $title, $content, $final_image_path, $post_id);
        if ($stmt->execute()) {
            $_SESSION['update_success_message'] = "Post atualizado com sucesso!";
        } else {
            $_SESSION['update_error_message'] = "Erro ao atualizar o post: " . $stmt->error;
        }
        $stmt->close();
    } else {
        $_SESSION['update_error_message'] = "Erro ao preparar a query de atualização: " . $conn->error;
    }
    header("Location: edit_post.php?id=" . $post_id);
    exit;

} else {
    $_SESSION['update_error_message'] = "Método não permitido.";
    header('Location: admin.php'); // Redireciona se não for POST
    exit;
}

$conn->close();
?>