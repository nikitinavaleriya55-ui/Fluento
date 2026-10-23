// ==========================================
// 0. БУРГЕР
// ==========================================
const burgerBtn = document.querySelector("#burgerBtn");
const mainMenu = document.querySelector("#mainMenu");

if (burgerBtn && mainMenu) {
  burgerBtn.addEventListener("click", () => {
    burgerBtn.classList.toggle("active");
    mainMenu.classList.toggle("open");
    burgerBtn.setAttribute("aria-expanded", burgerBtn.classList.contains("active"));
  });
  mainMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      burgerBtn.classList.remove("active");
      mainMenu.classList.remove("open");
      burgerBtn.setAttribute("aria-expanded", "false");
    });
  });
}

// ==========================================
// 1. ТЕМА
// ==========================================
const themeBtn = document.querySelector("#themeBtn");
function getSavedTheme() { try { return localStorage.getItem("theme"); } catch (e) { return null; } }
function saveTheme(t) { try { localStorage.setItem("theme", t); } catch (e) {} }

if (getSavedTheme() === "dark") document.body.classList.add("dark");

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  saveTheme(document.body.classList.contains("dark") ? "dark" : "light");
});

// ==========================================
// 2. КНОПКА НАВЕРХ
// ==========================================
const scrollTopBtn = document.querySelector("#scrollTopBtn");
window.addEventListener("scroll", () => {
  scrollTopBtn.classList.toggle("visible", window.scrollY > 300);
});
scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ==========================================
// 3. СЛАЙДЕР
// ==========================================
const reviews = [
  { name: "Мария", text: "За 3 месяца подтянула английский с B1 до C1!", lang: "Английский" },
  { name: "Иван", text: "Китайский казался невозможным — но всё пошло!", lang: "Китайский" },
  { name: "Анна", text: "Удобная платформа, уроки в любое время.", lang: "Испанский" },
  { name: "Дмитрий", text: "Сдал DELF B2 с первого раза. Спасибо Sophie!", lang: "Французский" },
  { name: "Ольга", text: "Итальянский для путешествий — уже свободно!", lang: "Итальянский" },
];

const sliderTrack = document.querySelector("#sliderTrack");
const sliderDots = document.querySelector("#sliderDots");
const sliderBox = document.querySelector("#reviewSlider");
let currentSlide = 0;
let sliderTimer;

reviews.forEach((r, i) => {
  const slide = document.createElement("div");
  slide.className = "slider__slide";
  slide.innerHTML = `<h3>${r.lang}</h3><p>«${r.text}»</p><strong>— ${r.name}</strong>`;
  sliderTrack.appendChild(slide);
  const dot = document.createElement("button");
  dot.addEventListener("click", () => goToSlide(i));
  sliderDots.appendChild(dot);
});

function goToSlide(i) {
  currentSlide = (i + reviews.length) % reviews.length;
  sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
  [...sliderDots.children].forEach((d, idx) => d.classList.toggle("active", idx === currentSlide));
}
function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

document.querySelector(".slider__next").addEventListener("click", nextSlide);
document.querySelector(".slider__prev").addEventListener("click", prevSlide);

function startAuto() { sliderTimer = setInterval(nextSlide, 3000); }
function stopAuto() { clearInterval(sliderTimer); }
sliderBox.addEventListener("mouseenter", stopAuto);
sliderBox.addEventListener("mouseleave", startAuto);
startAuto();

let startX = 0;
sliderBox.addEventListener("touchstart", e => startX = e.touches[0].clientX);
sliderBox.addEventListener("touchend", e => {
  const dx = e.changedTouches[0].clientX - startX;
  if (Math.abs(dx) > 50) dx < 0 ? nextSlide() : prevSlide();
});

goToSlide(0);

// ==========================================
// 4. КОРЗИНА// ==========================================
let cart = [];
try { cart = JSON.parse(localStorage.getItem("cart")) || []; } catch (e) { cart = []; }

const cartItems = document.querySelector("#cartItems");
const cartTotal = document.querySelector("#cartTotal");
const clearCartBtn = document.querySelector("#clearCart");

function saveCart() { try { localStorage.setItem("cart", JSON.stringify(cart)); } catch (e) {} renderCart(); }

function addToCart(id, name, price) {
  const existing = cart.find(p => p.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ id, name, price, qty: 1 });
  saveCart();
}
function changeQty(id, delta) {
  const item = cart.find(p => p.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(p => p.id !== id);
  saveCart();
}
function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="muted">Корзина пуста</p>';
    cartTotal.textContent = "0 ₽";
    return;
  }
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div><strong>${item.name}</strong><br><small>${item.price} ₽ × ${item.qty}</small></div>
      <div class="qty-controls">
        <button data-action="minus" data-id="${item.id}">−</button>
        <span>${item.qty}</span>
        <button data-action="plus" data-id="${item.id}">+</button>
      </div>`;
    cartItems.appendChild(row);
  });
  cartTotal.textContent = total + " ₽";
}
cartItems.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  if (btn.dataset.action === "plus") changeQty(id, 1);
  if (btn.dataset.action === "minus") changeQty(id, -1);
});
clearCartBtn.addEventListener("click", () => {
  cart = [];
  try { localStorage.removeItem("cart"); } catch (e) {}
  renderCart();
});
document.querySelectorAll(".buy-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    addToCart(Number(btn.dataset.id), btn.dataset.name, Number(btn.dataset.price));
    btn.textContent = "Добавлено ✓";
    btn.disabled = true;
    setTimeout(() => { btn.textContent = "Купить"; btn.disabled = false; }, 1200);
    document.querySelector("#cart").scrollIntoView({ behavior: "smooth" });
  });
});
renderCart();

// ==========================================
// 5. ПАГИНАЦИЯ
// ==========================================
const posts = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `Статья №${i + 1}: как учить языки`,
  text: `Полезные советы для изучающих иностранные языки. Выпуск ${i + 1}.`
}));

const PER_PAGE = 10;
let currentPage = 1;
let filtered = posts;

const postsList = document.querySelector("#postsList");
const pagination = document.querySelector("#pagination");
const searchInput = document.querySelector("#searchInput");

function renderItem(post) {
  const div = document.createElement("article");
  div.className = "post";
  div.innerHTML = `<h3>${post.title}</h3><p>${post.text}</p>`;
  return div;
}
function renderPage(items, renderItemFn) {
  postsList.innerHTML = "";
  items.forEach(item => postsList.appendChild(renderItemFn(item)));
}
function getPageItems() {
  const start = (currentPage - 1) * PER_PAGE;
  return filtered.slice(start, start + PER_PAGE);
}
function renderPagination() {
  const pages = Math.ceil(filtered.length / PER_PAGE);
  pagination.innerHTML = "";
  const prev = document.createElement("button");
  prev.textContent = "« Пред.";
  prev.disabled = currentPage === 1;
  prev.addEventListener("click", () => { currentPage--; update(); scrollToBlog(); });
  pagination.appendChild(prev);
  for (let i = 1; i <= pages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");
    btn.addEventListener("click", () => { currentPage = i; update(); scrollToBlog(); });pagination.appendChild(btn);
  }
  const next = document.createElement("button");
  next.textContent = "След. »";
  next.disabled = currentPage === pages;
  next.addEventListener("click", () => { currentPage++; update(); scrollToBlog(); });
  pagination.appendChild(next);
}
function scrollToBlog() {
  document.querySelector("#blog").scrollIntoView({ behavior: "smooth", block: "start" });
}
function update() { renderPage(getPageItems(), renderItem); renderPagination(); }

searchInput.addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();
  filtered = posts.filter(p => p.title.toLowerCase().includes(q));
  currentPage = 1;
  update();
});

update();