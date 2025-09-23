<?php
// get_posts.php

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

// Base da query SQL, já com o cálculo de likes e categoria
$sql = "SELECT p.id, p.title, p.content, p.image_url, p.created_at, p.category, COUNT(pl.id) as likes_count
        FROM posts p
        LEFT JOIN post_likes pl ON p.id = pl.post_id";

$conditions = [];
$params = [];
$types = '';

// Filtro por categoria
if (isset($_GET['category']) && !empty($_GET['category'])) {
    $conditions[] = "p.category = ?";
    $params[] = $_GET['category'];
    $types .= 's';
}

// Filtro por busca (pesquisa no título e no conteúdo)
if (isset($_GET['search']) && !empty($_GET['search'])) {
    $conditions[] = "(p.title LIKE ? OR p.content LIKE ?)";
    $searchTerm = '%' . $_GET['search'] . '%';
    $params[] = $searchTerm;
    $params[] = $searchTerm;
    $types .= 'ss';
}

// Adiciona as condições à query se existirem
if (count($conditions) > 0) {
    $sql .= " WHERE " . implode(' AND ', $conditions);
}

// Adiciona o agrupamento e ordenação
$sql .= " GROUP BY p.id, p.title, p.content, p.image_url, p.created_at, p.category ORDER BY p.created_at DESC";

try {
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        throw new Exception('Erro na preparação da query SQL: ' . $conn->error);
    }

    // Faz o bind dos parâmetros de forma compatível com versões mais antigas do PHP
    if (!empty($types)) {
        // A função bind_param precisa de referências, não de valores diretos.
        // Este é o método seguro para criar uma chamada dinâmica.
        $bind_params = [];
        $bind_params[] = $types; // O primeiro elemento é a string de tipos
        for ($i = 0; $i < count($params); $i++) {
            // Adiciona a referência de cada parâmetro ao array
            $bind_params[] = &$params[$i];
        }
        call_user_func_array([$stmt, 'bind_param'], $bind_params);
    }

    $stmt->execute();
    
    // Usar bind_result e fetch em um loop para máxima compatibilidade (evita get_result)
    $stmt->store_result();
    $stmt->bind_result($id, $title, $content, $image_url, $created_at, $category, $likes_count);

    $posts = [];
    while ($stmt->fetch()) {
        $posts[] = [
            'id' => $id,
            'title' => $title,
            'content' => $content,
            'image_url' => $image_url,
            'created_at' => $created_at,
            'category' => $category,
            'likes_count' => $likes_count
        ];
    }

    echo json_encode($posts);

    $stmt->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ocorreu um erro ao buscar os posts: ' . $e->getMessage()]);
}

$conn->close();
?>
