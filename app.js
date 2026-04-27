const express = require('express');
const path = require('path');
const { JsonDB, Config } = require('node-json-db');
const app = express();
const PORT = 3000;

app.use(express.json());

// Rota para a página inicial (DEVE vir antes do static)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'scr', 'login.html'));
});

// Serve arquivos estáticos (CSS, JS, etc.) da pasta 'scr'
app.use(express.static('scr'));

// Cria a instância do banco de dados
const db = new JsonDB(new Config('db', true, false, '/'));

// Rota para registrar um usuário
app.post('/registrar', async (req, res) => {
  const { email, senha } = req.body;
  try {
    await db.push(`/usuarios[]`, { email, senha: senha });
    res.send('Usuário registrado!');
  } catch (error) {
    res.status(500).send('Erro ao salvar.');
  }
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));   