import { get, post, remove } from "./api.js";
import { createEmptyRow, setFeedback } from "./utils.js";

async function carregarCategorias() {
  return get("/categorias");
}

async function criarCategoria(form) {
  const formData = new FormData(form);

  return post("/categorias", {
    nome: String(formData.get("nome") || "").trim(),
  });
}

async function excluirCategoria(id) {
  return remove(`/categorias/${id}`);
}

function renderizarCategorias(categorias, tbody) {
  if (!categorias.length) {
    tbody.innerHTML = createEmptyRow("Nenhuma categoria cadastrada.", 3);
    return;
  }

  tbody.innerHTML = categorias
    .map(
      (categoria) => `
        <tr>
          <td>${categoria.id}</td>
          <td>${categoria.nome}</td>
          <td>
            <button class="button button--danger button--small" data-acao="excluir-categoria" data-id="${categoria.id}" type="button">
              Excluir
            </button>
          </td>
        </tr>
      `,
    )
    .join("");
}

function preencherSelectCategorias(categorias, select) {
  const currentValue = select.value;
  const options = categorias
    .map(
      (categoria) =>
        `<option value="${categoria.id}">${categoria.nome}</option>`,
    )
    .join("");

  select.innerHTML = `<option value="">Selecione uma categoria</option>${options}`;
  select.value = categorias.some((categoria) => String(categoria.id) === currentValue)
    ? currentValue
    : "";
}

function bindCategoriaActions({ form, feedback, tbody, refreshAll }) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      await criarCategoria(form);
      form.reset();
      setFeedback(feedback, "Categoria salva com sucesso.", "success");
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

    if (target.dataset.acao !== "excluir-categoria") {
      return;
    }

    try {
      await excluirCategoria(target.dataset.id);
      setFeedback(feedback, "Categoria excluida com sucesso.", "success");
      await refreshAll();
    } catch (error) {
      setFeedback(feedback, error.message, "error");
    }
  });
}

export {
  bindCategoriaActions,
  carregarCategorias,
  preencherSelectCategorias,
  renderizarCategorias,
};
