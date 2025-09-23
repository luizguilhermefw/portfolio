<?php
header('Content-Type: application/json');
require_once 'db_config.php';
// Estabelece a conexão com o banco de dados
$conn = new mysqli($servername, $username_db, $password_db, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Falha na conexão com o banco de dados.']);
    exit();
}
$conn->set_charset("utf8mb4");

try {
    // 1. Obter categorias com contagem de posts
    $sql_categories = "SELECT category, COUNT(*) as post_count 
                       FROM posts 
                       WHERE category IS NOT NULL AND category != '' 
                       GROUP BY category 
                       ORDER BY post_count DESC";
    $result_categories = $conn->query($sql_categories);
    if ($result_categories === false) {
        throw new Exception('Erro ao buscar categorias: ' . $conn->error);
    }
    $categories = [];
    while ($row = $result_categories->fetch_assoc()) {
        $categories[] = $row;
    }
    $result_categories->free();

    // 2. Obter os 5 posts mais recentes
    $sql_recent = "SELECT id, title FROM posts ORDER BY created_at DESC LIMIT 5";
    $result_recent = $conn->query($sql_recent);
    if ($result_recent === false) {
        throw new Exception('Erro ao buscar posts recentes: ' . $conn->error);
    }
    $recent_posts = [];
    while ($row = $result_recent->fetch_assoc()) {
        $recent_posts[] = $row;
    }
    $result_recent->free();

    // 3. Montar a resposta
    $response = ['categories' => $categories, 'recent_posts' => $recent_posts];
    echo json_encode($response);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ocorreu um erro ao buscar os dados da sidebar: ' . $e->getMessage()]);
}

$conn->close();
?>