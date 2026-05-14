import { get, post } from "./api.js";
import { createEmptyRow, formatDateTime, setFeedback } from "./utils.js";

async function carregarMovimentacoes() {
  return get("/movimentacoes");
}

async function criarMovimentacao(form) {
  const formData = new FormData(form);
  const observacao = String(formData.get("observacao") || "").trim();

  return post("/movimentacoes", {
    tipo: String(formData.get("tipo") || "").trim(),
    quantidade: Number(formData.get("quantidade")),
    observacao: observacao || undefined,
    produto_id: Number(formData.get("produto_id")),
  });
}

async function reverterMovimentacao(id) {
  return post(`/movimentacoes/${id}/reverter`, {});
}

function isMovimentacaoDeReversao(observacao) {
  if (!observacao) {
    return false;
  }

  const normalizedValue = observacao
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  return normalizedValue.startsWith("reversao da movimentacao ");
}

function renderizarMovimentacoes(movimentacoes, tbody) {
  if (!movimentacoes.length) {
    tbody.innerHTML = createEmptyRow("Nenhuma movimentacao registrada.", 7);
    return;
  }

  tbody.innerHTML = movimentacoes
    .map((movimentacao) => {
      const statusClass = movimentacao.revertida ? "pill--revertida" : "pill--ativo";
      const statusText = movimentacao.revertida ? "Revertida" : "Ativa";
      const tipoClass = movimentacao.tipo === "entrada" ? "pill--entrada" : "pill--saida";
      const canRevert =
        !movimentacao.revertida && !isMovimentacaoDeReversao(movimentacao.observacao);

      return `
        <tr>
          <td>${movimentacao.id}</td>
          <td>${movimentacao.produto?.nome_produto || "-"}</td>
          <td><span class="pill ${tipoClass}">${movimentacao.tipo}</span></td>
          <td>${movimentacao.quantidade}</td>
          <td>${formatDateTime(movimentacao.dataMovimentacao)}</td>
          <td><span class="pill ${statusClass}">${statusText}</span></td>
          <td>
            ${
              canRevert
                ? `<button class="button button--ghost button--small" data-acao="reverter-movimentacao" data-id="${movimentacao.id}" type="button">Reverter</button>`
                : `<span class="empty-state">Sem acao</span>`
            }
          </td>
        </tr>
      `;
    })
    .join("");
}

function bindMovimentacaoActions({ form, feedback, tbody, refreshAll }) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      await criarMovimentacao(form);
      form.reset();
      setFeedback(feedback, "Movimentacao registrada com sucesso.", "success");
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

    if (target.dataset.acao !== "reverter-movimentacao") {
      return;
    }

    if (target.disabled || target.dataset.loading === "true") {
      return;
    }

    try {
      target.disabled = true;
      target.dataset.loading = "true";
      target.textContent = "Revertendo...";

      await reverterMovimentacao(target.dataset.id);
      setFeedback(feedback, "Movimentacao revertida com sucesso.", "success");
      await refreshAll();
    } catch (error) {
      target.disabled = false;
      target.dataset.loading = "false";
      target.textContent = "Reverter";
      setFeedback(feedback, error.message, "error");
    }
  });
}

export {
  bindMovimentacaoActions,
  carregarMovimentacoes,
  renderizarMovimentacoes,
};
