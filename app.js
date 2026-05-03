const crypto = require('crypto');
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
      senha: senhaHash,
      resetToken: null,
      resetTokenExpira: null
    });

    res.send("Conta criada com sucesso !");

  } catch (error) {
    console.error(error)
    return res.status(500).send('Erro ao criar conta !')
  }
  });


  // ================== Login ==========================

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

//================= RECUPERAR SENHA ==========================

app.post('/recuperar', async(req, res) => {
  const {email} = req.body;

  try{
    const usuarios = await db.getData("/usuarios");

    const indice = usuarios.findIndex(u => u.email === email);

    if(indice === -1) {
      return res.status(400).send("Usuário não encontado");
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expira = Date.now() + 10 * 60 * 1000;
    
    usuarios[indice].resetToken = token;
    usuarios[indice].resetTokenExpira = expira;

    await db.push('/usuarios', usuarios);

    console.log('enviando JSON:', {token});
    res.json({ token });

    }catch(error){
      console.error(error)
      res.status(500).send("Erro ao gerar token");
    }
});

// ============ RESETAR SENHA COM TOKEN ====================
app.post('/resetar-senha/:token', async (req, res) => {
  const{token} = req.params;
  const{novaSenha} = req.body;

  try {
    console.log('token recebido:', token);
    const usuarios = await db.getData('/usuarios');
    console.log('tokens no banco:', usuarios.map(u => u.resetToken));

    const indice = usuarios.findIndex(u => u.resetToken === token && u.resetTokenExpira > Date.now());

    if(indice === -1) {
      return res.status(400).send('Token invalido ou expirado');
    }

    const senhaHash = await bcrypt.hash(novaSenha, 10);

    usuarios[indice].senha = senhaHash;
    usuarios[indice].resetToken = null;
    usuarios[indice].resetTokenExpira = null;

    await db.push('/usuarios', usuarios);

    res.send('Senha alterada com sucesso !');

  } catch (error) {
    console.error(error)
    res.status(500).send('Erro ao redefinir senha');
  }
})


app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));  