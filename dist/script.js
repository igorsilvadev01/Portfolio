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

  const savedTheme = localStorage.getItem("portfolio-theme");
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  root.dataset.theme = savedTheme || (prefersLight ? "light" : "dark");

  themeToggle?.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    localStorage.setItem("portfolio-theme", next);
  });

  const closeMenu = () => {
    menuToggle?.setAttribute("aria-expanded", "false");
    mobileMenu?.setAttribute("aria-hidden", "true");
    mobileMenu?.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    mobileMenu?.setAttribute("aria-hidden", String(isOpen));
    mobileMenu?.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  mobileMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

  const updateScroll = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 24);
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = height > 0 ? Math.min(window.scrollY / height, 1) : 0;
    if (progress) progress.style.width = `${ratio * 100}%`;
  };

  window.addEventListener("scroll", updateScroll, { passive: true });
  updateScroll();

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6%" }
    );
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
  } else {
    document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
  }

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
