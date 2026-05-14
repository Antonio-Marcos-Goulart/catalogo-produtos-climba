import { clearAuth, getAuth, isAuthenticated, saveAuth } from "./auth.js";
import { get, post } from "./api.js";
import { setFeedback } from "./utils.js";

async function login(form) {
  const formData = new FormData(form);

  const authData = await post("/auth/login", {
    email: String(formData.get("email") || "").trim(),
    senha: String(formData.get("senha") || ""),
  });

  saveAuth(authData);
  return authData;
}

async function loadAuthenticatedUser() {
  if (!isAuthenticated()) {
    return null;
  }

  try {
    const usuario = await get("/auth/me");
    const authData = getAuth();

    if (authData) {
      saveAuth({
        ...authData,
        usuario,
      });
    }

    return usuario;
  } catch (_error) {
    clearAuth();
    return null;
  }
}

function logout() {
  clearAuth();
}

function bindLoginForm({ form, feedback, onSuccess }) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const authData = await login(form);
      form.reset();
      setFeedback(feedback, "", "");
      await onSuccess(authData.usuario);
    } catch (error) {
      setFeedback(feedback, error.message, "error");
    }
  });
}

export { bindLoginForm, loadAuthenticatedUser, logout };
