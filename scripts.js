// Seleciona os elementos do formulário.
const form = document.querySelector('form');
const amount = document.getElementById('amount');
const expense = document.getElementById('expense');
const category = document.getElementById('category');

// Seleciona os elementos da lista.
const expenseList = document.querySelector('ul');
const expenseQuantity = document.querySelector('aside header p span')
const expenseTotal = document.querySelector('aside header h2')

// Captura o evento de input para formartar o valor.
amount.oninput = () => {
    // Obtem o valor atual do input e remove todos os caracteres não numéricos.
    let value = amount.value.replace(/\D/g, '');

    // Transformar o valor em centavos.
    value = Number(value) / 100;

    // Atualiza o valor do input.
    amount.value = formatCurrencyBRL(value);
}

function formatCurrencyBRL(value) {
    // Formata o valor para o formato de moeda brasileira.
    value = value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    })
    return value;
}

// Captura o evento de submit do formulário para obter os valores.
form.onsubmit = (event) => {
    // Previne o comportamento padrão de recarregar a pagina.
    event.preventDefault();

    // Cria um objeto com os detalhes na nova despesa.
    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date()
    };

    // Chama a função para adicionar a despesa.
    expenseAdd(newExpense);
}

// Adiciona um novo item na lista.
function expenseAdd(newExpense) {
    try {
        // Cria o elemento de li para adicionar na lista.
        const expenseItem = document.createElement('li');
        expenseItem.classList.add("expense")

        // Cria o icone da categoria.
        const expenseIcon = document.createElement('img');
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
        expenseIcon.setAttribute("alt", newExpense.category_name);

        // Cria a info da despesa.
        const expenseInfo = document.createElement('div');
        expenseInfo.classList.add("expense-info");

        // Cria o nome da despesa.
        const expenseName = document.createElement('strong');
        expenseName.textContent = newExpense.expense;

        // Cria a categoria da despesa.
        const expenseCategory = document.createElement('span');
        expenseCategory.textContent = newExpense.category_name;

        // Adiciona nome e categoria na div das informações da despesa.
        expenseInfo.append(expenseName, expenseCategory);

        // Cria o valor da despesa.
        const expenseAmount = document.createElement('span');
        expenseAmount.classList.add("expense-amount");
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace('R$', '')}`;

        // Cria o icone de remover.
        const removeIcon = document.createElement('img');
        removeIcon.classList.add("remove-icon");
        removeIcon.setAttribute("src", "img/remove.svg");
        removeIcon.setAttribute("alt", "Remover");

        // Adiciona as informações no item.
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);

        // Adiciona o item na lista.
        expenseList.append(expenseItem);

        // Limpa os campos do formulario.
        formClear();

        // Atualiza os totais.
        updateTotals()

    } catch (error) {
        console.error(error);
        alert("Não foi possível adicionar a despesa.");
    }
}

// Atualiza os totais.
function updateTotals() {
    try {
        // Recupera todos os itens (li) da lista (ul)
        const items = expenseList.children

        // Atualiza a quantidade de itens da lista.
        expenseQuantity.textContent = `${items.length} ${items.length > 1 ? 'despesas' : 'despesa'}`;

        //Variavel para incrementar o valor total.
        let total = 0;

        // Percorre cada item (li) da lista (ul).
        for (let item = 0; item < items.length; item++) {
            // Recupera o valor da despesa.
            const itemAmount = items[item].querySelector('.expense-amount');

            // Remover caracteres não numericos e substitui a virgula por ponto.
            let value = itemAmount.textContent.replace(/[^\d,]/g, '').replace(',', '.');

            // Converte o valor para float.
            value = parseFloat(value);

            // Verifica se é um numero valido.
            if (isNaN(value)) {
                return (alert("Não foi possivel calcular o total. O valor não parece ser um número."));
            }

            // Incrementa o valor total.
            total += value;

        }

        // Cria a span para adicionar o R$ formatado.
        const symbolBRL = document.createElement('small');
        symbolBRL.textContent = 'R$';

        // Formata o valor e remove o R$ que sera exibido pela small com um estilo customizado.
        total = formatCurrencyBRL(total).toUpperCase().replace('R$', '');

        // Limpa o conteudo do elemento.
        expenseTotal.innerHTML = '';

        // Adiciona o simbolo da moeda e o valor total formatado.
        expenseTotal.append(symbolBRL, total);

    } catch (error) {
        console.error(error);
        alert("Não foi possível atualizar os totais.");
    }
}

// Evento que captura o click no icone de remover.
expenseList.addEventListener('click', (event) => {
    // Verifica se o elemento clicado é o icone de remover.
    if (event.target.classList.contains('remove-icon')) {
        // Obtem a li pai do elemento clicado.
        const item = event.target.closest(".expense");

        // Remove o item da lista.
        item.remove();
    }
    // Atualiza os totais.
    updateTotals();
});

function formClear() {
    // Limpa os campos do formulario.
    expense.value = '';
    amount.value = '';
    category.value = '';

    // Coloca o foco no campo de despesa.
    expense.focus();
}