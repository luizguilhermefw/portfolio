<?php
session_start(); // Inicia a sessão no topo de tudo

// Se o admin já estiver logado, redireciona para a página admin
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    header('Location: admin.php');
    exit;
}

$error_message = '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Configurações do Banco de Dados
    require_once 'db_config.php';

    // Criar a conexão
    $conn = new mysqli($servername, $username_db, $password_db, $dbname);

    if ($conn->connect_error) {
        // Não use die() em produção real, mas para desenvolvimento é ok
        $error_message = "Falha na conexão com o banco: " . $conn->connect_error;
    } else {
        $conn->set_charset("utf8mb4");

        $username_form = $_POST['username']; 
        $password_form = $_POST['password']; 

        if (empty($username_form) || empty($password_form)) {
            $error_message = "Usuário e senha são obrigatórios.";
        } else {
            $sql = "SELECT id, username, password_hash FROM admins WHERE username = ? LIMIT 1";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $username_form);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows === 1) {
                $admin = $result->fetch_assoc();
                if (password_verify($password_form, $admin['password_hash'])) {
                    // Senha correta
                    $_SESSION['admin_logged_in'] = true;
                    $_SESSION['admin_id'] = $admin['id'];
                    $_SESSION['admin_username'] = $admin['username'];
                    header('Location: admin.php');
                    exit;
                } else {
                    $error_message = "Usuário ou senha inválidos.";
                }
            } else {
                $error_message = "Usuário ou senha inválidos.";
            }
            $stmt->close();
        }
        $conn->close();
    }
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Administrativo - Blog</title>
    <link rel="stylesheet" href="styleblog.css"> <!-- Usar o CSS do blog para a estrutura base -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-3G189CJSCG"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
    
      gtag('config', 'G-3G189CJSCG');
    </script>
    <style>
        /* Estilos específicos para o formulário de login dentro da estrutura do blog */
        .login-container {
            background-color: var(--card-background); /* Usar variável do tema */
            padding: 30px; border-radius: 8px;
            box-shadow: 0 0 15px rgba(0,255,255,0.2);
            color: var(--text-color); /* Usar variável do tema */
            width: 380px; /* Largura ajustada */
            text-align: center;
            margin: 50px auto; /* Centralizar e adicionar margem superior */
            position: relative; /* Para z-index funcionar se necessário */
            z-index: 1;
        }

        .login-avatar-image { /* Novo estilo para a imagem do avatar no login */
            width: 80px; /* Tamanho do avatar */
            height: 80px;
            border-radius: 50%; /* Para deixar redondo */
            object-fit: cover;
            margin-bottom: 15px; /* Espaço abaixo do avatar */
            border: 2px solid var(--accent-color);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .login-avatar-image:hover {
            transform: scale(1.1); 
            box-shadow: 0 0 15px var(--accent-color);
        }

        .login-container h1 { 
            color: var(--accent-color); /* Usar variável do tema */
            margin-bottom: 20px; 
        }
        .login-container input[type="text"], .login-container input[type="password"] {
            width: calc(100% - 22px); /* Ajustar para padding e border */
            padding: 10px; margin-bottom: 15px;
            border: 1px solid var(--border-color); /* Usar variável do tema */
            background-color: var(--secondary-color); /* Usar variável do tema */
            color: var(--text-color); /* Usar variável do tema */
            border-radius: 4px;
            font-family: 'Fira Code', monospace;
        }
        .login-container input[type="text"]:focus, .login-container input[type="password"]:focus {
            outline: none;
            border-color: var(--accent-color);
            box-shadow: 0 0 8px rgba(0, 255, 255, 0.3);
        }
        .login-container button { 
            padding: 10px 20px; 
            background-color: var(--accent-color); /* Usar variável do tema */
            color: var(--primary-color);  /* Usar variável do tema */
            border: none; border-radius: 4px; 
            cursor: pointer; font-weight: bold; 
            transition: background-color 0.3s ease, color 0.3s ease;
        }
        .login-container button:hover { 
            background-color: var(--text-color); /* Usar variável do tema */
            color: var(--primary-color); /* Usar variável do tema */
        }
        .error { color: #ff4d4d; margin-bottom: 15px; }
    </style>
</head>
<body>
    <div class="background">
        <canvas id="constellation-canvas"></canvas>
    </div>

    <header class="blog-header">
        <div class="header-title-group">
            <h1>Acesso Restrito</h1>
            <p>Área Administrativa do Blog</p>
        </div>
        <div class="header-actions">
            <a href="." class="btn-voltar-portfolio">Voltar ao Portfólio</a>
            <a href="blog" class="btn-voltar-portfolio">Voltar ao Blog</a>
        </div>
    </header>

    <main> 
        <div class="login-container">
            <!-- Imagem do avatar -->
            <img src="images_blog/avatarLuiz.png" alt="Admin Avatar" class="login-avatar-image">
            <h1>Login Administrativo</h1>
            <?php if (!empty($error_message)): ?>
                <p class="error"><?php echo htmlspecialchars($error_message); ?></p>
            <?php endif; ?>
            <form action="login.php" method="POST">
                <div>
                    <input type="text" id="username" name="username" placeholder="Usuário" required>
                </div>
                <div>
                    <input type="password" id="password" name="password" placeholder="Senha" required>
                </div>
                <div>
                    <button type="submit">Entrar</button>
                </div>
            </form>
        </div>
    </main>

    <button id="btnTopo" class="button-base" title="Subir para o topo">
        <i class="fas fa-rocket"></i>
    </button>
    
    <footer>
        <p><small>&copy; <?php echo date("Y"); ?> Blog de Luiz Guilherme Fernandes Wagner.</small></p>
    </footer>

    <script src="script_adm_shared.js"></script> 
</body>
</html>
