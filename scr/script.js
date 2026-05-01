document.addEventListener('DOMContentLoaded', function () {
/* 
    const form = document.getElementById('form-login')

    form.addEventListener('submit', async(event) => {
        
        //Impede de recarregar à página
        event.preventDefault();
        
        const email = document.getElementById('usuemail');
        const senha
    })
    */
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
})