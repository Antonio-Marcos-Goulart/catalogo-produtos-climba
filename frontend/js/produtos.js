import { get, post, remove } from "./api.js";
import { createEmptyRow, formatCurrency, setFeedback } from "./utils.js";

const LOW_STOCK_LIMIT = 5;

async function carregarProdutos() {
  return get("/produtos");
}

async function criarProduto(form) {
  const formData = new FormData(form);

  return post("/produtos", {
    nome_produto: String(formData.get("nome_produto") || "").trim(),
    descricao_produto: String(formData.get("descricao_produto") || "").trim(),
    preco: Number(formData.get("preco")),
    estoque_disponivel: Number(formData.get("estoque_disponivel")),
    categoria_id: Number(formData.get("categoria_id")),
  });
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
    .map(
      (produto) => {
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
            <button class="button button--danger button--small" data-acao="excluir-produto" data-id="${produto.id}" type="button">
              Excluir
            </button>
          </td>
        </tr>
      `;
      },
    )
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

function bindProdutoActions({ form, feedback, tbody, refreshAll }) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      await criarProduto(form);
      form.reset();
      setFeedback(feedback, "Produto salvo com sucesso.", "success");
      await refreshAll();
    } catch (error) {
      setFeedback(feedback, error.message, "error");
    }
  });

  tbody.addEventListener("click", async (event) => {
    const target = event.target;

    if (!(target instanceof HTMLButtonElement)) {
      return;
    }

    if (target.dataset.acao !== "excluir-produto") {
      return;
    }

    try {
      await excluirProduto(target.dataset.id);
      setFeedback(feedback, "Produto excluido com sucesso.", "success");
      await refreshAll();
    } catch (error) {
      setFeedback(feedback, error.message, "error");
    }
  });
}

export {
  bindProdutoActions,
  carregarProdutos,
  LOW_STOCK_LIMIT,
  preencherSelectProdutos,
  renderizarProdutos,
};
