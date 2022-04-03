const transacoesUl = document.querySelector('#transactions');
const listarReceitas = document.querySelector('#money-plus');
const listarDespesas = document.querySelector('#money-minus');
const listarSaldoAtual = document.querySelector('#balance');
const form = document.querySelector('#form');
const inputNome = document.querySelector('#text');
const inputValor = document.querySelector('#amount');


const localStorageTransacoes = JSON.parse(localStorage.getItem('transacoes'));
let transacoes = localStorage.getItem('transacoes') !== null ? localStorageTransacoes : [];

const removerTransacao = ID => {
    transacoes = transacoes.filter(transacao => transacao.id !== ID);
    atualizarLocalStorage();
    console.log(removerTransacao);
}

const addvaloresDom = transacao => {

    const converteValor = Math.abs(transacao.valor);
    const operador = transacao.valor < 0 ? '-' : '+';
    const classeCss = transacao.valor < 0 ? 'minus' : 'plus';
    const li = document.createElement('li');

    li.classList.add(classeCss);
    li.innerHTML = `
        ${transacao.nome} <span>${operador} R$ ${converteValor}</span><button class="delete-btn" onClick="removerTransacao(${transacao.id})">x</button> 
    `;

    transacoesUl.append(li);
}

const atualizaValores = () => {
    const valoresTransacoes = transacoes.map(transacao => transacao.valor);
    const total = valoresTransacoes.reduce((acumulado, transacao) => acumulado + transacao, 0).toFixed(2);
    const receitas = valoresTransacoes
        .filter((value => value > 0))
        .reduce((acumulado, value) => acumulado + value, 0)
        .toFixed(2);
    const despesas = Math.abs(valoresTransacoes
        .filter((value => value < 0))
        .reduce((acumulado, value) => acumulado + value, 0))
        .toFixed(2);
    
    listarSaldoAtual.textContent = `R$ ${total}`;
    listarReceitas.textContent = `R$ ${receitas}`;
    listarDespesas.textContent = `R$ ${despesas}`;
}

const init = () => {
    transacoesUl.innerHTML = '';
    transacoes.forEach(addvaloresDom)
    atualizaValores();
}

init();

const atualizarLocalStorage = () => {
    localStorage.setItem('transacoes', JSON.stringify(transacoes));
}

const gerarID = () => Math.round(Math.random() * 1000);


/*======EVENTOS=============*/

form.addEventListener('submit', evento => {
    evento.preventDefault();

    const nomeTransacao = inputNome.value.trim();
    const valorTransacao = inputValor.value.trim();
    

    if(nomeTransacao === '' || valorTransacao === ''){
        alert('Digite todos os campos!');
        return;
    }

    const transacao = {id: gerarID, nome: nomeTransacao, valor: Number(valorTransacao)};

    transacoes.push(transacao);
    init();
    atualizarLocalStorage();

    inputNome.value = '';
    inputValor.value = '';
});



/**********************************************************************/
/* Função de mascaras do JQUERY MASK PLUGIN - Campo Valor R$    */
/*
    $(document).ready(function(){                                     
    $('.money').mask('000.000.000.000.000,00', {reverse: true});    
});
/**********************************************************************/