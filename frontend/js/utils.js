function formatCurrency(value) {
  const numericValue = Number(value || 0);

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numericValue);
}

function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function setFeedback(element, message, status = "") {
  element.textContent = message;

  if (status) {
    element.dataset.status = status;
    return;
  }

  delete element.dataset.status;
}

function createEmptyRow(message, colspan) {
  return `<tr><td class="empty-state" colspan="${colspan}">${message}</td></tr>`;
}

export { createEmptyRow, formatCurrency, formatDateTime, setFeedback };
