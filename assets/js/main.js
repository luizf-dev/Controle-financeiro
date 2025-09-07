// * Seleciona os campos através dos ID's
const transacoesUl = document.querySelector('#transactions');
const listarReceitas = document.querySelector('#money-plus');
const listarDespesas = document.querySelector('#money-minus');
const listarSaldoAtual = document.querySelector('#balance');
const form = document.querySelector('#form');
const inputNome = document.querySelector('#text');
const inputValor = document.querySelector('#amount');
const checkboxDespesa = document.querySelector('#despesa');
const checkboxReceita = document.querySelector('#receita');

//* Controla as seleções dos checkbox para que ambos não fiquem selecionados
checkboxDespesa.addEventListener('click', () => {
  checkboxReceita.checked = false;
});

checkboxReceita.addEventListener('click', () => {
  checkboxDespesa.checked = false;
});

//* Recupera os registros do LocalStorage
const localStorageTransacoes = JSON.parse(localStorage.getItem('transacoes'));
let transacoes = localStorage.getItem('transacoes') !== null ? localStorageTransacoes : [];

// * Remove as transações
const removeTransacao = ID => {
    transacoes = transacoes.filter(transacao => transacao.id !== ID);
    atualizarLocalStorage();
    init();
}


//* Imprime na tela todas as transações registradas
const addvaloresDom = transacao => {

    const converteValor = transacao.valor.toLocaleString('pt-br', {minimumFractionDigits:2});
    const valorReal = converteValor;
    //const operador = transacao.valor < 0 ? '-' : '+';
    const classeCss = transacao.valor < 0 ? 'minus' : 'plus';
    const li = document.createElement('li');

    li.classList.add(classeCss);
    li.innerHTML = `
        <button class="delete-btn" onClick="removeTransacao(${transacao.id})">
           <i class="fa-solid fa-trash"></i>
        </button>
        <div>
          <strong>${transacao.nome}</strong><br>
          <small style="color: black; font-size: 8px;">${transacao.data}</small>
        </div>
        <span>${valorReal}</span>        
    `;

    transacoesUl.append(li);
}

// * Atualiza os valores das transações a cada registro inserido, seja despesa ou receita
const atualizaValores = () => {
    const valoresTransacoes = transacoes.map(transacao => transacao.valor);
    const total = valoresTransacoes.reduce((acumulado, transacao) => acumulado + transacao, 0);
    const receitas = valoresTransacoes
        .filter((value => value > 0))
        .reduce((acumulado, value) => acumulado + value, 0);
    const despesas = Math.abs(valoresTransacoes
        .filter((value => value < 0))
        .reduce((acumulado, value) => acumulado + value, 0));


    if(total > 0){
        var cor = '#2ecc71';
    }else if(total == 0){
        var cor = 'gray';
    }else{
        var cor = '#c0392b';
    }
    
    const totalReal = total.toLocaleString('pt-br', {minimumFractionDigits:2});
    const receitasReal = receitas.toLocaleString('pt-br', {minimumFractionDigits:2});
    const despesasReal =  despesas.toLocaleString('pt-br', {minimumFractionDigits:2});

    listarSaldoAtual.style.color = cor;
    
    listarSaldoAtual.textContent = `R$ ${totalReal}`;
    listarReceitas.textContent = `R$ ${receitasReal}`;
    listarDespesas.textContent = `R$ ${despesasReal}`; 
}


//* Funçao que inicia a aplicação, é executada logo após o carregamento da página
const init = () => {
     transacoesUl.innerHTML = '';

    const transacoesOrdenadas = [...transacoes].sort((a, b) => {
        // Primeiro separa receitas (+) e despesas (-)
        if (a.valor > 0 && b.valor < 0) return -1;
        if (a.valor < 0 && b.valor > 0) return 1;

        // Se forem do mesmo tipo, ordena pela data (mais recente primeiro)
        return new Date(b.dataISO) - new Date(a.dataISO);
    });

    transacoesOrdenadas.forEach(addvaloresDom);
    atualizaValores();
}

init();

//* Atualiza o localStorage após alguma ação de inclusão ou remoção de registros
const atualizarLocalStorage = () => {
    localStorage.setItem('transacoes', JSON.stringify(transacoes));
}


//* Gera um id aleatório para cada registro
const gerarID = () => Math.round(Math.random() * 1000);


//* Evento que captura os dados do formulário e envia para o LocalStorage
form.addEventListener('submit', evento => {
    evento.preventDefault();

    let tipoSelecionado;
    const nomeTransacao = inputNome.value.trim();
    const valorTransacao = inputValor.value.trim();
    const despesa = checkboxDespesa.value.trim();
    const receita = checkboxReceita.value.trim();
    const valorTransacaoSemMask = valorTransacao.replace(/\./g, '').replace(',', '.');
    const valorTransacaoReal = parseFloat(valorTransacaoSemMask);
    
    //* Verifica qual checkbox está selecionado, e atribui o tipo , despesa ou receita
    if(checkboxDespesa.checked){
        tipoSelecionado = despesa;
    }else if (checkboxReceita.checked){
        tipoSelecionado = receita;
    }      
    
    //* Verifica se os inputs foram preenchidos
    if(nomeTransacao === '' || valorTransacaoReal === ''){
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Ops! :(',
            text: 'Preencha todos os campos corretamente!',
            showConfirmButton: false,
            timer: 6000
          })
        return;
    }

    //* Verifica se algum checkbox está selecionado para capturar o tipo da transação(receita ou despesa)
    if(checkboxDespesa.checked == false && checkboxReceita.checked == false){
        Swal.fire({
            position: 'center',
            icon: 'question',
            title: 'Ops! :(',
            text: 'Selecione a modalidade da transação, "receita" ou "despesa!"',
            showConfirmButton: false,
            timer: 6000
          })
        return;
    }

    //* Concatena o tipo selecionado com o valor real da transação para que seja um número negativo ou positivo
    const valor = tipoSelecionado + valorTransacaoReal;

    //* converte a data **/
    const agora = new Date();
    const dataFormatada = agora.toLocaleDateString('pt-BR');
    const horaFormatada = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    
    //* Variável que guarda todos os valores para salvar no LocalStorage    
    const transacao = {
        id: gerarID(),
        nome: nomeTransacao,
        valor: Number(valor),
        tipo: tipoSelecionado,
        data: `${dataFormatada} - ${horaFormatada}`, // para exibir na tela
        dataISO: agora.toISOString() // para ordenar corretamente
    };

    //* Adiciona valores ao final do array, com o push() e cria u novo array, e atualiza o LocalStorage
    transacoes.push(transacao);
    init();
    atualizarLocalStorage();

    //*LImpa os campos dos inputs após o registro
    inputNome.value = '';
    inputValor.value = '';
});


    //* MOSTRA A DATA NA TELA 
    monName = new Array ("Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho",  "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro")
    now = new Date
    const mesAno =  (monName [now.getMonth() ]   +  " / "  +     now.getFullYear ());
    //*Exibe na tela usando a div#data-ano
    document.getElementById('mes-ano').innerHTML = mesAno;


//========== service worker para pwa ==========
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then(function (registration) {
        console.log('Service Worker registrado com sucesso:', registration.scope);
      })
      .catch(function (error) {
        console.error('Falha ao registrar o Service Worker:', error);
      });
  });
}