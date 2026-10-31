(() => {
  const root = document.documentElement;
  const header = document.querySelector("[data-header]");
  const progress = document.querySelector(".scroll-progress span");
  const themeToggle = document.querySelector(".theme-toggle");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const copyButton = document.querySelector(".copy-email");
  const toast = document.querySelector(".toast");
  const year = document.querySelector("[data-year]");
  const navLinks = [...document.querySelectorAll(".desktop-nav a")];
  const navSections = navLinks.map((link) => document.querySelector(link.getAttribute("href")));

  let savedTheme;
  try { savedTheme = localStorage.getItem("portfolio-theme"); } catch { /* The toggle also works when storage is unavailable. */ }

  const applyTheme = (theme) => {
    const dark = theme === "dark";
    root.dataset.theme = dark ? "dark" : "light";
    const actionLabel = dark ? "Ativar modo claro" : "Ativar modo escuro";
    themeToggle?.setAttribute("aria-label", actionLabel);
    themeToggle?.setAttribute("title", actionLabel);
    themeToggle?.setAttribute("aria-pressed", String(dark));
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#070d18" : "#10203c");
  };
  applyTheme(savedTheme || root.dataset.theme);

  themeToggle?.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("portfolio-theme", next); } catch { /* Keep the selected appearance for this page. */ }
  });

  const closeMenu = () => {
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Abrir menu");
    mobileMenu?.setAttribute("aria-hidden", "true");
    mobileMenu?.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
    mobileMenu?.setAttribute("aria-hidden", String(isOpen));
    mobileMenu?.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  mobileMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle?.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menuToggle.focus();
    }
  });
  window.matchMedia("(min-width: 701px)").addEventListener("change", closeMenu);

  const updateScroll = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 24);
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = height > 0 ? Math.min(window.scrollY / height, 1) : 0;
    if (progress) progress.style.width = `${ratio * 100}%`;
    let currentSection = -1;
    navSections.forEach((section, index) => {
      if (section && section.getBoundingClientRect().top <= 160) currentSection = index;
    });
    if (document.querySelector("#contato")?.getBoundingClientRect().top <= 160) currentSection = -1;
    navLinks.forEach((link, index) => {
      if (index === currentSection) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };

  window.addEventListener("scroll", updateScroll, { passive: true });
  updateScroll();

  copyButton?.addEventListener("click", async () => {
    const email = copyButton.dataset.email;
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      copyButton.textContent = "E-mail copiado";
      toast?.classList.add("is-visible");
      window.setTimeout(() => {
        copyButton.textContent = "Copiar e-mail";
        toast?.classList.remove("is-visible");
      }, 2200);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  });

  if (year) year.textContent = String(new Date().getFullYear());
})();
