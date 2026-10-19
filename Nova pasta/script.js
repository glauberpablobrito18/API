const form = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const message = document.getElementById("message");
const togglePassword = document.getElementById("togglePassword");
const submitBtn = document.getElementById("submitBtn");

togglePassword.addEventListener("click", () => {
  const visible = password.type === "text";
  password.type = visible ? "password" : "text";
  togglePassword.textContent = visible ? "◉" : "○";
  togglePassword.setAttribute(
    "aria-label",
    visible ? "Mostrar senha" : "Ocultar senha"
  );
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  emailError.textContent = "";
  passwordError.textContent = "";
  message.textContent = "";

  let valid = true;

  if (!email.value.trim()) {
    emailError.textContent = "Informe seu e-mail.";
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    emailError.textContent = "Digite um e-mail válido.";
    valid = false;
  }

  if (!password.value) {
    passwordError.textContent = "Informe sua senha.";
    valid = false;
  } else if (password.value.length < 6) {
    passwordError.textContent = "A senha deve ter pelo menos 6 caracteres.";
    valid = false;
  }

  if (!valid) return;

  submitBtn.disabled = true;
  submitBtn.textContent = "Entrando...";

  // Demonstração front-end. Substitua este trecho pela chamada à sua API.
  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = "Entrar";
    message.textContent = "Login validado com sucesso!";

    // Exemplo para integrar com backend:
    // fetch("/api/login", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     email: email.value,
    //     password: password.value
    //   })
    // });
  }, 900);
});

document.getElementById("forgotBtn").addEventListener("click", (event) => {
  event.preventDefault();
  message.style.color = "#f15a24";
  message.textContent = "Informe seu e-mail para recuperar a senha.";
  email.focus();
});

document.getElementById("registerBtn").addEventListener("click", (event) => {
  event.preventDefault();
  message.style.color = "#f15a24";
  message.textContent = "Página de cadastro ainda não conectada.";
});

document.getElementById("googleBtn").addEventListener("click", () => {
  message.style.color = "#f15a24";
  message.textContent = "Login com Google ainda não conectado.";
});

document.getElementById("backBtn").addEventListener("click", (event) => {
  event.preventDefault();
  history.back();
});
