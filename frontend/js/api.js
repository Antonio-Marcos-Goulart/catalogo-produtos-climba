function resolveApiBaseUrl() {
  if (window.location.protocol === "file:") {
    return "http://localhost:3000/api";
  }

  return `${window.location.origin}/api`;
}

const API_BASE_URL = resolveApiBaseUrl();

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch (_error) {
    throw new Error("Nao foi possivel conectar com o backend em http://localhost:3000.");
  }

  if (response.status === 204) {
    return null;
  }

  const responseText = await response.text();
  let data = null;

  try {
    data = responseText ? JSON.parse(responseText) : null;
  } catch (_error) {
    data = null;
  }

  if (!response.ok) {
    const fallbackMessage = responseText || "Nao foi possivel concluir a solicitacao.";
    const error = new Error(data?.message || fallbackMessage);
    error.status = response.status;
    throw error;
  }

  return data;
}

function get(endpoint) {
  return request(endpoint);
}

function post(endpoint, body) {
  return request(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

function remove(endpoint) {
  return request(endpoint, {
    method: "DELETE",
  });
}

export { get, post, remove };
