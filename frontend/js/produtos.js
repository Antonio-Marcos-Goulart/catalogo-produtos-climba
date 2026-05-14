import { get, post, put, remove } from "./api.js";
import { createEmptyRow, formatCurrency, setFeedback } from "./utils.js";

const LOW_STOCK_LIMIT = 5;

async function carregarProdutos() {
  return get("/produtos");
}

function getPayloadFromForm(form) {
  const formData = new FormData(form);

  return {
    nome_produto: String(formData.get("nome_produto") || "").trim(),
    descricao_produto: String(formData.get("descricao_produto") || "").trim(),
    preco: Number(formData.get("preco")),
    estoque_disponivel: Number(formData.get("estoque_disponivel")),
    categoria_id: Number(formData.get("categoria_id")),
  };
}

async function criarProduto(form) {
  return post("/produtos", getPayloadFromForm(form));
}

async function atualizarProduto(id, form) {
  return put(`/produtos/${id}`, getPayloadFromForm(form));
}

async function excluirProduto(id) {
  return remove(`/produtos/${id}`);
}

function renderizarProdutos(produtos, tbody) {
  if (!produtos.length) {
    tbody.innerHTML = createEmptyRow("Nenhum produto cadastrado.", 6);
    return;
  }

  tbody.innerHTML = produtos
    .map((produto) => {
      const lowStock = Number(produto.estoque_disponivel) < LOW_STOCK_LIMIT;

      return `
        <tr class="${lowStock ? "row--low-stock" : ""}">
          <td>${produto.id}</td>
          <td>
            <strong>${produto.nome_produto}</strong><br />
            <small>${produto.descricao_produto}</small>
          </td>
          <td>${produto.categoria?.nome || "-"}</td>
          <td>${formatCurrency(produto.preco)}</td>
          <td>
            ${produto.estoque_disponivel}
            ${lowStock ? '<span class="pill pill--warning">Baixo</span>' : ""}
          </td>
          <td>
            <button class="button button--ghost button--small" data-acao="editar-produto" data-id="${produto.id}" type="button">
              Editar
            </button>
            <button class="button button--danger button--small" data-acao="excluir-produto" data-id="${produto.id}" type="button">
              Excluir
            </button>
          </td>
        </tr>
      `;
    })
    .join("");
}

function preencherSelectProdutos(produtos, select) {
  const currentValue = select.value;
  const options = produtos
    .map(
      (produto) =>
        `<option value="${produto.id}">${produto.nome_produto}</option>`,
    )
    .join("");

  select.innerHTML = `<option value="">Selecione um produto</option>${options}`;
  select.value = produtos.some((produto) => String(produto.id) === currentValue)
    ? currentValue
    : "";
}

function bindProdutoActions({
  form,
  feedback,
  tbody,
  refreshAll,
  idInput,
  submitButton,
  cancelButton,
}) {
  let currentProducts = [];

  const setEditMode = (produto) => {
    idInput.value = String(produto.id);
    form.nome_produto.value = produto.nome_produto || "";
    form.descricao_produto.value = produto.descricao_produto || "";
    form.preco.value = produto.preco || "";
    form.estoque_disponivel.value = produto.estoque_disponivel || 0;
    form.categoria_id.value = String(produto.categoria?.id || "");
    submitButton.textContent = "Atualizar produto";
    cancelButton.classList.remove("is-hidden");
  };

  const clearEditMode = () => {
    idInput.value = "";
    form.reset();
    submitButton.textContent = "Salvar produto";
    cancelButton.classList.add("is-hidden");
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      if (idInput.value) {
        await atualizarProduto(idInput.value, form);
        setFeedback(feedback, "Produto atualizado com sucesso.", "success");
      } else {
        await criarProduto(form);
        setFeedback(feedback, "Produto salvo com sucesso.", "success");
      }

      clearEditMode();
      currentProducts = await refreshAll();
    } catch (error) {
      setFeedback(feedback, error.message, "error");
    }
  });

  cancelButton.addEventListener("click", () => {
    clearEditMode();
    setFeedback(feedback, "", "");
  });

  tbody.addEventListener("click", async (event) => {
    const target = event.target;

    if (!(target instanceof HTMLButtonElement)) {
      return;
    }

    if (target.dataset.acao === "editar-produto") {
      const produto = currentProducts.find(
        (currentProduct) => String(currentProduct.id) === String(target.dataset.id),
      );

      if (!produto) {
        setFeedback(feedback, "Produto nao encontrado para edicao.", "error");
        return;
      }

      setEditMode(produto);
      setFeedback(feedback, "Edite os campos e salve para atualizar o produto.", "success");
      return;
    }

    if (target.dataset.acao !== "excluir-produto") {
      return;
    }

    try {
      await excluirProduto(target.dataset.id);

      if (String(idInput.value) === String(target.dataset.id)) {
        clearEditMode();
      }

      setFeedback(feedback, "Produto excluido com sucesso.", "success");
      currentProducts = await refreshAll();
    } catch (error) {
      setFeedback(feedback, error.message, "error");
    }
  });

  return {
    setProducts(produtos) {
      currentProducts = produtos;
    },
  };
}

export {
  bindProdutoActions,
  carregarProdutos,
  LOW_STOCK_LIMIT,
  preencherSelectProdutos,
  renderizarProdutos,
};
