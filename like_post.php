<?php
session_start(); 

require_once 'db_config.php';

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['post_id'])) {
    $post_id = intval($_POST['post_id']);
    $ip_address = $_SERVER['REMOTE_ADDR'];

    $conn = new mysqli($servername, $username_db, $password_db, $dbname);

    if ($conn->connect_error) {
        echo json_encode(['success' => false, 'error' => 'Connection failed: ' . $conn->connect_error]);
        exit;
    }
    $conn->set_charset("utf8mb4");

    // Verificar se este IP já curtiu este post
    $stmt_check = $conn->prepare("SELECT id FROM post_likes WHERE post_id = ? AND ip_address = ?");
    $stmt_check->bind_param("is", $post_id, $ip_address);
    $stmt_check->execute();
    $result_check = $stmt_check->get_result();

    $action_taken = '';

    if ($result_check->num_rows > 0) {
        // Já curtiu, então vamos remover o like (descurtir)
        $stmt_delete = $conn->prepare("DELETE FROM post_likes WHERE post_id = ? AND ip_address = ?");
        $stmt_delete->bind_param("is", $post_id, $ip_address);
        if (!$stmt_delete->execute()) {
             echo json_encode(['success' => false, 'error' => 'Erro ao descurtir: ' . $stmt_delete->error]);
             $stmt_delete->close();
             $stmt_check->close();
             $conn->close();
             exit;
        }
        $action_taken = 'unliked';
        $stmt_delete->close();
    } else {
        // Não curtiu, então vamos adicionar o like
        $stmt_insert = $conn->prepare("INSERT INTO post_likes (post_id, ip_address) VALUES (?, ?)");
        $stmt_insert->bind_param("is", $post_id, $ip_address);
        if (!$stmt_insert->execute()) {
            echo json_encode(['success' => false, 'error' => 'Erro ao curtir: ' . $stmt_insert->error]);
            $stmt_insert->close();
            $stmt_check->close();
            $conn->close();
            exit;
        }
        $action_taken = 'liked';
        $stmt_insert->close();
    }
    $stmt_check->close();

    // Obter a nova contagem de likes para o post
    $stmt_count = $conn->prepare("SELECT COUNT(id) as likes_count FROM post_likes WHERE post_id = ?");
    $stmt_count->bind_param("i", $post_id);
    $stmt_count->execute();
    $result_count = $stmt_count->get_result();
    $row_count = $result_count->fetch_assoc();
    $new_likes_count = $row_count['likes_count'];
    
    $stmt_count->close();
    $conn->close();

    echo json_encode(['success' => true, 'likes_count' => $new_likes_count, 'action' => $action_taken]);
    exit;
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request.']);
    exit;
}
?>