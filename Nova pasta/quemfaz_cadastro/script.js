
import { createClient } from
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const supabaseUrl = "https://ujrzbwoqcgygaizxnyhl.supabase.co";
const supabaseKey = "sb_publishable_b6gtNhRw2SvBUYdI7_hzyQ_XL0wXFn3";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);


const form = document.getElementById("signupForm");
const submitBtn = document.getElementById("submitBtn");
const message = document.getElementById("message");
const togglePassword = document.getElementById("togglePassword");

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

// Verifica se os elementos do HTML existem
if (!form || !submitBtn || !message) {
  throw new Error(
    "Não foi possível encontrar o formulário, o botão ou a mensagem. Confira os IDs no HTML."
  );
}

for (const [key, field] of Object.entries(fields)) {
  if (!field) {
    throw new Error(`Campo "${key}" não encontrado no HTML.`);
  }
}

for (const [key, element] of Object.entries(errors)) {
  if (!element) {
    throw new Error(`Elemento de erro "${key}" não encontrado no HTML.`);
  }
}

function showMessage(text, isError = false) {
  message.textContent = text;
  message.style.color = isError ? "#b42318" : "#3d7b51";
  message.setAttribute("role", isError ? "alert" : "status");
}

function clearErrors() {
  Object.values(errors).forEach((element) => {
    element.textContent = "";
  });

  showMessage("");
}

function normalizePhone(value) {
  return value.replace(/\D/g, "").slice(0, 11);
}

// Máscara de telefone brasileiro
fields.phone.addEventListener("input", (event) => {
  const digits = normalizePhone(event.target.value);

  if (digits.length === 0) {
    event.target.value = "";
  } else if (digits.length <= 2) {
    event.target.value = `(${digits}`;
  } else if (digits.length <= 6) {
    event.target.value =
      `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  } else if (digits.length <= 10) {
    event.target.value =
      `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  } else {
    event.target.value =
      `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
});

// Mostrar ou ocultar as senhas
if (togglePassword) {
  togglePassword.addEventListener("click", () => {
    const show = fields.password.type === "password";

    fields.password.type = show ? "text" : "password";
    fields.confirmPassword.type = show ? "text" : "password";

    togglePassword.textContent = show ? "○" : "◉";
    togglePassword.setAttribute(
      "aria-label",
      show ? "Ocultar senhas" : "Mostrar senhas"
    );
  });
}

// Validar os dados
function validateForm() {
  clearErrors();

  let valid = true;

  const firstName = fields.firstName.value.trim();
  const lastName = fields.lastName.value.trim();
  const email = fields.email.value.trim();
  const phone = normalizePhone(fields.phone.value);
  const password = fields.password.value;
  const confirmPassword = fields.confirmPassword.value;

  if (!firstName) {
    errors.firstName.textContent = "Informe seu nome.";
    valid = false;
  }

  if (!lastName) {
    errors.lastName.textContent = "Informe seu sobrenome.";
    valid = false;
  }

  if (!email) {
    errors.email.textContent = "Informe seu e-mail.";
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email.textContent = "Digite um e-mail válido.";
    valid = false;
  }

  if (phone.length !== 10 && phone.length !== 11) {
    errors.phone.textContent = "Digite um telefone válido com DDD.";
    valid = false;
  }

  if (password.length < 6) {
    errors.password.textContent =
      "A senha precisa ter pelo menos 6 caracteres.";
    valid = false;
  }

  if (!confirmPassword) {
    errors.confirmPassword.textContent = "Confirme sua senha.";
    valid = false;
  } else if (confirmPassword !== password) {
    errors.confirmPassword.textContent = "As senhas não coincidem.";
    valid = false;
  }

  if (!fields.terms.checked) {
    errors.terms.textContent = "Você precisa aceitar os termos.";
    valid = false;
  }

  return valid;
}

// Enviar cadastro para o Supabase
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (submitBtn.disabled) return;

  if (!validateForm()) return;

  submitBtn.disabled = true;
  submitBtn.textContent = "Criando conta...";

  try {
    const email = fields.email.value.trim();
    const firstName = fields.firstName.value.trim();
    const lastName = fields.lastName.value.trim();
    const phone = normalizePhone(fields.phone.value);
    const password = fields.password.value;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone
        }
      }
    });

    if (error) {
      console.error("Erro no cadastro Supabase:", error);

      if (error.status === 429) {
        showMessage(
          "Muitas tentativas. Aguarde um pouco e tente novamente.",
          true
        );
      } else {
        showMessage(
          error.message || "Não foi possível criar sua conta.",
          true
        );
      }

      return;
    }

    // Cadastro concluído
    if (data.session) {
      showMessage("Conta criada com sucesso! Você já está conectado.");
    } else {
      showMessage(
        "Cadastro realizado! Verifique seu e-mail para confirmar a conta, se solicitado."
      );
    }

    form.reset();

    fields.password.type = "password";
    fields.confirmPassword.type = "password";

    if (togglePassword) {
      togglePassword.textContent = "◉";
      togglePassword.setAttribute("aria-label", "Mostrar senhas");
    }
  } catch (error) {
    console.error("Erro de conexão:", error);

    showMessage(
      "Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.",
      true
    );
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Criar minha conta";
  }
});
