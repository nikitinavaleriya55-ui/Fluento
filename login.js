const form = document.querySelector("#loginForm");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const emailError = document.querySelector("#emailError");
const passwordError = document.querySelector("#passwordError");

const validateEmail = (value) => {
  if (!value.trim()) return { valid: false, message: "Введите email" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return { valid: false, message: "Некорректный email" };
  return { valid: true, message: "" };
};
const validatePassword = (value) => {
  if (!value) return { valid: false, message: "Введите пароль" };
  return { valid: true, message: "" };
};

function validateForm() {
  const r1 = validateEmail(email.value);
  const r2 = validatePassword(password.value);
  emailError.textContent = r1.valid ? "" : r1.message;
  passwordError.textContent = r2.valid ? "" : r2.message;
  email.classList.toggle("error", !r1.valid);
  password.classList.toggle("error", !r2.valid);
  return r1.valid && r2.valid;
}

[email, password].forEach(i => i.addEventListener("input", validateForm));

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (validateForm()) {
    alert("Вы вошли! (демо — без сервера)");
    window.location.href = "index.html";
  }
});