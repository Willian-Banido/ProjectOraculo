const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./JS/db'); // Importa a conexão com o banco
const app = express();
const port = 5500;

// Usando JSON para requisições
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de teste
app.get('/', (req, res) => {
  res.send('Servidor está funcionando!');
});

// Rota de registro de usuário
app.post('/registrar', (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  // Criptografar a senha
  bcrypt.hash(senha, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: 'Erro ao criptografar senha' });

    // Inserir no banco de dados
    const sql = 'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)';
    db.query(sql, [nome, email, hashedPassword, tipo], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao registrar usuário' });
      }
      res.status(201).json({ message: 'Usuário registrado com sucesso' });
    });
  });
});

// Rota de login de usuário
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  const sql = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(sql, [email], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao consultar usuário' });
    }
    if (result.length === 0) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    const usuario = result[0];
    bcrypt.compare(senha, usuario.senha, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao comparar senhas' });
      }
      if (!isMatch) {
        return res.status(400).json({ error: 'Senha incorreta' });
      }

      // Aqui você pode gerar um token JWT ou iniciar uma sessão
      res.status(200).json({ message: 'Login bem-sucedido' });
    });
  });
});

// Rota para adicionar arquivos (somente para professores)
app.post('/arquivos', (req, res) => {
  const { nome, caminho } = req.body;
  const usuario_id = req.body.usuario_id;  // Em um sistema real, o ID seria extraído do JWT ou sessão
  
  // Verifica se o usuário é professor
  const sql = 'SELECT tipo FROM usuarios WHERE id = ?';
  db.query(sql, [usuario_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao verificar tipo de usuário' });

    const tipo = result[0]?.tipo;
    if (tipo !== 'professor') {
      return res.status(403).json({ error: 'Apenas professores podem adicionar arquivos' });
    }

    const insertSql = 'INSERT INTO arquivos (nome, caminho_arquivo, criado_por) VALUES (?, ?, ?)';
    db.query(insertSql, [nome, caminho, usuario_id], (err, result) => {
      if (err) return res.status(500).json({ error: 'Erro ao adicionar arquivo' });

      res.status(201).json({ message: 'Arquivo adicionado com sucesso' });
    });
  });
});

// Rota para obter a lista de arquivos
app.get('/arquivos', (req, res) => {
  const sql = 'SELECT * FROM arquivos';
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao consultar arquivos' });
    res.status(200).json(result);
  });
});

// Rota para fazer o download de um arquivo específico
app.get('/arquivos/:id/download', (req, res) => {
  const arquivoId = req.params.id;

  const sql = 'SELECT * FROM arquivos WHERE id = ?';
  db.query(sql, [arquivoId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao consultar arquivo' });
    if (result.length === 0) return res.status(404).json({ error: 'Arquivo não encontrado' });

    const caminho = result[0].caminho_arquivo;
    res.download(caminho);  // Realiza o download do arquivo
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

// Função de login
function login() {
    const email = document.getElementById('loginEmail').value;
    const senha = document.getElementById('loginPassword').value;

    // Enviar a requisição para a rota de login no backend
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })  // Passa os dados de login
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);  // Exibe a mensagem de sucesso
            // Aqui você pode redirecionar ou guardar um token, caso tenha implementado
            // window.location.href = '/dashboard'; // Exemplo de redirecionamento após login
        } else {
            alert(data.error);  // Exibe a mensagem de erro
        }
    })
    .catch(error => {
        console.error('Erro ao fazer login:', error);
        alert('Erro ao fazer login. Tente novamente.');
    });
}

// Função de cadastro
function register() {
    const nome = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const senha = document.getElementById('registerPassword').value;

    // Enviar a requisição para a rota de cadastro no backend
    fetch('/registrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, email, senha, tipo: 'aluno' })  // 'aluno' é o tipo padrão, pode ser ajustado conforme necessidade
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);  // Exibe a mensagem de sucesso
            toggleForm('login');  // Alterna para o formulário de login após cadastro
        } else {
            alert(data.error);  // Exibe a mensagem de erro
        }
    })
    .catch(error => {
        console.error('Erro ao registrar:', error);
        alert('Erro ao registrar. Tente novamente.');
    });
}