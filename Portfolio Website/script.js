"use strict";

/* ---------- Theme toggle (remembers choice) ---------- */
const root = document.documentElement;
const toggle = document.getElementById("theme-toggle");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  toggle.textContent = theme === "dark" ? "Light" : "Dark";
  toggle.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
}

let saved = null;
try { saved = localStorage.getItem("theme"); } catch (e) { /* storage unavailable */ }
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(saved || (prefersDark ? "dark" : "light"));

toggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem("theme", next); } catch (e) { /* ignore */ }
});

/* ---------- Typing effect in the hero ---------- */
const typed = document.getElementById("typed");
const words = ["websites", "web apps", "brands", "mobile apps"];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function typeLoop() {
  let w = 0, i = words[0].length, deleting = false;
  function tick() {
    const word = words[w];
    typed.textContent = word.slice(0, i);
    let delay = deleting ? 45 : 90;
    if (!deleting && i === word.length) { deleting = true; delay = 1600; }
    else if (deleting && i === 0) { deleting = false; w = (w + 1) % words.length; delay = 300; }
    i += deleting ? -1 : 1;
    setTimeout(tick, delay);
  }
  setTimeout(tick, 1600);
}
if (!reduceMotion) typeLoop();

/* ---------- Project filters ---------- */
const filterButtons = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".card");
const emptyMsg = document.getElementById("empty-msg");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;
    filterButtons.forEach((b) => {
      const active = b === btn;
      b.classList.toggle("active", active);
      b.setAttribute("aria-pressed", String(active));
    });
    let shown = 0;
    cards.forEach((card) => {
      const match = filter === "all" || card.dataset.category === filter;
      card.hidden = !match;
      if (match) shown++;
    });
    emptyMsg.hidden = shown > 0;
  });
});

/* ---------- Contact form validation ---------- */
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setError(field, message) {
  const err = form.querySelector(`.error[data-for="${field.id}"]`);
  err.textContent = message;
  field.setAttribute("aria-invalid", message ? "true" : "false");
  return !message;
}

function validate() {
  const name = form.elements.name;
  const email = form.elements.email;
  const message = form.elements.message;
  const results = [
    setError(name, name.value.trim() ? "" : "Enter your name."),
    setError(email, emailPattern.test(email.value.trim()) ? "" : "Enter a valid email address, like you@example.com."),
    setError(message, message.value.trim().length >= 10 ? "" : "Write at least 10 characters about your project."),
  ];
  return results.every(Boolean);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  status.textContent = "";
  if (!validate()) return;
  // No server is connected yet. Replace this with a fetch() to your form service.
  status.textContent = `Thanks, ${form.elements.name.value.trim()}. Your message is ready to send once a form service is connected.`;
  form.reset();
});

/* ---------- Footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
