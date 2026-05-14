const AUTH_STORAGE_KEY = "estoque-auth";

function saveAuth(authData) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
}

function getAuth() {
  const authData = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!authData) {
    return null;
  }

  try {
    return JSON.parse(authData);
  } catch (_error) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

function getToken() {
  return getAuth()?.token || "";
}

function clearAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

function isAuthenticated() {
  return Boolean(getToken());
}

export { clearAuth, getAuth, getToken, isAuthenticated, saveAuth };
