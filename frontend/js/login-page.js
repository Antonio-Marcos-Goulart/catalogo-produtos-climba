import { getAuth, isAuthenticated } from "./auth.js";
import { bindLoginForm, loadAuthenticatedUser } from "./login.js";

const elements = {
  loginForm: document.querySelector("#form-login"),
  loginFeedback: document.querySelector("#login-feedback"),
};

function redirectToApp() {
  window.location.href = "./index.html";
}

bindLoginForm({
  form: elements.loginForm,
  feedback: elements.loginFeedback,
  onSuccess: async () => {
    redirectToApp();
  },
});

async function bootstrap() {
  if (!isAuthenticated()) {
    return;
  }

  const usuario = getAuth()?.usuario || await loadAuthenticatedUser();

  if (usuario) {
    redirectToApp();
  }
}

void bootstrap();
