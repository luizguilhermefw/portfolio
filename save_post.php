<?php
// save_post.php
session_start(); // Inicia a sessão

// Verifica se o admin está logado
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    $_SESSION['save_error_message'] = "Acesso não autorizado."; // Usar sessão para erro
    header('Location: login.php'); // Redirecionar para login
    exit;
}

// 1. Configurações do Banco de Dados
require_once 'db_config.php';

// 2. Criar a conexão
$conn = new mysqli($servername, $username_db, $password_db, $dbname);

// Checar a conexão
if ($conn->connect_error) {
    $_SESSION['save_error_message'] = "Falha na conexão com o banco de dados: " . $conn->connect_error;
    header('Location: admin.php'); // Redirecionar para admin com erro
    exit;
}

// Definir o charset para UTF-8 (bom para acentos e caracteres especiais)
$conn->set_charset("utf8mb4");

// 3. Verificar se os dados foram enviados via POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // 4. Obter os dados do formulário
    // Usamos htmlspecialchars para prevenir XSS básico
    $title = isset($_POST['title']) ? htmlspecialchars($_POST['title']) : '';
    // Permitir HTML básico no conteúdo. Para produção, usar uma biblioteca como HTML Purifier.
    $raw_content = isset($_POST['content']) ? $_POST['content'] : '';
    $allowed_tags = '<p><a><img><b><strong><i><em><ul><ol><li><br><h2><h3><h4><h5><h6><blockquote><code><pre>';
    $content = strip_tags($raw_content, $allowed_tags);


    $image_url_input = isset($_POST['image_url']) ? htmlspecialchars($_POST['image_url']) : null;

    $final_image_path = null; // Caminho final da imagem a ser salvo no BD

    // Lógica de Upload de Arquivo
    // Verifica se o campo 'image_file' foi enviado e não houve erro no upload
    if (isset($_FILES['image_file']) && $_FILES['image_file']['error'] == UPLOAD_ERR_OK) {
        $upload_dir = 'uploads/'; // Pasta de destino dos uploads
        // Cria a pasta 'uploads' se ela não existir
        if (!is_dir($upload_dir)) {
            if (!mkdir($upload_dir, 0755, true)) {
                $_SESSION['save_error_message'] = "Erro ao criar o diretório de uploads.";
                header('Location: admin.php');
                exit;
            }
        }

        $file_tmp_path = $_FILES['image_file']['tmp_name']; // Caminho temporário do arquivo
        $file_name = basename($_FILES['image_file']['name']); // Nome original do arquivo
        $file_size = $_FILES['image_file']['size']; // Tamanho do arquivo
        $file_type = $_FILES['image_file']['type']; // Tipo MIME do arquivo
        $file_ext_array = explode('.', $file_name);
        $file_ext = strtolower(end($file_ext_array)); // Extensão do arquivo

        $allowed_extensions = ['jpg', 'jpeg', 'png', 'gif'];
        $max_file_size = 2 * 1024 * 1024; // 2MB em bytes

        if (in_array($file_ext, $allowed_extensions)) {
            if ($file_size <= $max_file_size) {
                // Gerar nome único para o arquivo para evitar sobrescrever arquivos existentes
                $new_file_name = uniqid('postimg_', true) . '.' . $file_ext;
                $dest_path = $upload_dir . $new_file_name;

                if (move_uploaded_file($file_tmp_path, $dest_path)) {
                    $final_image_path = $dest_path; // Salva o caminho relativo (ex: "uploads/nome_do_arquivo.jpg")
                } else {
                    $_SESSION['save_error_message'] = "Erro: Falha ao mover o arquivo enviado para o destino.";
                    header('Location: admin.php');
                    exit;
                }
            } else {
                $_SESSION['save_error_message'] = "Erro: O arquivo enviado é muito grande. O tamanho máximo permitido é 2MB.";
                header('Location: admin.php');
                exit;
            }
        } else {
            $_SESSION['save_error_message'] = "Erro: Tipo de arquivo não permitido. Apenas JPG, JPEG, PNG e GIF são aceitos.";
            header('Location: admin.php');
            exit;
        }
    } elseif (!empty($image_url_input)) {
        // Se não houve upload de arquivo, mas uma URL foi fornecida, usa a URL
        $final_image_path = $image_url_input;
    }
    // Se nem upload nem URL foram fornecidos, $final_image_path permanecerá null.

    // 5. Validar os dados (simples validação por enquanto)
    if (empty($title) || empty($content)) {
        $_SESSION['save_error_message'] = "Erro: Título e Conteúdo são obrigatórios!";
        header('Location: admin.php');
        exit;

    } else {
        // 6. Preparar a instrução SQL para inserir os dados
        // Usamos prepared statements para prevenir SQL Injection

        $sql = "INSERT INTO posts (title, content, image_url) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);

        if ($stmt) {
            // 'sss' significa que estamos passando três strings como parâmetros.
            // $final_image_path conterá o caminho do arquivo upado ou a URL, ou null se nenhum for fornecido.
            $stmt->bind_param("sss", $title, $content, $final_image_path);

            // Executar a instrução
            if ($stmt->execute()) {
                $_SESSION['save_success_message'] = "Novo post salvo com sucesso!";
            } else {
                $_SESSION['save_error_message'] = "Erro ao salvar o post: " . $stmt->error;
            }
            $stmt->close();
        } else {
            $_SESSION['save_error_message'] = "Erro ao preparar a query de salvamento: " . $conn->error;
        }
    }
    header('Location: admin.php');
    exit;

} else {
    // Se não for POST, redirecionar ou mostrar erro
    $_SESSION['save_error_message'] = "Método não permitido.";
    header('Location: admin.php');
    exit;
}

// Fechar a conexão com o banco
$conn->close();
?>
