// Shared behaviour for all three designs: mobile nav, lightbox gallery,
// room filters and the booking form (sends via WhatsApp or email).
(() => {
  const WA = "584127798935";
  const MAIL = "colonialchoroni@gmail.com";

  // ---- Mobile navigation -------------------------------------------------
  document.querySelectorAll("[data-nav-toggle]").forEach((btn) => {
    const nav = document.getElementById(btn.getAttribute("aria-controls"));
    if (!nav) return;
    const set = (open) => {
      btn.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
    };
    btn.addEventListener("click", () => set(btn.getAttribute("aria-expanded") !== "true"));
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => set(false)));
    document.addEventListener("keydown", (e) => e.key === "Escape" && set(false));
  });

  // ---- Header state on scroll -------------------------------------------
  const header = document.querySelector("[data-header]");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // ---- Lightbox ----------------------------------------------------------
  const links = [...document.querySelectorAll("a[data-lightbox]")];
  if (links.length) {
    const dlg = document.createElement("dialog");
    dlg.className = "lightbox";
    dlg.innerHTML = `
      <figure>
        <img alt="">
        <figcaption></figcaption>
      </figure>
      <button class="lb-btn lb-prev" aria-label="Anterior">&#8249;</button>
      <button class="lb-btn lb-next" aria-label="Siguiente">&#8250;</button>
      <button class="lb-btn lb-close" aria-label="Cerrar">&times;</button>`;
    document.body.append(dlg);
    const img = dlg.querySelector("img");
    const cap = dlg.querySelector("figcaption");
    let group = [], idx = 0;

    const show = (i) => {
      idx = (i + group.length) % group.length;
      const a = group[idx];
      img.src = a.href;
      img.alt = a.querySelector("img")?.alt || "";
      cap.textContent = a.dataset.caption || img.alt;
      dlg.classList.toggle("single", group.length < 2);
    };
    links.forEach((a) =>
      a.addEventListener("click", (e) => {
        e.preventDefault();
        group = links.filter((l) => l.dataset.lightbox === a.dataset.lightbox && !l.closest("[data-house][hidden]"));
        show(group.indexOf(a));
        dlg.showModal();
      })
    );
    dlg.querySelector(".lb-prev").onclick = () => show(idx - 1);
    dlg.querySelector(".lb-next").onclick = () => show(idx + 1);
    dlg.querySelector(".lb-close").onclick = () => dlg.close();
    dlg.addEventListener("click", (e) => e.target === dlg && dlg.close());
    dlg.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
    let x0 = null;
    dlg.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
    dlg.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  }

  // ---- Room filter (Hostal / Casa Nova) ---------------------------------
  document.querySelectorAll("[data-filter-group]").forEach((bar) => {
    const target = document.getElementById(bar.dataset.filterGroup);
    bar.querySelectorAll("button[data-filter]").forEach((btn) =>
      btn.addEventListener("click", () => {
        bar.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
        const f = btn.dataset.filter;
        target.querySelectorAll("[data-house]").forEach((el) => {
          el.hidden = f !== "all" && el.dataset.house !== f;
        });
      })
    );
  });

  // ---- Carousel arrows (scroll-snap tracks) ------------------------------
  document.querySelectorAll("[data-track]").forEach((wrap) => {
    const track = wrap.querySelector(".track");
    wrap.querySelectorAll("[data-dir]").forEach((b) =>
      b.addEventListener("click", () =>
        track.scrollBy({ left: Number(b.dataset.dir) * track.clientWidth * 0.8, behavior: "smooth" })
      )
    );
  });

  // ---- Booking form -> WhatsApp / Email ----------------------------------
  document.querySelectorAll("form[data-booking]").forEach((form) => {
    const compose = () => {
      const d = new FormData(form);
      const lines = [
        "Hola, quisiera hacer una reservación:",
        `Nombre: ${d.get("nombre") || ""}`,
        `Posada: ${d.get("posada") || ""}`,
        `Llegada: ${d.get("llegada") || ""}  Salida: ${d.get("salida") || ""}`,
        `Adultos: ${d.get("adultos") || ""}  Niños: ${d.get("ninos") || 0}`,
      ];
      if (d.get("mensaje")) lines.push(`Mensaje: ${d.get("mensaje")}`);
      return lines.join("\n");
    };
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const via = e.submitter?.value || "wa";
      const text = compose();
      const url =
        via === "mail"
          ? `mailto:${MAIL}?subject=${encodeURIComponent("Reservación")}&body=${encodeURIComponent(text)}`
          : `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;
      window.open(url, via === "mail" ? "_self" : "_blank", "noopener");
    });
    // Salida must be after llegada
    const ll = form.elements.llegada, sa = form.elements.salida;
    if (ll && sa) {
      const today = new Date().toISOString().slice(0, 10);
      ll.min = today;
      ll.addEventListener("change", () => { sa.min = ll.value; if (sa.value && sa.value <= ll.value) sa.value = ""; });
    }
  });

  // ---- Footer year -------------------------------------------------------
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
