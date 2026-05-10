/* =============================================================
   Portfolio — UI Behavior
   - スクロール時のヘッダー切替
   - reveal フェードイン（IntersectionObserver）
   - モバイルナビ開閉
   - フッター年号
   ============================================================= */
(() => {
  "use strict";

  /* ---------- ヘッダー：スクロール量に応じてスタイル切替 ---------- */
  const header = document.getElementById("siteHeader");
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 16) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- モバイルナビ：トグル ---------- */
  const navToggle = document.getElementById("navToggle");
  const siteNav = document.querySelector(".site-nav");
  if (navToggle && siteNav) {
    const setOpen = (open) => {
      navToggle.setAttribute("aria-expanded", String(open));
      siteNav.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    };
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      setOpen(!expanded);
    });
    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 720) setOpen(false);
    });
  }

  /* ---------- reveal: スクロール時フェードイン ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    // data-reveal-delay を CSS 変数に流し込む
    revealEls.forEach((el) => {
      const d = el.getAttribute("data-reveal-delay");
      if (d) el.style.setProperty("--reveal-delay", `${d}ms`);
    });

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -8% 0px",
        }
      );
      revealEls.forEach((el) => io.observe(el));
    }
  }

  /* ---------- フッター：年号自動 ---------- */
  const yearEl = document.getElementById("footerYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
