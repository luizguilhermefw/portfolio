<?php
// get_posts.php

// Suprimir a exibição de erros diretamente na saída para não quebrar o JSON
// Em um ambiente de produção, os erros devem ser logados, não exibidos.
// Para desenvolvimento, você pode comentar estas linhas para ver os erros PHP,
// mas lembre-se que eles quebrarão o parse do JSON no frontend.
error_reporting(0);
ini_set('display_errors', 0);

require_once 'db_config.php';

// 2. Criar a conexão
$conn = new mysqli($servername, $username_db, $password_db, $dbname);

// Checar a conexão
if ($conn->connect_error) {
   $response_data = ['error' => 'Falha na conexão com o banco de dados: ' . $conn->connect_error];
    header('Content-Type: application/json'); // Definir o header antes de qualquer saída
    echo json_encode($response_data);
    exit();
}

// Definir o charset para UTF-8
$conn->set_charset("utf8mb4");

// 3. Preparar e executar a consulta SQL para buscar os posts
$sql = "SELECT p.id, p.title, p.content, p.image_url, p.created_at, COUNT(pl.id) as likes_count
        FROM posts p
        LEFT JOIN post_likes pl ON p.id = pl.post_id
        GROUP BY p.id
        ORDER BY p.created_at DESC";
$result = $conn->query($sql);

$posts = [];

if ($result) {
    if ($result->num_rows > 0) {
        // Buscar os dados de cada linha
        while($row = $result->fetch_assoc()) {
            $posts[] = $row;
        }
    }
    $result->free(); // Liberar o resultado da memória
    $response_data = $posts; // Atribui os posts à resposta
} else {
    // Se houver erro na query
    $response_data = ['error' => 'Erro ao buscar os posts: ' . $conn->error];
}

// 4. Fechar a conexão com o banco
$conn->close();

// 5. Retornar os posts como JSON
header('Content-Type: application/json'); // Definir o header antes de qualquer saída
echo json_encode($response_data); // Envia a resposta final
?>
