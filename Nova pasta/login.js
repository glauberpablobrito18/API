const SUPABASE_URL = "https://ujrzbwoqcgygaizxnyhl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_b6gtNhRw2SvBUYdI7_hzyQ_XL0wXFn3";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

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

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  emailError.textContent = "";
  passwordError.textContent = "";
  message.textContent = "";
  message.style.color = "";

  const emailValue = email.value.trim();
  const passwordValue = password.value;

  let valid = true;

  if (!emailValue) {
    emailError.textContent = "Informe seu e-mail.";
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
    emailError.textContent = "Digite um e-mail válido.";
    valid = false;
  }

  if (!passwordValue) {
    passwordError.textContent = "Informe sua senha.";
    valid = false;
  } else if (passwordValue.length < 6) {
    passwordError.textContent =
      "A senha deve ter pelo menos 6 caracteres.";
    valid = false;
  }

  if (!valid) return;

  submitBtn.disabled = true;
  submitBtn.textContent = "Entrando...";

  try {
    const { data, error } =
      await supabaseClient.auth.signInWithPassword({
        email: emailValue,
        password: passwordValue
      });

    if (error) {
      console.error("Erro de autenticação:", error);
      message.style.color = "#f15a24";
      message.textContent =
        "Não foi possível entrar. Confira seu e-mail e sua senha.";
      return;
    }

    if (!data.user) {
      message.style.color = "#f15a24";
      message.textContent =
        "Não foi possível confirmar sua conta.";
      return;
    }

    message.style.color = "#16a34a";
    message.textContent = "Login realizado com sucesso!";

    // Troque pelo nome da página inicial do seu projeto.
    window.location.href = "painel.html";

  } catch (error) {
    console.error("Erro de conexão:", error);
    message.style.color = "#f15a24";
    message.textContent =
      "Erro ao conectar. Verifique sua internet e tente novamente.";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Entrar";
  }
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


