
const bcrypt = require('bcrypt');
const express = require('express');
const path = require('path');
const { JsonDB, Config } = require('node-json-db');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota para a página inicial (DEVE vir antes do static)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'scr', 'login.html'));
});

// Serve arquivos estáticos (CSS, JS, etc.) da pasta 'scr'
app.use(express.static('scr'));

// Cria a instância do banco de dados
const db = new JsonDB(new Config('db', true, false, '/'));

app.post('/criar', async (req, res) => {
  const{email,senha} = req.body;

  //Validação de campos
  if (!email || !senha) {
    return res.status(400).send('Prencha todos os campos !');
  }

  try {
    //2. Pegar usuários existentes
    const usuarios = await db.getData("/usuarios");

    //3.Verificar se já existe
    const usuario = usuarios.find(u => u.email === email);

    if(usuario) {
      return res.status(400).send("Email já cadastrado !")
    }

    //4. criptografar senha
    const senhaHash = await bcrypt.hash(senha, 10);

    //5.Salvar no banco de dados
    await db.push("/usuarios[]", {
      email,
      senha: senhaHash
    });

    res.send("Conta criada com sucesso !");

  } catch (error) {
    console.error(error)
    return res.status(500).send('Erro ao criar conta !')
  }
  });


  // Login
app.post("/login", async (req, res) => {
  const {email, senha} = req.body;

  try {
    const usuarios = await db.getData("/usuarios");

    const usuario = usuarios.find(u => u.email === email);

    if(!usuario) {
      return res.status(400).send("Usuário não encontrado !");
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(400).send("Senha Incorreta !");
    }

    res.send("Login realizado com sucesso !!")

  } catch (error) {
    console.error(error)
    return res.status(500).send("Erro no login !");
  }
});

// Rota para registrar um usuário
app.post('/registrar', async (req, res) => {
  const { email, senha } = req.body;

  if(!email || !senha) {
    return res.status(400).send('Dados invalidos!');
  }


  try {

    const usuarios = db.getData("/usuarios");

    const existe = usuarios.find(u => u.email === email);

    if (existe) {
    return res.status(400).send("Email já cadastrado!");
    };

    const senhaHash = await bcrypt.hash(senha,10);
    await db.push(`/usuarios[]`, { email, senha: senhaHash });
    res.send('Usuário registrado!');
  } catch (error) {
    res.status(500).send('Erro ao salvar.');
  }
});

app.post('/salvar', async (req, res) => {
  const dadosParaSalvar = req.body;
  console.log('Dados recebidos:', dadosParaSalvar);

  if(!dadosParaSalvar.emails){
    return res.status(400).send('Dados invalidos !');
  }
  try {
    await db.push("/emails[]", dadosParaSalvar.emails);
    res.send("Dados salvos com sucesso !")
  } catch (error) {
    res.status(500).send('Erros ao salvar dados')
  }
});

app.get('/ler', (req, res)=>{
  try {
    const dados = db.getData("/emails");
    res.json(dados)
  } catch (error) {
    res.status(500).send('Erro ao ler os dados')
  }
});
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));  