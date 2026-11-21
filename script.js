/* =========================================
   SETTINGS (edit the typing phrases here)
   ========================================= */
const PHRASES = [
  "MERN Stack Developer",
  "Full Stack Web Developer",
  "Java Programmer",
  "Problem Solver",
];

/* =========================================
   HELPERS
   ========================================= */
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* =========================================
   1. LOADING ANIMATION
   ========================================= */
window.addEventListener("load", () => {
  setTimeout(() => $("#loader").classList.add("hide"), 600);
});

/* =========================================
   2. TYPING EFFECT (hero section)
   ========================================= */
(function typingEffect() {
  const output = $("#typed");

  if (reduceMotion) {
    output.textContent = PHRASES[0];
    return;
  }

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const phrase = PHRASES[phraseIndex];
    output.textContent = phrase.slice(0, charIndex);

    // Pause when a phrase is fully typed, then start deleting
    if (!deleting && charIndex === phrase.length) {
      deleting = true;
      setTimeout(tick, 1400);
      return;
    }

    // Move to the next phrase when deleting is finished
    if (deleting && charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % PHRASES.length;
    }

    charIndex += deleting ? -1 : 1;
    setTimeout(tick, deleting ? 45 : 90);
  }

  tick();
})();

/* =========================================
   3. STICKY NAVBAR, BACK-TO-TOP, ACTIVE LINK
   ========================================= */
const navbar = $("#nav");
const topButton = $("#top");
const navLinks = $$(".menu a");
const pageSections = navLinks.map((link) => $(link.getAttribute("href")));

function handleScroll() {
  navbar.classList.toggle("stuck", scrollY > 40);
  topButton.classList.toggle("show", scrollY > 500);

  // Highlight the link of the section currently in view
  const position = scrollY + 140;
  pageSections.forEach((section, index) => {
    const inView =
      section.offsetTop <= position &&
      section.offsetTop + section.offsetHeight > position;
    navLinks[index].classList.toggle("active", inView);
  });
}

addEventListener("scroll", handleScroll, { passive: true });
handleScroll();

topButton.addEventListener("click", () => {
  scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
});

/* =========================================
   4. MOBILE HAMBURGER MENU
   ========================================= */
const burger = $("#burger");
const menu = $("#menu");

function toggleMenu(open) {
  menu.classList.toggle("open", open);
  burger.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
}

burger.addEventListener("click", () => {
  toggleMenu(!menu.classList.contains("open"));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => toggleMenu(false));
});

addEventListener("keydown", (event) => {
  if (event.key === "Escape") toggleMenu(false);
});

/* =========================================
   5. SCROLL REVEAL + ANIMATED SKILL BARS
   ========================================= */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("in");

      // Fill skill bars using their data-level value (0-100)
      $$(".bar", entry.target).forEach((bar) => {
        $("i", bar).style.width = (bar.dataset.level || 0) + "%";
      });

      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);

$$(".reveal").forEach((element) => revealObserver.observe(element));

/* =========================================
   6. CUSTOM CURSOR (desktop only)
   ========================================= */
const isDesktop = matchMedia("(hover: hover) and (pointer: fine)").matches;

if (isDesktop && !reduceMotion) {
  const cursor = $("#cursor");

  addEventListener("mousemove", (event) => {
    cursor.classList.add("on");
    cursor.style.left = event.clientX + "px";
    cursor.style.top = event.clientY + "px";
  });

  $$("a, button, .card, .proj, .skill").forEach((element) => {
    element.addEventListener("mouseenter", () => cursor.classList.add("big"));
    element.addEventListener("mouseleave", () => cursor.classList.remove("big"));
  });
}

/* =========================================
   7. CONTACT FORM VALIDATION (frontend only)
   ========================================= */
const form = $("#form");

const rules = {
  name: (value) =>
    value.trim().length >= 2 || "Enter your name (at least 2 characters).",
  email: (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ||
    "Enter a valid email address.",
  subject: (value) =>
    value.trim().length >= 3 || "Enter a subject (at least 3 characters).",
  message: (value) =>
    value.trim().length >= 10 || "Write a message of at least 10 characters.",
};

function validateField(input) {
  const result = rules[input.name](input.value);
  const valid = result === true;
  const box = input.closest(".field");

  box.classList.toggle("err", !valid);
  $("small", box).textContent = valid ? "" : result;
  input.setAttribute("aria-invalid", !valid);

  return valid;
}

$$("input, textarea", form).forEach((input) => {
  input.addEventListener("blur", () => validateField(input));
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const allValid = $$("input, textarea", form)
    .map(validateField)
    .every(Boolean);

  $("#status").textContent = allValid
    ? "Looks good! Connect a backend or form service (see README) to deliver this message."
    : "Please fix the highlighted fields.";

  if (allValid) form.reset();
});

/* =========================================
   8. FOOTER YEAR
   ========================================= */
$("#year").textContent = new Date().getFullYear(); 