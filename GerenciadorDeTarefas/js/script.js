
const formTarefa = document.getElementById("formTarefa");
const descricaoTarefa = document.getElementById("descricaoTarefa");
const categoria = document.getElementById("categoria");
const prioridade = document.getElementById("prioridade");
const dataLimite = document.getElementById("dataLimite");
const btnAdicionar = document.getElementById("btnAdicionar");
const mensagemVazia = document.getElementById("mensagemVazia");
const listaTarefas = document.getElementById("listaTarefas");
const totalTarefas = document.getElementById("totalTarefas");
const tarefasPendentes = document.getElementById("tarefasPendentes");
const tarefasConcluidas = document.getElementById("tarefasConcluidas");
const filtroStatus = document.getElementById("filtroStatus");
const filtroCategoria = document.getElementById("filtroCategoria");

// Recupera as tarefas salvas ou começa com uma lista vazia
const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

// Salva as tarefas no navegador
function salvarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

// Atualiza os indicadores
function atualizarIndicadores() {
  totalTarefas.textContent = tarefas.length;

  let quantidadePendentes = 0;
  let quantidadeConcluidas = 0;

  for (let i = 0; i < tarefas.length; i++) {
    if (tarefas[i].concluida === true) {
      quantidadeConcluidas++;
    } else {
      quantidadePendentes++;
    }
  }

  tarefasPendentes.textContent = quantidadePendentes;
  tarefasConcluidas.textContent = quantidadeConcluidas;
}

// Exibe as tarefas conforme os filtros selecionados
function exibirTarefas() {
  // Limpa os cartões antigos da tela
  listaTarefas.innerHTML = "";

  // Controla a mensagem de lista vazia
  if (tarefas.length === 0) {
    mensagemVazia.style.display = "block";
  } else {
    mensagemVazia.style.display = "none";
  }

  const statusSelecionado = filtroStatus.value;
  const categoriaSelecionada = filtroCategoria.value;

  // Percorre todas as tarefas
  for (let i = 0; i < tarefas.length; i++) {
    const tarefa = tarefas[i];

    // Filtro por status
    const statusCorreto =
      statusSelecionado === "Todas" ||
      (statusSelecionado === "Pendentes" &&
        tarefa.concluida === false) ||
      (statusSelecionado === "Concluídas" &&
        tarefa.concluida === true);

    // Filtro por categoria
    const categoriaCorreta =
      categoriaSelecionada === "Todas" ||
      tarefa.categoria === categoriaSelecionada;

    // Pula as tarefas que não atendem aos filtros
    if (!statusCorreto || !categoriaCorreta) {
      continue;
    }

    // Cria o cartão da tarefa
    const elementoTarefa = document.createElement("div");
    elementoTarefa.classList.add("tarefa");

    // Descrição
    const paragrafo = document.createElement("p");
    paragrafo.textContent = tarefa.descricao;

    // Categoria
    const paragrafoCategoria = document.createElement("p");
    paragrafoCategoria.textContent = tarefa.categoria;

    // Prioridade
    const paragrafoPrioridade = document.createElement("p");
    paragrafoPrioridade.textContent = tarefa.prioridade;

    // Data de conclusão
    const paragrafoDataLimite = document.createElement("p");
    paragrafoDataLimite.textContent = tarefa.dataLimite;

    // Status da tarefa
    const paragrafoStatus = document.createElement("p");

    if (tarefa.concluida) {
      paragrafoStatus.textContent = "Concluída";
      elementoTarefa.classList.add("concluida");
    } else {
      paragrafoStatus.textContent = "Pendente";
    }

    // Botão Concluir / Desfazer
    const botaoConcluir = document.createElement("button");

    if (tarefa.concluida) {
      botaoConcluir.textContent = "Desfazer";
    } else {
      botaoConcluir.textContent = "Concluir";
    }

    // Evento do botão Concluir / Desfazer
    botaoConcluir.addEventListener("click", function () {
      // Inverte o estado da tarefa
      tarefa.concluida = !tarefa.concluida;

      // Salva a alteração
      salvarTarefas();

      // Atualiza os indicadores e a tela
      atualizarIndicadores();
      exibirTarefas();
    });

    // Botão Excluir
    const botaoExcluir = document.createElement("button");
    botaoExcluir.textContent = "Excluir";

    // Evento do botão Excluir
    botaoExcluir.addEventListener("click", function () {
      const confirmarExclusao = confirm(
        "Tem certeza que deseja excluir esta tarefa?"
      );

      if (confirmarExclusao === true) {
        const indice = tarefas.indexOf(tarefa);

        // Remove a tarefa do array
        tarefas.splice(indice, 1);

        // Salva a exclusão
        salvarTarefas();

        // Atualiza os indicadores e a tela
        atualizarIndicadores();
        exibirTarefas();
      }
    });

    // Coloca as informações dentro do cartão
    elementoTarefa.appendChild(paragrafo);
    elementoTarefa.appendChild(paragrafoCategoria);
    elementoTarefa.appendChild(paragrafoPrioridade);
    elementoTarefa.appendChild(paragrafoDataLimite);
    elementoTarefa.appendChild(paragrafoStatus);
    elementoTarefa.appendChild(botaoConcluir);
    elementoTarefa.appendChild(botaoExcluir);

    // Coloca o cartão na página
    listaTarefas.appendChild(elementoTarefa);
  }
}

// Atualiza a visualização quando os filtros mudam
function filtrarTarefas() {
  exibirTarefas();
}

filtroStatus.addEventListener("change", filtrarTarefas);
filtroCategoria.addEventListener("change", filtrarTarefas);

// Cadastro de novas tarefas
formTarefa.addEventListener("submit", function (event) {
  event.preventDefault();

  // Validação básica
  if (
    descricaoTarefa.value.trim() === "" ||
    dataLimite.value === ""
  ) {
    alert("Preencha a descrição e a data da tarefa.");
    return;
  }

  // Cria uma nova tarefa
  const novaTarefa = {
    descricao: descricaoTarefa.value.trim(),
    categoria: categoria.value,
    prioridade: prioridade.value,
    dataLimite: dataLimite.value,
    concluida: false,
  };

  // Adiciona a tarefa ao array
  tarefas.push(novaTarefa);

  // Salva no localStorage
  salvarTarefas();

  // Atualiza os indicadores e a lista
  atualizarIndicadores();
  exibirTarefas();

  // Limpa os campos do formulário
  formTarefa.reset();
});

// Inicializa a página com as tarefas salvas
atualizarIndicadores();
exibirTarefas();
