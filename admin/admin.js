(() => {
  "use strict";

  const STORAGE_KEY = "seuHotelConciergeData";
  const PASSWORD_KEY = "seuHotelAdminPassword";
  const SESSION_KEY = "seuHotelAdminSession";
  const DEFAULT_PASSWORD = "1234";

  const DEFAULT_DATA = {
    hotel: {
      name: "SEU HOTEL",
      tagline: "Conforto, praticidade e acolhimento no centro de Patos.",
      welcomeTitle: "Seja muito bem-vindo(a)!",
      welcomeText:
        "É uma satisfação recebê-lo(a) no SEU HOTEL. Esperamos que sua estadia seja confortável, tranquila e agradável. Nossa equipe está à disposição sempre que precisar.",
      notice: "",
      phoneDisplay: "(83) 98113-1259",
      phoneWhatsApp: "5583981131259",
      instagram: "@seu.hotel",
      email: "seuhotelpb@gmail.com",
      address: "Rua Escritor Rui Barbosa, nº 20, Centro – Patos/PB",
      checkin: "A partir das 14h",
      checkout: "Até às 12h",
      reception: "24 horas"
    },
    wifi: {
      name: "SEU HOTEL",
      password: "seuhotelpatos*"
    },
    breakfast: {
      week: "06h00 às 09h00",
      weekend: "07h00 às 09h00"
    },
    academy: {
      name: "Sol Fitness",
      price: "R$ 10,00",
      text:
        "Hóspedes do SEU HOTEL podem utilizar a academia parceira Sol Fitness pagando apenas R$ 10,00 mediante apresentação do passe."
    },
    services: [
      {
        id: createId(),
        icon: "🧹",
        title: "Solicitar limpeza",
        description: "Peça a limpeza do seu quarto diretamente à recepção.",
        message: "Olá! Gostaria de solicitar a limpeza do meu quarto."
      },
      {
        id: createId(),
        icon: "🛁",
        title: "Troca de toalhas",
        description: "Solicite a troca de toalhas com rapidez.",
        message: "Olá! Gostaria de solicitar a troca de toalhas."
      },
      {
        id: createId(),
        icon: "🛎️",
        title: "Falar com a recepção",
        description: "Entre em contato com nossa equipe.",
        message: "Olá! Preciso falar com a recepção."
      }
    ],
    rooms: [
      {
        id: createId(),
        icon: "🛏️",
        title: "Quarto Individual",
        description: "Acomodação prática e confortável para uma pessoa."
      },
      {
        id: createId(),
        icon: "🛏️",
        title: "Quarto Duplo",
        description: "Acomodação com duas camas de solteiro."
      },
      {
        id: createId(),
        icon: "💑",
        title: "Quarto Casal",
        description: "Acomodação confortável com cama de casal."
      },
      {
        id: createId(),
        icon: "👨‍👩‍👧",
        title: "Quarto Família",
        description: "Acomodação para casal e acompanhante."
      }
    ],
    rules: [
      {
        id: createId(),
        icon: "🔑",
        title: "Chaves",
        description: "Ao sair, entregue a chave do apartamento na recepção."
      },
      {
        id: createId(),
        icon: "👥",
        title: "Visitantes",
        description: "A entrada de visitantes exige cadastro prévio na recepção."
      },
      {
        id: createId(),
        icon: "🚭",
        title: "Ambiente livre de fumaça",
        description: "Não é permitido fumar dentro dos apartamentos e áreas internas."
      }
    ],
    nearby: [
      {
        id: createId(),
        icon: "🍽️",
        title: "Restaurantes",
        query: "restaurantes perto do SEU HOTEL Patos PB"
      },
      {
        id: createId(),
        icon: "💊",
        title: "Farmácias",
        query: "farmácias perto do SEU HOTEL Patos PB"
      },
      {
        id: createId(),
        icon: "🏦",
        title: "Bancos",
        query: "bancos perto do SEU HOTEL Patos PB"
      }
    ],
    faq: [
      {
        id: createId(),
        question: "Qual é o horário do check-out?",
        answer: "Nosso check-out é realizado até às 12h."
      },
      {
        id: createId(),
        question: "O hotel possui estacionamento?",
        answer: "O SEU HOTEL não possui estacionamento próprio."
      },
      {
        id: createId(),
        question: "A recepção funciona durante a madrugada?",
        answer: "Sim. Nossa recepção funciona 24 horas."
      }
    ],
    gallery: []
  };

  const sectionTitles = {
    dashboard: ["Painel administrativo", "Visão geral"],
    general: ["Identidade e apresentação", "Informações do hotel"],
    hosting: ["Informações essenciais", "Hospedagem"],
    wifi: ["Conectividade", "Wi-Fi"],
    breakfast: ["Horários", "Café da manhã"],
    services: ["Solicitações", "Serviços"],
    rooms: ["Acomodações", "Tipos de quarto"],
    rules: ["Boa convivência", "Regras"],
    gallery: ["Imagens", "Galeria"],
    academy: ["Parceria", "Academia"],
    nearby: ["Guia local", "Proximidades"],
    faq: ["Dúvidas frequentes", "Perguntas e respostas"],
    settings: ["Segurança e dados", "Configurações"]
  };

  let data = loadData();
  let pendingConfirmation = null;
  let toastTimer = null;

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    createSidebarBackdrop();
    bindLogin();
    bindNavigation();
    bindGeneralActions();
    bindAddButtons();
    bindGalleryUpload();
    bindSettings();
    populateForm();
    renderAllEditors();
    updateDashboard();
    restoreSession();
  }

  function createId() {
    return `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function mergeWithDefaults(saved) {
    const defaults = clone(DEFAULT_DATA);
    if (!saved || typeof saved !== "object") return defaults;

    return {
      ...defaults,
      ...saved,
      hotel: { ...defaults.hotel, ...(saved.hotel || {}) },
      wifi: { ...defaults.wifi, ...(saved.wifi || {}) },
      breakfast: { ...defaults.breakfast, ...(saved.breakfast || {}) },
      academy: { ...defaults.academy, ...(saved.academy || {}) },
      services: Array.isArray(saved.services) ? saved.services : defaults.services,
      rooms: Array.isArray(saved.rooms) ? saved.rooms : defaults.rooms,
      rules: Array.isArray(saved.rules) ? saved.rules : defaults.rules,
      nearby: Array.isArray(saved.nearby) ? saved.nearby : defaults.nearby,
      faq: Array.isArray(saved.faq) ? saved.faq : defaults.faq,
      gallery: Array.isArray(saved.gallery) ? saved.gallery : defaults.gallery
    };
  }

  function loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? mergeWithDefaults(JSON.parse(raw)) : clone(DEFAULT_DATA);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      return clone(DEFAULT_DATA);
    }
  }

  function saveData() {
    setSaveStatus("saving", "Salvando alterações...");

    try {
      collectFormData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

      setTimeout(() => {
        setSaveStatus("saved", "Alterações salvas");
        updateDashboard();
        showToast("Alterações salvas com sucesso.", "success");
      }, 250);
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
      setSaveStatus("error", "Erro ao salvar");
      showToast(
        "Não foi possível salvar. As imagens podem ter ultrapassado o limite do navegador.",
        "error"
      );
    }
  }

  function collectFormData() {
    data.hotel.name = valueOf("#hotelNameInput");
    data.hotel.tagline = valueOf("#taglineInput");
    data.hotel.welcomeTitle = valueOf("#welcomeTitleInput");
    data.hotel.welcomeText = valueOf("#welcomeTextInput");
    data.hotel.notice = valueOf("#noticeInput");
    data.hotel.phoneDisplay = valueOf("#phoneDisplayInput");
    data.hotel.phoneWhatsApp = sanitizePhone(valueOf("#phoneWhatsAppInput"));
    data.hotel.instagram = valueOf("#instagramInput");
    data.hotel.email = valueOf("#emailInput");
    data.hotel.address = valueOf("#addressInput");
    data.hotel.checkin = valueOf("#checkinInput");
    data.hotel.checkout = valueOf("#checkoutInput");
    data.hotel.reception = valueOf("#receptionInput");

    data.wifi.name = valueOf("#wifiNameInput");
    data.wifi.password = valueOf("#wifiPasswordInput");

    data.breakfast.week = valueOf("#breakfastWeekInput");
    data.breakfast.weekend = valueOf("#breakfastWeekendInput");

    data.academy.name = valueOf("#academyNameInput");
    data.academy.price = valueOf("#academyPriceInput");
    data.academy.text = valueOf("#academyTextInput");

    const noticePreview = $("#noticePreview");
    if (noticePreview) {
      noticePreview.textContent =
        data.hotel.notice.trim() || "Nenhum aviso publicado.";
    }
  }

  function populateForm() {
    setValue("#hotelNameInput", data.hotel.name);
    setValue("#taglineInput", data.hotel.tagline);
    setValue("#welcomeTitleInput", data.hotel.welcomeTitle);
    setValue("#welcomeTextInput", data.hotel.welcomeText);
    setValue("#noticeInput", data.hotel.notice);
    setValue("#phoneDisplayInput", data.hotel.phoneDisplay);
    setValue("#phoneWhatsAppInput", data.hotel.phoneWhatsApp);
    setValue("#instagramInput", data.hotel.instagram);
    setValue("#emailInput", data.hotel.email);
    setValue("#addressInput", data.hotel.address);
    setValue("#checkinInput", data.hotel.checkin);
    setValue("#checkoutInput", data.hotel.checkout);
    setValue("#receptionInput", data.hotel.reception);

    setValue("#wifiNameInput", data.wifi.name);
    setValue("#wifiPasswordInput", data.wifi.password);

    setValue("#breakfastWeekInput", data.breakfast.week);
    setValue("#breakfastWeekendInput", data.breakfast.weekend);

    setValue("#academyNameInput", data.academy.name);
    setValue("#academyPriceInput", data.academy.price);
    setValue("#academyTextInput", data.academy.text);

    const noticePreview = $("#noticePreview");
    if (noticePreview) {
      noticePreview.textContent =
        data.hotel.notice.trim() || "Nenhum aviso publicado.";
    }
  }

  function valueOf(selector) {
    return $(selector)?.value?.trim() || "";
  }

  function setValue(selector, value) {
    const element = $(selector);
    if (element) element.value = value ?? "";
  }

  function sanitizePhone(phone) {
    return String(phone || "").replace(/\D/g, "");
  }

  function bindLogin() {
    const loginForm = $("#loginForm");
    const togglePassword = $("#togglePassword");
    const logoutButton = $("#logoutButton");

    loginForm?.addEventListener("submit", (event) => {
      event.preventDefault();

      const entered = valueOf("#adminPassword");
      const storedPassword =
        localStorage.getItem(PASSWORD_KEY) || DEFAULT_PASSWORD;

      if (entered === storedPassword) {
        sessionStorage.setItem(SESSION_KEY, "active");
        showAdmin();
        setValue("#adminPassword", "");
        setText("#loginError", "");
      } else {
        setText("#loginError", "Senha incorreta. Tente novamente.");
        $("#adminPassword")?.focus();
      }
    });

    togglePassword?.addEventListener("click", () => {
      const input = $("#adminPassword");
      if (!input) return;

      input.type = input.type === "password" ? "text" : "password";
      togglePassword.textContent = input.type === "password" ? "👁️" : "🙈";
    });

    logoutButton?.addEventListener("click", () => {
      sessionStorage.removeItem(SESSION_KEY);
      document.body.classList.remove("sidebar-open");
      $("#adminApp")?.setAttribute("hidden", "");
      $("#loginScreen")?.removeAttribute("hidden");
      $("#adminPassword")?.focus();
    });
  }

  function restoreSession() {
    if (sessionStorage.getItem(SESSION_KEY) === "active") {
      showAdmin();
    } else {
      $("#loginScreen")?.removeAttribute("hidden");
      $("#adminApp")?.setAttribute("hidden", "");
    }
  }

  function showAdmin() {
    $("#loginScreen")?.setAttribute("hidden", "");
    $("#adminApp")?.removeAttribute("hidden");
    openSection("dashboard");
  }

  function bindNavigation() {
    $$(".nav-item").forEach((button) => {
      button.addEventListener("click", () => {
        openSection(button.dataset.section);
      });
    });

    $$("[data-open-section]").forEach((button) => {
      button.addEventListener("click", () => {
        openSection(button.dataset.openSection);
      });
    });

    $("#mobileMenuButton")?.addEventListener("click", () => {
      document.body.classList.toggle("sidebar-open");
    });
  }

  function createSidebarBackdrop() {
    if ($(".sidebar-backdrop")) return;

    const backdrop = document.createElement("div");
    backdrop.className = "sidebar-backdrop";
    backdrop.addEventListener("click", () => {
      document.body.classList.remove("sidebar-open");
    });
    document.body.appendChild(backdrop);
  }

  function openSection(sectionName) {
    const target = $(`#section-${sectionName}`);
    if (!target) return;

    $$(".admin-section").forEach((section) =>
      section.classList.remove("active")
    );
    $$(".nav-item").forEach((button) =>
      button.classList.toggle(
        "active",
        button.dataset.section === sectionName
      )
    );

    target.classList.add("active");

    const [eyebrow, title] =
      sectionTitles[sectionName] || ["Painel administrativo", "SEU HOTEL"];

    setText("#headerEyebrow", eyebrow);
    setText("#headerTitle", title);

    document.body.classList.remove("sidebar-open");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function bindGeneralActions() {
    $("#saveAllButton")?.addEventListener("click", saveData);

    $("#previewButton")?.addEventListener("click", () => {
      saveData();
      window.open("index.html", "_blank", "noopener");
    });

    $("#noticeInput")?.addEventListener("input", (event) => {
      setText(
        "#noticePreview",
        event.target.value.trim() || "Nenhum aviso publicado."
      );
      setSaveStatus("saving", "Alterações pendentes");
    });

    $$("input, textarea, select").forEach((field) => {
      field.addEventListener("input", () => {
        setSaveStatus("saving", "Alterações pendentes");
      });
    });

    bindConfirmationModal();
  }

  function bindAddButtons() {
    $("#addServiceButton")?.addEventListener("click", () => {
      data.services.push({
        id: createId(),
        icon: "🛎️",
        title: "Novo serviço",
        description: "",
        message: ""
      });
      renderServices();
      updateDashboard();
      showToast("Novo serviço adicionado.", "success");
    });

    $("#addRoomButton")?.addEventListener("click", () => {
      data.rooms.push({
        id: createId(),
        icon: "🛏️",
        title: "Nova acomodação",
        description: ""
      });
      renderRooms();
      updateDashboard();
      showToast("Nova acomodação adicionada.", "success");
    });

    $("#addRuleButton")?.addEventListener("click", () => {
      data.rules.push({
        id: createId(),
        icon: "📋",
        title: "Nova regra",
        description: ""
      });
      renderRules();
      updateDashboard();
      showToast("Nova regra adicionada.", "success");
    });

    $("#addNearbyButton")?.addEventListener("click", () => {
      data.nearby.push({
        id: createId(),
        icon: "📍",
        title: "Nova categoria",
        query: ""
      });
      renderNearby();
      updateDashboard();
      showToast("Nova categoria adicionada.", "success");
    });

    $("#addFaqButton")?.addEventListener("click", () => {
      data.faq.push({
        id: createId(),
        question: "Nova pergunta",
        answer: ""
      });
      renderFaq();
      updateDashboard();
      showToast("Nova pergunta adicionada.", "success");
    });
  }

  function renderAllEditors() {
    renderServices();
    renderRooms();
    renderRules();
    renderNearby();
    renderFaq();
    renderGallery();
  }

  function renderServices() {
    renderCollection({
      container: "#servicesEditor",
      items: data.services,
      emptyIcon: "🛎️",
      emptyText: "Nenhum serviço cadastrado.",
      fields: [
        { key: "icon", label: "Ícone", type: "text" },
        { key: "title", label: "Nome do serviço", type: "text" },
        {
          key: "description",
          label: "Descrição",
          type: "textarea",
          full: true
        },
        {
          key: "message",
          label: "Mensagem enviada pelo WhatsApp",
          type: "textarea",
          full: true
        }
      ],
      onDelete: (id) => {
        data.services = data.services.filter((item) => item.id !== id);
        renderServices();
        updateDashboard();
      }
    });
  }

  function renderRooms() {
    renderCollection({
      container: "#roomsEditor",
      items: data.rooms,
      emptyIcon: "🛏️",
      emptyText: "Nenhuma acomodação cadastrada.",
      fields: [
        { key: "icon", label: "Ícone", type: "text" },
        { key: "title", label: "Nome da acomodação", type: "text" },
        {
          key: "description",
          label: "Descrição",
          type: "textarea",
          full: true
        }
      ],
      onDelete: (id) => {
        data.rooms = data.rooms.filter((item) => item.id !== id);
        renderRooms();
        updateDashboard();
      }
    });
  }

  function renderRules() {
    renderCollection({
      container: "#rulesEditor",
      items: data.rules,
      emptyIcon: "📋",
      emptyText: "Nenhuma regra cadastrada.",
      fields: [
        { key: "icon", label: "Ícone", type: "text" },
        { key: "title", label: "Título", type: "text" },
        {
          key: "description",
          label: "Orientação",
          type: "textarea",
          full: true
        }
      ],
      onDelete: (id) => {
        data.rules = data.rules.filter((item) => item.id !== id);
        renderRules();
        updateDashboard();
      }
    });
  }

  function renderNearby() {
    renderCollection({
      container: "#nearbyEditor",
      items: data.nearby,
      emptyIcon: "📍",
      emptyText: "Nenhuma categoria cadastrada.",
      fields: [
        { key: "icon", label: "Ícone", type: "text" },
        { key: "title", label: "Nome da categoria", type: "text" },
        {
          key: "query",
          label: "Pesquisa no Google Maps",
          type: "text",
          full: true
        }
      ],
      onDelete: (id) => {
        data.nearby = data.nearby.filter((item) => item.id !== id);
        renderNearby();
        updateDashboard();
      }
    });
  }

  function renderFaq() {
    renderCollection({
      container: "#faqEditor",
      items: data.faq,
      emptyIcon: "❓",
      emptyText: "Nenhuma pergunta cadastrada.",
      fields: [
        {
          key: "question",
          label: "Pergunta",
          type: "text",
          full: true
        },
        {
          key: "answer",
          label: "Resposta",
          type: "textarea",
          full: true
        }
      ],
      onDelete: (id) => {
        data.faq = data.faq.filter((item) => item.id !== id);
        renderFaq();
        updateDashboard();
      }
    });
  }

  function renderCollection(config) {
    const container = $(config.container);
    if (!container) return;

    container.innerHTML = "";

    if (!config.items.length) {
      container.innerHTML = `
        <div class="empty-state">
          <span>${escapeHtml(config.emptyIcon)}</span>
          <strong>${escapeHtml(config.emptyText)}</strong>
        </div>
      `;
      return;
    }

    config.items.forEach((item, index) => {
      const article = document.createElement("article");
      article.className = "editor-item";
      article.dataset.id = item.id;
      article.draggable = true;

      const fieldsHtml = config.fields
        .map((field) => {
          const fullClass = field.full ? " full-row" : "";
          const value = escapeHtml(item[field.key] ?? "");

          if (field.type === "textarea") {
            return `
              <label class="${fullClass}">
                ${escapeHtml(field.label)}
                <textarea data-key="${escapeHtml(field.key)}" rows="3">${value}</textarea>
              </label>
            `;
          }

          return `
            <label class="${fullClass}">
              ${escapeHtml(field.label)}
              <input
                data-key="${escapeHtml(field.key)}"
                type="${escapeHtml(field.type || "text")}"
                value="${value}"
              >
            </label>
          `;
        })
        .join("");

      article.innerHTML = `
        <div class="drag-handle" title="Arrastar para reorganizar">⋮⋮</div>

        <div class="editor-fields two-columns">
          ${fieldsHtml}
        </div>

        <div class="editor-actions">
          <button
            class="icon-button delete"
            type="button"
            aria-label="Excluir item"
            title="Excluir"
          >🗑️</button>
        </div>
      `;

      $$("[data-key]", article).forEach((field) => {
        field.addEventListener("input", () => {
          item[field.dataset.key] = field.value;
          setSaveStatus("saving", "Alterações pendentes");
        });
      });

      $(".delete", article)?.addEventListener("click", () => {
        confirmAction(
          "Excluir item",
          "Tem certeza de que deseja excluir este item?",
          () => {
            config.onDelete(item.id);
            showToast("Item excluído.", "success");
          }
        );
      });

      bindDragEvents(article, config.items, index, () => {
        renderCollection(config);
        setSaveStatus("saving", "Alterações pendentes");
      });

      container.appendChild(article);
    });
  }

  function bindDragEvents(element, items, originalIndex, rerender) {
    element.addEventListener("dragstart", (event) => {
      element.classList.add("dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", String(originalIndex));
    });

    element.addEventListener("dragend", () => {
      element.classList.remove("dragging");
    });

    element.addEventListener("dragover", (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    });

    element.addEventListener("drop", (event) => {
      event.preventDefault();

      const fromIndex = Number(event.dataTransfer.getData("text/plain"));
      const toIndex = originalIndex;

      if (
        Number.isNaN(fromIndex) ||
        fromIndex === toIndex ||
        fromIndex < 0 ||
        fromIndex >= items.length
      ) {
        return;
      }

      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      rerender();
    });
  }

  function bindGalleryUpload() {
    const input = $("#galleryInput");
    const selectButton = $("#selectImagesButton");
    const uploadArea = $("#uploadArea");

    selectButton?.addEventListener("click", () => input?.click());

    input?.addEventListener("change", (event) => {
      processImages([...event.target.files]);
      event.target.value = "";
    });

    uploadArea?.addEventListener("dragover", (event) => {
      event.preventDefault();
      uploadArea.classList.add("drag-over");
    });

    uploadArea?.addEventListener("dragleave", () => {
      uploadArea.classList.remove("drag-over");
    });

    uploadArea?.addEventListener("drop", (event) => {
      event.preventDefault();
      uploadArea.classList.remove("drag-over");
      processImages([...event.dataTransfer.files]);
    });
  }

  async function processImages(files) {
    const validFiles = files.filter((file) =>
      ["image/jpeg", "image/png", "image/webp"].includes(file.type)
    );

    if (!validFiles.length) {
      showToast("Selecione imagens em JPG, PNG ou WebP.", "warning");
      return;
    }

    showToast("Processando imagens...", "warning");

    for (const file of validFiles.slice(0, 10)) {
      try {
        const compressed = await compressImage(file);
        data.gallery.push({
          id: createId(),
          src: compressed,
          alt: file.name.replace(/\.[^.]+$/, "")
        });
      } catch (error) {
        console.error("Erro ao processar imagem:", error);
      }
    }

    renderGallery();
    updateDashboard();
    setSaveStatus("saving", "Alterações pendentes");
    showToast("Imagens adicionadas. Clique em salvar.", "success");
  }

  function compressImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onerror = reject;
      reader.onload = () => {
        const image = new Image();

        image.onerror = reject;
        image.onload = () => {
          const maxDimension = 1400;
          let width = image.width;
          let height = image.height;

          if (width > maxDimension || height > maxDimension) {
            const ratio = Math.min(
              maxDimension / width,
              maxDimension / height
            );
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const context = canvas.getContext("2d");
          context.drawImage(image, 0, 0, width, height);

          resolve(canvas.toDataURL("image/jpeg", 0.78));
        };

        image.src = reader.result;
      };

      reader.readAsDataURL(file);
    });
  }

  function renderGallery() {
    const container = $("#galleryEditor");
    if (!container) return;

    container.innerHTML = "";

    if (!data.gallery.length) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <span>📷</span>
          <strong>Nenhuma imagem adicionada.</strong>
        </div>
      `;
      return;
    }

    data.gallery.forEach((image) => {
      const item = document.createElement("article");
      item.className = "gallery-item";

      item.innerHTML = `
        <img src="${escapeAttribute(image.src)}" alt="${escapeAttribute(image.alt || "Foto do hotel")}">

        <div class="gallery-item-actions">
          <button
            class="icon-button delete"
            type="button"
            title="Excluir imagem"
            aria-label="Excluir imagem"
          >🗑️</button>
        </div>

        <div class="gallery-item-content">
          <label>
            Descrição da imagem
            <input
              type="text"
              value="${escapeAttribute(image.alt || "")}"
              placeholder="Ex.: Recepção do hotel"
            >
          </label>
        </div>
      `;

      $("input", item)?.addEventListener("input", (event) => {
        image.alt = event.target.value;
        setSaveStatus("saving", "Alterações pendentes");
      });

      $(".delete", item)?.addEventListener("click", () => {
        confirmAction(
          "Excluir imagem",
          "Esta imagem será removida da galeria. Deseja continuar?",
          () => {
            data.gallery = data.gallery.filter(
              (galleryImage) => galleryImage.id !== image.id
            );
            renderGallery();
            updateDashboard();
            setSaveStatus("saving", "Alterações pendentes");
            showToast("Imagem excluída.", "success");
          }
        );
      });

      container.appendChild(item);
    });
  }

  function bindSettings() {
    $("#changePasswordButton")?.addEventListener("click", () => {
      const password = valueOf("#newPasswordInput");
      const confirmation = valueOf("#confirmPasswordInput");

      if (password.length < 4) {
        showToast("A senha deve ter pelo menos 4 caracteres.", "warning");
        return;
      }

      if (password !== confirmation) {
        showToast("As senhas informadas não são iguais.", "error");
        return;
      }

      localStorage.setItem(PASSWORD_KEY, password);
      setValue("#newPasswordInput", "");
      setValue("#confirmPasswordInput", "");
      showToast("Senha alterada com sucesso.", "success");
    });

    $("#resetDataButton")?.addEventListener("click", () => {
      confirmAction(
        "Restaurar dados padrão",
        "Todas as alterações salvas neste navegador serão apagadas.",
        () => {
          data = clone(DEFAULT_DATA);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          populateForm();
          renderAllEditors();
          updateDashboard();
          setSaveStatus("saved", "Dados restaurados");
          showToast("Dados padrão restaurados.", "success");
        }
      );
    });
  }

  function updateDashboard() {
    setText("#servicesCount", String(data.services.length));
    setText("#roomsCount", String(data.rooms.length));
    setText("#rulesCount", String(data.rules.length));
    setText("#galleryCount", String(data.gallery.length));
  }

  function bindConfirmationModal() {
    $("#modalCancelButton")?.addEventListener("click", closeConfirmation);

    $("#modalConfirmButton")?.addEventListener("click", () => {
      const action = pendingConfirmation;
      closeConfirmation();
      action?.();
    });

    $("#confirmationModal")?.addEventListener("click", (event) => {
      if (event.target.id === "confirmationModal") {
        closeConfirmation();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeConfirmation();
        document.body.classList.remove("sidebar-open");
      }
    });
  }

  function confirmAction(title, message, callback) {
    pendingConfirmation = callback;
    setText("#modalTitle", title);
    setText("#modalMessage", message);
    $("#confirmationModal")?.removeAttribute("hidden");
  }

  function closeConfirmation() {
    pendingConfirmation = null;
    $("#confirmationModal")?.setAttribute("hidden", "");
  }

  function setSaveStatus(type, text) {
    const status = $("#saveStatus");
    if (!status) return;

    status.classList.remove("saving", "error");

    if (type === "saving") status.classList.add("saving");
    if (type === "error") status.classList.add("error");

    const textNode = [...status.childNodes].find(
      (node) => node.nodeType === Node.TEXT_NODE
    );

    if (textNode) {
      textNode.textContent = ` ${text}`;
    }
  }

  function showToast(message, type = "") {
    const toast = $("#adminToast");
    if (!toast) return;

    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.className = `admin-toast ${type} show`.trim();

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  }

  function setText(selector, text) {
    const element = $(selector);
    if (element) element.textContent = text;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replaceAll("`", "&#096;");
  }
})();
