const transacoesUl = document.querySelector('#transactions');
const listarReceitas = document.querySelector('#money-plus');
const listarDespesas = document.querySelector('#money-minus');
const listarSaldoAtual = document.querySelector('#balance');
const form = document.querySelector('#form');
const inputNome = document.querySelector('#text');
const inputValor = document.querySelector('#amount');


const localStorageTransacoes = JSON.parse(localStorage.getItem('transacoes'));
let transacoes = localStorage.getItem('transacoes') !== null ? localStorageTransacoes : [];

const removeTransacao = ID => {
    transacoes = transacoes.filter(transacao => transacao.id !== ID);
    atualizarLocalStorage();
    init();
}

const addvaloresDom = transacao => {

    const converteValor = Math.abs(transacao.valor);
    const valorReal = converteValor.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
    const operador = transacao.valor < 0 ? '-' : '+';
    const classeCss = transacao.valor < 0 ? 'minus' : 'plus';
    const li = document.createElement('li');

    li.classList.add(classeCss);
    li.innerHTML = `
        ${transacao.nome}
        <span>${operador} R$ ${valorReal}</span>
        <button class="delete-btn" onClick="removeTransacao(${transacao.id})">
            x
        </button> 
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
        
    
    const totalReal = total.replace('.', ',');
    const receitasReal = receitas.replace('.', ',')
    const despesasReal = despesas.replace('.', ',');

    
    listarSaldoAtual.textContent = `R$ ${totalReal}`;
    listarReceitas.textContent = `R$ ${receitasReal}`;
    listarDespesas.textContent = `R$ ${despesasReal}`;    

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
    const valorTransacaoReal = valorTransacao.replace(',','.');
    

    if(nomeTransacao === '' || valorTransacaoReal === ''){
        alert('Digite todos os campos!');
        return;
    }

    const transacao = {id: gerarID(), nome: nomeTransacao, valor: Number(valorTransacaoReal)};

    transacoes.push(transacao);
    init();
    atualizarLocalStorage();

    inputNome.value = '';
    inputValor.value = '';
});


//MOSTRA A DATA NA TELA 

    monName = new Array ("Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho",  "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro")
    now = new Date

    const mesAno =  (monName [now.getMonth() ]   +  " / "  +     now.getFullYear ());

    // Exibe na tela usando a div#data-ano
    document.getElementById('mes-ano').innerHTML = mesAno;