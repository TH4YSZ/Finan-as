const tabela = document.querySelector('.tabela-js')

////////////// GET //////////////

axios.get('http://127.0.0.1:5000/list').then(function (resposta) {

    console.log(resposta.data);
    getData(resposta.data)
}).catch(function (error) {
    console.log(error)
})


function getData(dados) {
    dados.map((item) => {
        tabela.innerHTML += `
      <tr>
        <th scope="row">${item.STATUS}</th>
        <td>${item.DESPESA}</td>
        <td>${item.VALOR}</td>
        <td>
        
        
        <span class="material-symbols-outlined text-success" onclick="alterarStatus(${item.ID})">
            check
        </span>


        <span class="material-symbols-outlined text-danger" onclick="excluirDespesa(${item.ID})">
            delete
        </span>

        <span class="material-symbols-outlined text-success" onclick="atualizarDespesa('${item.DESPESA}', ${item.VALOR})">
            edit
        </span>
        </td>
      </tr>
      `
    })
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

// Função para recarregar as tarefas
function carregarDespesas() {
axios.get(`http://127.0.0.1:5000/list`)
    .then(function (resposta) {
        getData(resposta.data);
    })
    .catch(function (error) {
        console.error(error);
    });
  }