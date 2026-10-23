// ===== ЭЛЕМЕНТЫ =====
const form = document.querySelector("#registerForm");
const username = document.querySelector("#username");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const confirm = document.querySelector("#confirm");
const terms = document.querySelector("#terms");

const usernameError = document.querySelector("#usernameError");
const emailError = document.querySelector("#emailError");
const passwordError = document.querySelector("#passwordError");
const confirmError = document.querySelector("#confirmError");
const termsError = document.querySelector("#termsError");

const submitBtn = document.querySelector("#submitBtn");
const successModal = document.querySelector("#successModal");
const modalClose = document.querySelector("#modalClose");

// ===== ВАЛИДАТОРЫ =====
const validateUsername = (value) => {
  const trimmed = value.trim();
  if (trimmed === "") return { valid: false, message: "Введите имя" };
  if (trimmed.length < 3) return { valid: false, message: "Минимум 3 символа" };
  if (trimmed.length > 20) return { valid: false, message: "Максимум 20 символов" };
  if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) return { valid: false, message: "Только латиница, цифры и _" };
  return { valid: true, message: "" };
};

const validateEmail = (value) => {
  if (value.trim() === "") return { valid: false, message: "Введите email" };
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(value)) return { valid: false, message: "Некорректный email" };
  return { valid: true, message: "" };
};

const validatePassword = (value) => {
  if (value === "") return { valid: false, message: "Введите пароль" };
  if (value.length < 8) return { valid: false, message: "Минимум 8 символов" };
  if (!/[a-zA-Z]/.test(value)) return { valid: false, message: "Добавьте букву" };
  if (!/\d/.test(value)) return { valid: false, message: "Добавьте цифру" };
  return { valid: true, message: "" };
};

const validateConfirm = (value) => {
  if (value === "") return { valid: false, message: "Повторите пароль" };
  if (value !== password.value) return { valid: false, message: "Пароли не совпадают" };
  return { valid: true, message: "" };
};

const validateTerms = () => {
  if (!terms.checked) return { valid: false, message: "Отметьте согласие" };
  return { valid: true, message: "" };
};

// ===== ПОКАЗ СОСТОЯНИЯ =====
const showError = (input, errorEl, message) => {
  input.classList.add("error");
  input.classList.remove("success");
  errorEl.textContent = message;
};
const showSuccess = (input, errorEl) => {
  input.classList.remove("error");
  input.classList.add("success");
  errorEl.textContent = "";
};

// ===== ОБЩАЯ ПРОВЕРКА =====
function validateForm() {
  const r1 = validateUsername(username.value);
  const r2 = validateEmail(email.value);
  const r3 = validatePassword(password.value);
  const r4 = validateConfirm(confirm.value);
  const r5 = validateTerms();

  r1.valid ? showSuccess(username, usernameError) : showError(username, usernameError, r1.message);
  r2.valid ? showSuccess(email, emailError) : showError(email, emailError, r2.message);
  r3.valid ? showSuccess(password, passwordError) : showError(password, passwordError, r3.message);
  r4.valid ? showSuccess(confirm, confirmError) : showError(confirm, confirmError, r4.message);
  termsError.textContent = r5.valid ? "" : r5.message;

  const allValid = r1.valid && r2.valid && r3.valid && r4.valid && r5.valid;
  submitBtn.disabled = !allValid;
  return allValid;
}

// ===== ИНДИКАТОР СИЛЫ ПАРОЛЯ =====
const checkStrength = (value) => {
  let s = 0;
  if (value.length >= 8) s++;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) s++;
  if (/\d/.test(value)) s++;
  if (/[^a-zA-Z0-9]/.test(value)) s++;
  return s;
};
const levels = [
  { width: "0%", color: "#eee", text: "Введите пароль" },
  { width: "25%", color: "#e74c3c", text: "Очень слабый" },
  { width: "50%", color: "#f39c12", text: "Слабый" },{ width: "75%", color: "#3498db", text: "Средний" },
  { width: "100%", color: "#27ae60", text: "Сильный" },
];
const strengthFill = document.querySelector("#strengthFill");
const strengthText = document.querySelector("#strengthText");

password.addEventListener("input", (e) => {
  const level = levels[checkStrength(e.target.value)];
  strengthFill.style.width = level.width;
  strengthFill.style.background = level.color;
  strengthText.textContent = level.text;
  strengthText.style.color = level.color;
});

// ===== МЯГКАЯ ВАЛИДАЦИЯ (по blur) =====
[username, email, password, confirm].forEach(input => {
  input.addEventListener("blur", validateForm);
  input.addEventListener("input", validateForm);
});
terms.addEventListener("change", validateForm);

// ===== ПОКАЗ/СКРЫТИЕ ПАРОЛЯ =====
const togglePassword = document.querySelector("#togglePassword");
togglePassword.addEventListener("click", () => {
  if (password.type === "password") {
    password.type = "text";
    togglePassword.textContent = "🙈";
  } else {
    password.type = "password";
    togglePassword.textContent = "👁";
  }
});

// ===== МОДАЛКА =====
const showModal = () => successModal.classList.add("active");
const hideModal = () => successModal.classList.remove("active");
modalClose.addEventListener("click", hideModal);
successModal.addEventListener("click", (e) => {
  if (e.target === successModal) hideModal();
});

// ===== ОТПРАВКА =====
const setLoading = (loading) => {
  submitBtn.classList.toggle("loading", loading);
  submitBtn.disabled = loading;
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  setLoading(true);
  await new Promise(r => setTimeout(r, 1500)); // имитация запроса
  setLoading(false);

  showModal();
  form.reset();
  submitBtn.disabled = true;
  [username, email, password, confirm].forEach(i => i.classList.remove("success"));
  strengthFill.style.width = "0%";
  strengthText.textContent = "Введите пароль";
  strengthText.style.color = "#999";
});