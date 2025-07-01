<?php
// get_single_post.php

header('Content-Type: application/json'); // Sempre retornar JSON

// 1. Configurações do Banco de Dados
require_once 'db_config.php';

// Verificar se o ID foi passado
if (!isset($_GET['id']) || empty($_GET['id'])) {
    echo json_encode(['error' => 'ID do post não fornecido.']);
    exit();
}

$postId = intval($_GET['id']); // Garante que é um inteiro

if ($postId <= 0) {
    echo json_encode(['error' => 'ID do post inválido.']);
    exit();
}

// 2. Criar a conexão
$conn = new mysqli($servername, $username_db, $password_db, $dbname);

// Checar a conexão
if ($conn->connect_error) {
    echo json_encode(['error' => 'Falha na conexão com o banco de dados: ' . $conn->connect_error]);
    exit();
}

$conn->set_charset("utf8mb4");

// 3. Preparar e executar a consulta SQL para buscar um post específico
// Usar prepared statements para segurança
$sql = "SELECT id, title, content, image_url, created_at FROM posts WHERE id = ? LIMIT 1";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['error' => 'Erro ao preparar a query: ' . $conn->error]);
    $conn->close();
    exit();
}

$stmt->bind_param("i", $postId); // "i" significa que o parâmetro é um inteiro
$stmt->execute();
$result = $stmt->get_result();

$post = null;

if ($result) {
    if ($result->num_rows > 0) {
        $post = $result->fetch_assoc();
    } else {
        // Post não encontrado, mas não é um erro de query
        $post = ['error' => 'Post não encontrado com o ID fornecido.', 'id_not_found' => $postId];
    }
    $result->free();
} else {
    echo json_encode(['error' => 'Erro ao buscar o post: ' . $stmt->error]);
    $stmt->close();
    $conn->close();
    exit();
}

$stmt->close();
$conn->close();

// 4. Retornar o post como JSON
// Se $post for null (nenhuma linha encontrada), json_encode retornará 'null'
// Se tiver a chave 'error', o JS tratará isso.
echo json_encode($post);
?>
