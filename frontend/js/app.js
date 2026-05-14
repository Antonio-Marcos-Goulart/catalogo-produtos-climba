import { getAuth } from "./auth.js";
import {
  bindCategoriaActions,
  carregarCategorias,
  preencherSelectCategorias,
  renderizarCategorias,
} from "./categorias.js";
import { loadAuthenticatedUser, logout } from "./login.js";
import {
  bindMovimentacaoActions,
  carregarMovimentacoes,
  renderizarMovimentacoes,
} from "./movimentacoes.js";
import {
  bindProdutoActions,
  carregarProdutos,
  LOW_STOCK_LIMIT,
  preencherSelectProdutos,
  renderizarProdutos,
} from "./produtos.js";
import { formatDateTime, setFeedback } from "./utils.js";

const elements = {
  appShell: document.querySelector("#app-shell"),
  authUserName: document.querySelector("#auth-user-name"),
  logoutButton: document.querySelector("#logout-button"),
  categoriaForm: document.querySelector("#form-categoria"),
  categoriaFeedback: document.querySelector("#categoria-feedback"),
  categoriaTableBody: document.querySelector("#lista-categorias"),
  produtoForm: document.querySelector("#form-produto"),
  produtoFeedback: document.querySelector("#produto-feedback"),
  produtoTableBody: document.querySelector("#lista-produtos"),
  produtoCategoriaSelect: document.querySelector("#produto-categoria"),
  movimentacaoForm: document.querySelector("#form-movimentacao"),
  movimentacaoFeedback: document.querySelector("#movimentacao-feedback"),
  movimentacaoTableBody: document.querySelector("#lista-movimentacoes"),
  movimentacaoProdutoSelect: document.querySelector("#movimentacao-produto"),
  totalCategorias: document.querySelector("#total-categorias"),
  totalProdutos: document.querySelector("#total-produtos"),
  totalMovimentacoes: document.querySelector("#total-movimentacoes"),
  totalEstoqueBaixo: document.querySelector("#total-estoque-baixo"),
  badgeEstoqueBaixo: document.querySelector("#badge-estoque-baixo"),
  listaEstoqueBaixo: document.querySelector("#lista-estoque-baixo"),
  listaCategoriasResumo: document.querySelector("#lista-categorias-resumo"),
  listaMovimentacoesRecentes: document.querySelector("#lista-movimentacoes-recentes"),
};

function redirectToLogin() {
  window.location.href = "/login";
}

function showAppScreen(usuario) {
  elements.appShell.classList.remove("is-hidden");
  elements.authUserName.textContent = usuario?.nome || getAuth()?.usuario?.nome || "";
}

function atualizarResumo({ categorias, produtos, movimentacoes }) {
  const lowStockProducts = produtos.filter(
    (produto) => Number(produto.estoque_disponivel) < LOW_STOCK_LIMIT,
  );

  elements.totalCategorias.textContent = String(categorias.length);
  elements.totalProdutos.textContent = String(produtos.length);
  elements.totalMovimentacoes.textContent = String(movimentacoes.length);
  elements.totalEstoqueBaixo.textContent = String(lowStockProducts.length);
  elements.badgeEstoqueBaixo.textContent = `${lowStockProducts.length} itens`;
}

function renderDashboard({ produtos, movimentacoes }) {
  const lowStockProducts = produtos
    .filter((produto) => Number(produto.estoque_disponivel) < LOW_STOCK_LIMIT)
    .sort((first, second) => first.estoque_disponivel - second.estoque_disponivel);

  const productsByCategory = produtos.reduce((accumulator, produto) => {
    const categoryName = produto.categoria?.nome || "Sem categoria";
    accumulator[categoryName] = (accumulator[categoryName] || 0) + 1;
    return accumulator;
  }, {});

  const recentMovements = [...movimentacoes].slice(0, 5);

  if (!lowStockProducts.length) {
    elements.listaEstoqueBaixo.innerHTML =
      '<p class="empty-state">Nenhum produto com estoque crítico.</p>';
  } else {
    elements.listaEstoqueBaixo.innerHTML = lowStockProducts
      .map(
        (produto) => `
        <div class="insight-item">
          <div>
            <strong>${produto.nome_produto}</strong>
            <small>${produto.categoria?.nome || "Sem categoria"}</small>
          </div>
          <span class="insight-item__value">${produto.estoque_disponivel} un.</span>
        </div>
      `,
      )
      .join("");
  }

  const categoryItems = Object.entries(productsByCategory)
    .sort((first, second) => second[1] - first[1])
    .map(
      ([categoryName, total]) => `
        <div class="insight-item">
          <div>
            <strong>${categoryName}</strong>
            <small>Produtos cadastrados</small>
          </div>
          <span class="insight-item__value">${total}</span>
        </div>
      `,
    );

  if (!categoryItems.length) {
    elements.listaCategoriasResumo.innerHTML =
      '<p class="empty-state">Cadastre produtos para ver a distribuição por categoria.</p>';
  } else {
    elements.listaCategoriasResumo.innerHTML = categoryItems.join("");
  }

  if (!recentMovements.length) {
    elements.listaMovimentacoesRecentes.innerHTML =
      '<p class="empty-state">Nenhuma movimentação recente.</p>';
  } else {
    elements.listaMovimentacoesRecentes.innerHTML = recentMovements
      .map(
        (movimentacao) => `
        <div class="insight-item">
          <div>
            <strong>${movimentacao.produto?.nome_produto || "Produto removido"}</strong>
            <small>${formatDateTime(movimentacao.dataMovimentacao)}</small>
          </div>
          <span class="pill ${movimentacao.tipo === "entrada" ? "pill--entrada" : "pill--saida"}">
            ${movimentacao.tipo} ${movimentacao.quantidade}
          </span>
        </div>
      `,
      )
      .join("");
  }
}

async function refreshAll() {
  try {
    const [categorias, produtos, movimentacoes] = await Promise.all([
      carregarCategorias(),
      carregarProdutos(),
      carregarMovimentacoes(),
    ]);

    renderizarCategorias(categorias, elements.categoriaTableBody);
    renderizarProdutos(produtos, elements.produtoTableBody);
    renderizarMovimentacoes(movimentacoes, elements.movimentacaoTableBody);
    preencherSelectCategorias(categorias, elements.produtoCategoriaSelect);
    preencherSelectProdutos(produtos, elements.movimentacaoProdutoSelect);
    atualizarResumo({ categorias, produtos, movimentacoes });
    renderDashboard({ produtos, movimentacoes });
  } catch (error) {
    if (error.status === 401) {
      redirectToLogin();
      return;
    }

    setFeedback(
      elements.movimentacaoFeedback,
      error.message || "Não foi possível carregar os dados da API.",
      "error",
    );
  }
}

bindCategoriaActions({
  form: elements.categoriaForm,
  feedback: elements.categoriaFeedback,
  tbody: elements.categoriaTableBody,
  refreshAll,
});

bindProdutoActions({
  form: elements.produtoForm,
  feedback: elements.produtoFeedback,
  tbody: elements.produtoTableBody,
  refreshAll,
});

bindMovimentacaoActions({
  form: elements.movimentacaoForm,
  feedback: elements.movimentacaoFeedback,
  tbody: elements.movimentacaoTableBody,
  refreshAll,
});

elements.logoutButton.addEventListener("click", () => {
  logout();
  redirectToLogin();
});

async function bootstrap() {
  const usuario = await loadAuthenticatedUser();

  if (!usuario) {
    redirectToLogin();
    return;
  }

  showAppScreen(usuario);
  await refreshAll();
}

void bootstrap();
