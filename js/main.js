const transacoesUl = document.querySelector('#transactions');


const valorFicticio = [
    {id:1,nome: 'Salario',valor: +1200},
    {id:2,nome: 'Luz',valor: -135},
    {id:3,nome: 'Internet',valor: -120},
    {id:4,nome: 'Agua', valor: -80}
]

const addvaloresDom = transacao => {

    const converteValor = Math.abs(transacao.valor);
    const operador = transacao.valor < 0 ? '-' : '+';
    const classeCss = transacao.valor < 0 ? 'minus' : 'plus';
    const li = document.createElement('li');

    li.classList.add(classeCss);
    li.innerHTML = `
        ${transacao.nome} <span>${operador} R$ ${converteValor}</span><button class="delete-btn">x</button> 
    `;

    transacoesUl.append(li);
}

const atualizaValores = () => {

}

const init = () => {

    valorFicticio.forEach(addvaloresDom)
}

init();