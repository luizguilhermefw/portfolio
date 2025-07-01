<?php
session_start();
header('Content-Type: application/json');

// Verifica se o admin está logado
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode(['success' => false, 'error' => 'Acesso não autorizado.']);
    exit;
}

$response = ['success' => false, 'error' => 'Nenhum arquivo enviado ou erro desconhecido.'];

if (isset($_FILES['inline_image']) && $_FILES['inline_image']['error'] == UPLOAD_ERR_OK) {
    $upload_dir = 'uploads/'; // Mesma pasta de uploads
    if (!is_dir($upload_dir)) {
        if (!mkdir($upload_dir, 0755, true)) {
            $response['error'] = 'Falha ao criar diretório de uploads.';
            echo json_encode($response);
            exit;
        }
    }

    $file_tmp_path = $_FILES['inline_image']['tmp_name'];
    $file_name = basename($_FILES['inline_image']['name']);
    $file_size = $_FILES['inline_image']['size'];
    // $file_type = $_FILES['inline_image']['type']; // Pode ser usado para validação mais estrita
    $file_ext_array = explode('.', $file_name);
    $file_ext = strtolower(end($file_ext_array));

    $allowed_extensions = ['jpg', 'jpeg', 'png', 'gif'];
    $max_file_size = 2 * 1024 * 1024; // 2MB

    if (in_array($file_ext, $allowed_extensions)) {
        if ($file_size <= $max_file_size) {
            $new_file_name = 'inline_' . uniqid('', true) . '.' . $file_ext;
            $dest_path = $upload_dir . $new_file_name;

            if (move_uploaded_file($file_tmp_path, $dest_path)) {
                $response['success'] = true;
                $response['filePath'] = $dest_path; // Caminho relativo para usar no src da img
                unset($response['error']);
            } else {
                $response['error'] = 'Falha ao mover o arquivo enviado.';
            }
        } else {
            $response['error'] = 'Arquivo muito grande. Máximo 2MB.';
        }
    } else {
        $response['error'] = 'Tipo de arquivo não permitido (apenas JPG, JPEG, PNG, GIF).';
    }
} elseif (isset($_FILES['inline_image']['error'])) {
    // Mapear códigos de erro de upload para mensagens amigáveis
    $upload_errors = [
        UPLOAD_ERR_INI_SIZE   => 'O arquivo excede a diretiva upload_max_filesize no php.ini.',
        UPLOAD_ERR_FORM_SIZE  => 'O arquivo excede a diretiva MAX_FILE_SIZE especificada no formulário HTML.',
        UPLOAD_ERR_PARTIAL    => 'O upload do arquivo foi feito parcialmente.',
        UPLOAD_ERR_NO_FILE    => 'Nenhum arquivo foi enviado.',
        UPLOAD_ERR_NO_TMP_DIR => 'Faltando uma pasta temporária.',
        UPLOAD_ERR_CANT_WRITE => 'Falha ao escrever o arquivo no disco.',
        UPLOAD_ERR_EXTENSION  => 'Uma extensão do PHP interrompeu o upload do arquivo.',
    ];
    $error_code = $_FILES['inline_image']['error'];
    $response['error'] = isset($upload_errors[$error_code]) ? $upload_errors[$error_code] : 'Erro desconhecido no upload.';
}

echo json_encode($response);
?>
