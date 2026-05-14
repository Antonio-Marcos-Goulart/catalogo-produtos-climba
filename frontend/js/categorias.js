import { get, post, put, remove } from "./api.js";
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

async function atualizarCategoria(id, form) {
  const formData = new FormData(form);

  return put(`/categorias/${id}`, {
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
            <button class="button button--ghost button--small" data-acao="editar-categoria" data-id="${categoria.id}" type="button">
              Editar
            </button>
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

function bindCategoriaActions({
  form,
  feedback,
  tbody,
  refreshAll,
  idInput,
  submitButton,
  cancelButton,
}) {
  let currentCategories = [];

  const setEditMode = (categoria) => {
    idInput.value = String(categoria.id);
    form.nome.value = categoria.nome || "";
    submitButton.textContent = "Atualizar categoria";
    cancelButton.classList.remove("is-hidden");
  };

  const clearEditMode = () => {
    idInput.value = "";
    form.reset();
    submitButton.textContent = "Salvar categoria";
    cancelButton.classList.add("is-hidden");
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      if (idInput.value) {
        await atualizarCategoria(idInput.value, form);
        setFeedback(feedback, "Categoria atualizada com sucesso.", "success");
      } else {
        await criarCategoria(form);
        setFeedback(feedback, "Categoria salva com sucesso.", "success");
      }

      clearEditMode();
      const data = await refreshAll();
      currentCategories = data?.categorias || [];
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

    if (target.dataset.acao === "editar-categoria") {
      const categoria = currentCategories.find(
        (currentCategory) => String(currentCategory.id) === String(target.dataset.id),
      );

      if (!categoria) {
        setFeedback(feedback, "Categoria nao encontrada para edicao.", "error");
        return;
      }

      setEditMode(categoria);
      setFeedback(feedback, "Edite o nome e salve para atualizar a categoria.", "success");
      return;
    }

    if (target.dataset.acao !== "excluir-categoria") {
      return;
    }

    try {
      await excluirCategoria(target.dataset.id);

      if (String(idInput.value) === String(target.dataset.id)) {
        clearEditMode();
      }

      setFeedback(feedback, "Categoria excluida com sucesso.", "success");
      const data = await refreshAll();
      currentCategories = data?.categorias || [];
    } catch (error) {
      setFeedback(feedback, error.message, "error");
    }
  });

  return {
    setCategories(categorias) {
      currentCategories = categorias;
    },
  };
}

export {
  bindCategoriaActions,
  carregarCategorias,
  preencherSelectCategorias,
  renderizarCategorias,
};
