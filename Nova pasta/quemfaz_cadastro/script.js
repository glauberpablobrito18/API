const form = document.getElementById("signupForm");
const fields = {
  firstName: document.getElementById("firstName"),
  lastName: document.getElementById("lastName"),
  email: document.getElementById("email"),
  phone: document.getElementById("phone"),
  password: document.getElementById("password"),
  confirmPassword: document.getElementById("confirmPassword"),
  terms: document.getElementById("terms")
};

const errors = {
  firstName: document.getElementById("firstNameError"),
  lastName: document.getElementById("lastNameError"),
  email: document.getElementById("emailError"),
  phone: document.getElementById("phoneError"),
  password: document.getElementById("passwordError"),
  confirmPassword: document.getElementById("confirmPasswordError"),
  terms: document.getElementById("termsError")
};

const message = document.getElementById("message");
const submitBtn = document.getElementById("submitBtn");

document.getElementById("togglePassword").addEventListener("click", () => {
  const visible = fields.password.type === "text";
  fields.password.type = visible ? "password" : "text";
  fields.confirmPassword.type = visible ? "password" : "text";
  document.getElementById("togglePassword").textContent = visible ? "◉" : "○";
});

fields.phone.addEventListener("input", (event) => {
  let value = event.target.value.replace(/\D/g, "").slice(0, 11);

  if (value.length <= 10) {
    value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  } else {
    value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  }

  event.target.value = value;
});

function clearErrors() {
  Object.values(errors).forEach(error => error.textContent = "");
  message.textContent = "";
  message.style.color = "#3d7b51";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();

  let valid = true;

  if (!fields.firstName.value.trim()) {
    errors.firstName.textContent = "Informe seu nome.";
    valid = false;
  }

  if (!fields.lastName.value.trim()) {
    errors.lastName.textContent = "Informe seu sobrenome.";
    valid = false;
  }

  if (!fields.email.value.trim()) {
    errors.email.textContent = "Informe seu e-mail.";
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value.trim())) {
    errors.email.textContent = "Digite um e-mail válido.";
    valid = false;
  }

  const phoneDigits = fields.phone.value.replace(/\D/g, "");
  if (phoneDigits.length < 10) {
    errors.phone.textContent = "Digite um telefone válido.";
    valid = false;
  }

  if (fields.password.value.length < 6) {
    errors.password.textContent = "A senha precisa ter pelo menos 6 caracteres.";
    valid = false;
  }

  if (fields.confirmPassword.value !== fields.password.value) {
    errors.confirmPassword.textContent = "As senhas não coincidem.";
    valid = false;
  }

  if (!fields.terms.checked) {
    errors.terms.textContent = "Você precisa aceitar os termos.";
    valid = false;
  }

  if (!valid) return;

  submitBtn.disabled = true;
  submitBtn.textContent = "Criando conta...";

  // Demonstração front-end.
  // Para cadastro real, envie estes dados para seu backend/API.
  const userData = {
    firstName: fields.firstName.value.trim(),
    lastName: fields.lastName.value.trim(),
    email: fields.email.value.trim(),
    phone: phoneDigits,
    password: fields.password.value
  };

  console.log("Dados do cadastro:", userData);

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = "Criar minha conta";
    message.textContent = "Cadastro validado com sucesso!";
  }, 900);
});
