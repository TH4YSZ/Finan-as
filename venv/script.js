const tabela = document.querySelector('.tabela-js')

////////////// GET //////////////

axios.get('http://127.0.0.1:5000/list').then(function (resposta) {

    console.log(resposta.data);
    getData(resposta.data)
}).catch(function (error) {
    console.log(error)
})


function getData(dados) {
    const categorias = {};
  
    dados.forEach((item) => {
        tabela.innerHTML += `
          <tr>
            <th scope="row">${item.STATUS}</th>
            <td>${item.DESPESA}</td>
            <td>${item.VALOR}</td>
            <td>
              <button class="btn"><span class="material-symbols-outlined text-success" onclick="alterarStatus(${item.ID})">check</span></button>
              <button class="btn"><span class="material-symbols-outlined text-danger" onclick="excluirDespesa(${item.ID})">delete</span></button>
              <button class="btn"><span class="material-symbols-outlined text-success" onclick="atualizarDespesa('${item.DESPESA}', ${item.VALOR})">edit</span></button>
            </td>
          </tr>
      `;

        // Calcula o total gasto em cada categoria
        if (categorias[item.DESPESA]) {
            categorias[item.DESPESA] += item.VALOR;
        } else {
            categorias[item.DESPESA] = item.VALOR;
        }
    });

    // Exiba o total gasto por categoria
    displayTotalPorCategoria(categorias);
}

function displayTotalPorCategoria(categorias) {
    // Limpe o conteúdo existente
    const totalPorCategoriaContainer = document.getElementById('totalPorCategoria');
    totalPorCategoriaContainer.innerHTML = '';

    // Crie uma lista para exibir o total por categoria
    const listaTotalPorCategoria = document.createElement('ul');

    // Adicione cada categoria e seu total à lista
    for (const categoria in categorias) {
        const listItem = document.createElement('li');
        listItem.textContent = `${categoria}: R$ ${categorias[categoria].toFixed(2)}`;
        listaTotalPorCategoria.appendChild(listItem);
    }

    // Adicione a lista ao contêiner
    totalPorCategoriaContainer.appendChild(listaTotalPorCategoria);
}


////////////// POST //////////////
const addBtn = document.querySelector(".add_modal");

addBtn.addEventListener('click', function (event) {
    event.preventDefault();

    const categoriaInput = document.getElementById("categoria");
    const novaCategoria = categoriaInput.value;
    const valorInput = document.getElementById("valor");
    const novoValor = valorInput.value;

    if (novaCategoria !== "" && novoValor !== "") {
        axios.post('http://127.0.0.1:5000/add', { DESPESA: novaCategoria, VALOR: novoValor })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error('Erro na requisição POST', error);
            });

        categoriaInput.value = "";
        valorInput.value = "";
    } else {
        console.log("Erro: O campo de categoria ou valor está vazio.")
    }
});

// Atualizar Tarefa (PUT)
function atualizarDespesa(despesaAntiga, valorAntigo) {
    const despesaNova = prompt("Digite a nova categoria:", despesaAntiga);
    const valorNovo = prompt("Digite a nova categoria:", valorAntigo);

    if (despesaNova !== null) {
        axios.put('http://127.0.0.1:5000/updateDespesa', {
            "DESPESA_ANTIGA": despesaAntiga,
            "DESPESA_NOVA": despesaNova,
            "VALOR_ANTIGO": valorAntigo,
            "VALOR_NOVO": valorNovo
        })
            .then(function (resposta) {
                // Atualiza a tabela após atualizar a tarefa
                tabela.innerHTML = "";
                getData(resposta.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }}
// Excluir Tarefa (DELETE)
function excluirDespesa(tarefaId) {
    if (confirm(`Deseja realmente excluir a tarefa com ID ${tarefaId}?`)) {
        axios.delete(`http://127.0.0.1:5000/delete/${tarefaId}`)
            .then(function (resposta) {
                // Atualiza a tabela após excluir a tarefa
                tabela.innerHTML = "";
                getData(resposta.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

// Alterar Status (PUT)
function alterarStatus(tarefaId) {
    if (confirm(`Deseja realmente alterar o status da despesa com ID ${tarefaId}?`)) {
        axios.put(`http://127.0.0.1:5000/updateStatus/${tarefaId}`)
            .then(function (resposta) {
                // Atualiza a tabela após excluir a tarefa
                tabela.innerHTML = "";
                getData(resposta.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}
