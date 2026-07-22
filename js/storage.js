(() => {
  "use strict";

  const STORAGE_KEY = "seuHotelConciergeData";

  const defaults = {
    hotel: {
      name: "SEU HOTEL",
      tagline: "Conforto, praticidade e acolhimento no centro de Patos.",
      welcomeTitle: "Seja muito bem-vindo(a)!",
      welcomeText: "É uma satisfação recebê-lo(a) no SEU HOTEL. Esperamos que sua estadia seja confortável, tranquila e agradável.",
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
    wifi: { name: "SEU HOTEL", password: "seuhotelpatos*" },
    breakfast: { week: "06h00 às 09h00", weekend: "07h00 às 09h00" },
    academy: {
      name: "Sol Fitness",
      price: "R$ 10,00",
      text: "Hóspedes do SEU HOTEL podem utilizar a academia parceira Sol Fitness pagando apenas R$ 10,00 mediante apresentação do passe."
    },
    services: [
      { id: "service-clean", icon: "🧹", title: "Solicitar limpeza", description: "Peça a limpeza do seu quarto diretamente à recepção.", message: "Olá! Gostaria de solicitar a limpeza do meu quarto." },
      { id: "service-towels", icon: "🛁", title: "Troca de toalhas", description: "Solicite a troca de toalhas com rapidez.", message: "Olá! Gostaria de solicitar a troca de toalhas." },
      { id: "service-reception", icon: "🛎️", title: "Falar com a recepção", description: "Entre em contato com nossa equipe.", message: "Olá! Preciso falar com a recepção." }
    ],
    rooms: [
      { id: "room-single", icon: "🛏️", title: "Quarto Individual", description: "Acomodação prática e confortável para uma pessoa." },
      { id: "room-double", icon: "🛏️", title: "Quarto Duplo", description: "Acomodação com duas camas de solteiro." },
      { id: "room-couple", icon: "💑", title: "Quarto Casal", description: "Acomodação confortável com cama de casal." },
      { id: "room-family", icon: "👨‍👩‍👧", title: "Quarto Família", description: "Acomodação para casal e acompanhante." }
    ],
    rules: [
      { id: "rule-key", icon: "🔑", title: "Chaves", description: "Ao sair, entregue a chave do apartamento na recepção." },
      { id: "rule-visitors", icon: "👥", title: "Visitantes", description: "A entrada de visitantes exige cadastro prévio na recepção." },
      { id: "rule-smoking", icon: "🚭", title: "Ambiente livre de fumaça", description: "Não é permitido fumar dentro dos apartamentos e áreas internas." }
    ],
    nearby: [
      { id: "near-food", icon: "🍽️", title: "Restaurantes", query: "restaurantes perto do SEU HOTEL Patos PB" },
      { id: "near-pharmacy", icon: "💊", title: "Farmácias", query: "farmácias perto do SEU HOTEL Patos PB" },
      { id: "near-bank", icon: "🏦", title: "Bancos", query: "bancos perto do SEU HOTEL Patos PB" }
    ],
    faq: [
      { id: "faq-checkout", question: "Qual é o horário do check-out?", answer: "Nosso check-out é realizado até às 12h." },
      { id: "faq-parking", question: "O hotel possui estacionamento?", answer: "O SEU HOTEL não possui estacionamento próprio." },
      { id: "faq-reception", question: "A recepção funciona durante a madrugada?", answer: "Sim. Nossa recepção funciona 24 horas." }
    ],
    gallery: []
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function merge(saved) {
    if (!saved || typeof saved !== "object") return clone(defaults);
    return {
      ...clone(defaults),
      ...saved,
      hotel: { ...defaults.hotel, ...(saved.hotel || {}) },
      wifi: { ...defaults.wifi, ...(saved.wifi || {}) },
      breakfast: { ...defaults.breakfast, ...(saved.breakfast || {}) },
      academy: { ...defaults.academy, ...(saved.academy || {}) },
      services: Array.isArray(saved.services) ? saved.services : clone(defaults.services),
      rooms: Array.isArray(saved.rooms) ? saved.rooms : clone(defaults.rooms),
      rules: Array.isArray(saved.rules) ? saved.rules : clone(defaults.rules),
      nearby: Array.isArray(saved.nearby) ? saved.nearby : clone(defaults.nearby),
      faq: Array.isArray(saved.faq) ? saved.faq : clone(defaults.faq),
      gallery: Array.isArray(saved.gallery) ? saved.gallery : []
    };
  }

  window.SeuHotelStorage = {
    key: STORAGE_KEY,
    defaults,
    load() {
      try {
        return merge(JSON.parse(localStorage.getItem(STORAGE_KEY)));
      } catch {
        return clone(defaults);
      }
    },
    save(data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },
    reset() {
      const data = clone(defaults);
      this.save(data);
      return data;
    }
  };
})();
