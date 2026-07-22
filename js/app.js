(() => {
  "use strict";

  const storage = window.SeuHotelStorage;
  const data = storage.load();
  const $ = (selector, parent = document) => parent.querySelector(selector);

  document.addEventListener("DOMContentLoaded", () => {
    fillHotelData();
    renderCards("#servicesGrid", data.services, serviceCard);
    renderCards("#roomsGrid", data.rooms, simpleCard);
    renderCards("#rulesGrid", data.rules, simpleCard);
    renderCards("#nearbyGrid", data.nearby, nearbyCard);
    renderFaq();
    renderGallery();
    bindActions();

    setupInteractiveFeatures();
    registerServiceWorker();
  });

  function fillHotelData() {
    document.title = `${data.hotel.name} | Concierge Digital`;
    setText("#hotelName", data.hotel.name);
    setText("#heroTitle", data.hotel.welcomeTitle);
    setText("#heroText", data.hotel.welcomeText);
    setText("#hotelTagline", data.hotel.tagline);
    setText("#wifiName", data.wifi.name);
    setText("#wifiPassword", data.wifi.password);
    setText("#breakfastWeek", data.breakfast.week);
    setText("#breakfastWeekend", data.breakfast.weekend);
    setText("#academyName", data.academy.name);
    setText("#academyPrice", data.academy.price);
    setText("#academyText", data.academy.text);
    setText("#hotelAddress", data.hotel.address);
    setText("#hotelPhone", data.hotel.phoneDisplay);
    setText("#hotelEmail", data.hotel.email);
    setText("#hotelInstagram", data.hotel.instagram);
    setText("#checkin", data.hotel.checkin);
    setText("#checkout", data.hotel.checkout);
    setText("#reception", data.hotel.reception);

    const notice = $("#hotelNotice");
    if (notice && data.hotel.notice.trim()) {
      notice.textContent = data.hotel.notice;
      notice.hidden = false;
    }
  }

  function renderCards(selector, items, renderer) {
    const container = $(selector);
    if (!container) return;
    container.innerHTML = items.map(renderer).join("");
  }

  function simpleCard(item) {
    return `
      <article class="info-card">
        <span class="card-icon">${escapeHtml(item.icon)}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
      </article>`;
  }

  function serviceCard(item) {
    const link = whatsappLink(item.message);
    return `
      <article class="info-card service-card">
        <span class="card-icon">${escapeHtml(item.icon)}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
        <a class="text-link" href="${link}" target="_blank" rel="noopener">Solicitar pelo WhatsApp →</a>
      </article>`;
  }

  function nearbyCard(item) {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.query)}`;
    return `
      <a class="info-card nearby-card" href="${url}" target="_blank" rel="noopener">
        <span class="card-icon">${escapeHtml(item.icon)}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>Encontrar opções próximas no Google Maps.</p>
      </a>`;
  }

  function renderFaq() {
    const container = $("#faqList");
    if (!container) return;
    container.innerHTML = data.faq.map((item, index) => `
      <details class="faq-item"${index === 0 ? " open" : ""}>
        <summary>${escapeHtml(item.question)}</summary>
        <p>${escapeHtml(item.answer)}</p>
      </details>
    `).join("");
  }

  function renderGallery() {
    const container = $("#galleryGrid");
    if (!container) return;

    if (!data.gallery.length) {
      container.innerHTML = `
        <div class="gallery-placeholder">
          <span>📷</span>
          <strong>Galeria do SEU HOTEL</strong>
          <p>As fotos adicionadas no painel administrativo aparecerão aqui.</p>
        </div>`;
      return;
    }

    container.innerHTML = data.gallery.map(image => `
      <figure class="gallery-item">
        <img src="${image.src}" alt="${escapeHtml(image.alt || "Foto do SEU HOTEL")}">
        ${image.alt ? `<figcaption>${escapeHtml(image.alt)}</figcaption>` : ""}
      </figure>
    `).join("");
  }

  function bindActions() {
    $("#copyWifiButton")?.addEventListener("click", async () => {
      const text = `Rede: ${data.wifi.name}\nSenha: ${data.wifi.password}`;
      try {
        await navigator.clipboard.writeText(text);
        toast("Wi-Fi copiado com sucesso.");
      } catch {
        window.prompt("Copie os dados do Wi-Fi:", text);
      }
    });

    $("#whatsappButton")?.setAttribute("href", whatsappLink("Olá! Estou hospedado(a) no SEU HOTEL e preciso de atendimento."));
    $("#mapButton")?.setAttribute("href", `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.hotel.address)}`);

    $("#shareButton")?.addEventListener("click", async () => {
      const shareData = { title: data.hotel.name, text: data.hotel.tagline, url: location.href };
      if (navigator.share) {
        await navigator.share(shareData).catch(() => {});
      } else {
        await navigator.clipboard.writeText(location.href).catch(() => {});
        toast("Link copiado.");
      }
    });
  }


  function setupInteractiveFeatures() {
    setTimeout(() => document.querySelector("#pageLoader")?.classList.add("hidden"), 650);

    const themeButton = document.querySelector("#themeButton");
    if (localStorage.getItem("seuHotelTheme") === "dark") document.body.classList.add("dark-mode");
    themeButton?.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      localStorage.setItem("seuHotelTheme", document.body.classList.contains("dark-mode") ? "dark" : "light");
      toast(document.body.classList.contains("dark-mode") ? "Modo escuro ativado." : "Modo claro ativado.");
    });

    document.querySelectorAll("#quickRequestOptions button").forEach(button => {
      button.addEventListener("click", () => {
        const room = document.querySelector("#roomNumber")?.value.trim();
        const feedback = document.querySelector("#requestFeedback");
        if (!room) {
          feedback.textContent = "Informe primeiro o número do apartamento.";
          document.querySelector("#roomNumber")?.focus();
          return;
        }
        window.open(whatsappLink(`${button.dataset.message} Apartamento: ${room}.`), "_blank", "noopener");
        feedback.textContent = "Abrindo atendimento pelo WhatsApp...";
      });
    });

    let rating = 0;
    document.querySelectorAll("#ratingButtons button").forEach(button => {
      button.addEventListener("click", () => {
        rating = Number(button.dataset.rating);
        document.querySelectorAll("#ratingButtons button").forEach(star => {
          star.classList.toggle("active", Number(star.dataset.rating) <= rating);
        });
        const messages = ["", "Queremos entender o que aconteceu.", "Vamos buscar melhorar.", "Sua experiência pode ficar ainda melhor.", "Ficamos felizes com sua hospedagem.", "Excelente! Muito obrigado."];
        document.querySelector("#ratingMessage").textContent = messages[rating];
        const send = document.querySelector("#sendRatingButton");
        send.hidden = false;
        send.href = whatsappLink(`Olá! Minha avaliação da hospedagem no SEU HOTEL é de ${rating} estrela${rating > 1 ? "s" : ""}.`);
      });
    });

    const overlay = document.querySelector("#conciergeOverlay");
    const close = () => { overlay.hidden = true; document.body.style.overflow = ""; };
    document.querySelector("#conciergeButton")?.addEventListener("click", () => { overlay.hidden = false; document.body.style.overflow = "hidden"; });
    document.querySelector("#conciergeClose")?.addEventListener("click", close);
    overlay?.addEventListener("click", event => { if (event.target === overlay) close(); });
    document.querySelector("#conciergeWifi")?.addEventListener("click", close);
    document.querySelectorAll("[data-concierge-message]").forEach(link => {
      link.href = whatsappLink(link.dataset.conciergeMessage);
      link.target = "_blank";
      link.rel = "noopener";
    });

    const revealItems = document.querySelectorAll(".info-card,.quick-card,.gallery-item,.faq-item,.gallery-placeholder");
    revealItems.forEach(item => item.classList.add("reveal-item"));
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: .12 });
      revealItems.forEach(item => observer.observe(item));
    } else {
      revealItems.forEach(item => item.classList.add("visible"));
    }

    let deferredPrompt;
    const installButton = document.querySelector("#installButton");
    window.addEventListener("beforeinstallprompt", event => {
      event.preventDefault();
      deferredPrompt = event;
      installButton.hidden = false;
    });
    installButton?.addEventListener("click", async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      installButton.hidden = true;
    });
  }

  function whatsappLink(message) {
    return `https://wa.me/${data.hotel.phoneWhatsApp}?text=${encodeURIComponent(message)}`;
  }

  function toast(message) {
    const element = $("#toast");
    if (!element) return;
    element.textContent = message;
    element.classList.add("show");
    setTimeout(() => element.classList.remove("show"), 2600);
  }

  function setText(selector, value) {
    const element = $(selector);
    if (element) element.textContent = value || "";
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function registerServiceWorker() {
    if ("serviceWorker" in navigator && location.protocol !== "file:") {
      navigator.serviceWorker.register("./service-worker.js").catch(console.error);
    }
  }
})();
