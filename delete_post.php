<?php
session_start();
header('Content-Type: application/json');

$response = ['success' => false, 'error' => 'Acesso não autorizado ou requisição inválida.'];

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    $response['error'] = 'Acesso não autorizado.';
    echo json_encode($response);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['post_id'])) {
    $post_id = intval($_POST['post_id']);

    if ($post_id <= 0) {
        $response['error'] = 'ID do post inválido.';
        echo json_encode($response);
        exit;
    }

    require_once 'db_config.php';

    $conn = new mysqli($servername, $username_db, $password_db, $dbname);

    if ($conn->connect_error) {
        $response['error'] = "Falha na conexão com o banco: " . $conn->connect_error;
        echo json_encode($response);
        exit;
    }
    $conn->set_charset("utf8mb4");

    // 1. Obter o image_url antes de deletar o post, para poder deletar o arquivo físico
    $image_url_to_delete = null;
    $sql_select_image = "SELECT image_url FROM posts WHERE id = ?";
    $stmt_select = $conn->prepare($sql_select_image);

    if ($stmt_select) {
        $stmt_select->bind_param("i", $post_id);
        $stmt_select->execute();
        $result_select = $stmt_select->get_result();
        if ($result_select->num_rows === 1) {
            $row = $result_select->fetch_assoc();
            $image_url_to_delete = $row['image_url'];
        }
        $stmt_select->close();
    } else {
        // Logar erro, mas não impedir a exclusão do post necessariamente
        error_log("Erro ao preparar query para buscar image_url (delete_post.php): " . $conn->error);
    }

    // 2. Deletar o post do banco de dados
    $sql_delete = "DELETE FROM posts WHERE id = ?";
    $stmt_delete = $conn->prepare($sql_delete);

    if ($stmt_delete) {
        $stmt_delete->bind_param("i", $post_id);
        if ($stmt_delete->execute()) {
            if ($stmt_delete->affected_rows > 0) {
                $response['success'] = true;
                unset($response['error']);

                // 3. Se o post foi deletado e tinha uma imagem local, tentar deletar o arquivo
                if ($image_url_to_delete && strpos($image_url_to_delete, 'uploads/') === 0 && file_exists($image_url_to_delete)) {
                    if (@unlink($image_url_to_delete)) { // O @ suprime erros de unlink, mas o log é melhor
                        $response['image_deleted_message'] = 'Arquivo de imagem associado excluído.';
                    } else {
                        $response['image_delete_error'] = 'Post excluído, mas falha ao deletar o arquivo de imagem associado.';
                        error_log("Falha ao deletar arquivo de imagem: " . $image_url_to_delete . " para post ID: " . $post_id);
                    }
                }
            } else {
                $response['error'] = 'Nenhum post encontrado com o ID fornecido para exclusão.';
            }
        } else {
            $response['error'] = "Erro ao excluir o post: " . $stmt_delete->error;
        }
        $stmt_delete->close();
    } else {
        $response['error'] = "Erro ao preparar a query de exclusão: " . $conn->error;
    }
    $conn->close();
}

echo json_encode($response);
?>