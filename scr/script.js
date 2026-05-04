document.addEventListener('DOMContentLoaded', function () {
    const botaoSalvar = document.getElementById('salvar-dados');


    let email = [];

    botaoSalvar.addEventListener('click', function(){

    const inputEmail = document.getElementById('usuemail');
    const valorEmail = inputEmail.value;
    const inputSenha = document.getElementById('usuSenha');
    const valorSenha = inputSenha.value;
    
    if (!valorEmail) {
        alert("Coloque o seu email antes de clicar em 'Recuperar' !");
        return;
    };

    const gmails = {
        SeuEmail: `Email: ${valorEmail}`
    };
    email.push(gmails);

    const dadosParaSalvar = {
        emails: gmails
    };

    

    fetch('http://localhost:3000/salvar', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(dadosParaSalvar)
        })
        .then(response => response.text())
        .then(resposta => {
            alert(resposta);
            inputEmail.value = "";
            inputSenha.value = "";
        })
        .catch(error => {
            console.error('Erro ao conectar:', error);
            alert("Erro: O servidor local não está ligado.");

});
});
});

// ================== LANDING-PAGE ===========================

// ================ PRIMEIRO CARD INTERATIVO =================
document.addEventListener('DOMContentLoaded', () => {
  const card = document.getElementById('abrir-form');
  const formulario = document.getElementById('formulario');

  if (card && formulario) {
    card.addEventListener('click', () => {
      formulario.classList.toggle('escondido');
    });
  } else {
    console.error('Elemento não encontrado: abrir-form ou formulario');
  }
});   

// ========== SEGUNDO CARD INTERATIVO ========================
document.addEventListener('DOMContentLoaded', () => {
  const card2 = document.getElementById('visualizar');
  const form = document.getElementById('dados-visu');

  if(card2 && form) {
    card2.addEventListener('click', () => {
      form.classList.toggle('escondido');
    });
  }else {
    console.error('Dados não encontrados');
  }
})