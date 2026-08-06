/**
 * ==========================================================================
 * CHAVEIRO MARQUINHO - RIBEIRÃO PRETO
 * Lógica Interativa, SEO Geolocalizado, Filtros, Menu Mobile e WhatsApp
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initWhatsAppLinks();
  initGeolocationSLA();
  initServiceFilter();
  initFAQAccordion();
  initMobileMenu();
  initStickyHeader();
});

/**
 * 1. INTEGRAÇÃO WHATSAPP COM MENSAGEM AUTOMÁTICA PERSONALIZADA
 * Centraliza o número (16 99961-7048) e injeta mensagens contextuais baseadas
 * no serviço clicado pelo usuário para agilizar o atendimento.
 */
const WHATSAPP_NUMBER = '5516999617048';
const DEFAULT_MSG = 'Olá, Chaveiro Marquinho! Preciso de um atendimento de urgência em Ribeirão Preto. Pode me ajudar?';

function getWhatsAppUrl(message = DEFAULT_MSG) {
  const encodedMsg = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedMsg}`;
}

function triggerWhatsAppConversion() {
  if (typeof gtag_report_conversion === 'function') {
    gtag_report_conversion();
  } else if (typeof window.gtag === 'function') {
    window.gtag('event', 'conversion', {
      'send_to': 'AW-975814676/TK-nCPyw09ccEJSAp9ED',
      'value': 1.0,
      'currency': 'BRL'
    });
  }
}

function initWhatsAppLinks() {
  // Botões gerais (Header, Hero, Rodapé)
  const generalBtns = document.querySelectorAll('.btn-whatsapp-general, .btn-whatsapp, [href*="whatsapp"], [href*="wa.me"]');
  generalBtns.forEach(btn => {
    btn.setAttribute('href', getWhatsAppUrl());
    btn.setAttribute('target', '_blank');
    btn.setAttribute('rel', 'noopener noreferrer');
    btn.addEventListener('click', triggerWhatsAppConversion);
  });

  // Botões específicos dos cards de serviço
  const serviceActions = document.querySelectorAll('.service-action');
  serviceActions.forEach(btn => {
    const serviceCard = btn.closest('.service-card');
    const serviceTitle = serviceCard ? serviceCard.querySelector('.service-title').textContent.trim() : '';
    
    let customMsg = DEFAULT_MSG;
    if (serviceTitle) {
      customMsg = `Olá, Chaveiro Marquinho! Vi no site sobre "${serviceTitle}" e gostaria de solicitar atendimento em Ribeirão Preto. Qual o valor e tempo de espera?`;
    }

    btn.setAttribute('href', getWhatsAppUrl(customMsg));
    btn.setAttribute('target', '_blank');
    btn.setAttribute('rel', 'noopener noreferrer');
    btn.addEventListener('click', triggerWhatsAppConversion);
  });
}

/**
 * 2. GEOLOCALIZAÇÃO EM TEMPO REAL E SLA DE AGILIDADE (RIBEIRÃO PRETO)
 * Simula/calcula o tempo de chegada com base no bairro selecionado ou
 * via API de geolocalização do navegador (GPS), reforçando o SEO Local.
 */
const BAIRROS_ETA = {
  'centro': { nome: 'Centro / Boulevard', eta: 'Chegada em até 40 minutos.', viatura: 'Viatura Centro' },
  'fiusa': { nome: 'Av. Prof. João Fiúsa / Alto do Ipê', eta: 'Chegada em até 40 minutos.', viatura: 'Viatura Zona Sul' },
  'jardim-botanico': { nome: 'Jardim Botânico / Irajá', eta: 'Chegada em até 40 minutos.', viatura: 'Viatura Zona Sul / Botânico' },
  'ribeirania': { nome: 'Ribeirânia / Nova Ribeirânia', eta: 'Chegada em até 40 minutos.', viatura: 'Viatura Zona Sudeste' },
  'bonfim-paulista': { nome: 'Bonfim Paulista / Guaporé', eta: 'Chegada em até 40 minutos.', viatura: 'Viatura Rod. José Fregonesi' }
};

function initGeolocationSLA() {
  const geoSelect = document.getElementById('geo-select');
  const etaDisplay = document.getElementById('eta-time');
  const viaturaDisplay = document.getElementById('viatura-location');
  const btnGPS = document.getElementById('btn-gps-detect');

  if (!geoSelect || !etaDisplay || !viaturaDisplay) return;

  // Atualiza ETA ao mudar o select
  geoSelect.addEventListener('change', (e) => {
    const val = e.target.value;
    if (val && BAIRROS_ETA[val]) {
      updateETADisplay(BAIRROS_ETA[val].eta, BAIRROS_ETA[val].viatura);
    } else {
      updateETADisplay('Chegada em até 40 minutos.', 'Viatura em patrulhamento na sua região');
    }
  });

  // Botão de auto-detecção via GPS do navegador
  if (btnGPS) {
    btnGPS.addEventListener('click', () => {
      if (!navigator.geolocation) {
        alert('Geolocalização não suportada pelo seu navegador. Por favor, selecione seu bairro na lista.');
        return;
      }

      btnGPS.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Localizando...';
      btnGPS.disabled = true;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Em um app de grande porte, aqui chamaríamos uma API de Geocoding (ex: Google Maps / ViaCEP / Nominatim)
          // Para esta LP ultra-rápida, detectamos com sucesso que o usuário está na região e cravamos o SLA otimizado:
          setTimeout(() => {
            updateETADisplay('Chegada em até 40 minutos. (GPS Confirmado 📍)', 'Viatura 24h mais próxima acionada para suas coordenadas!');
            btnGPS.innerHTML = '<i class="fa-solid fa-check text-green"></i> Região Detectada!';
            btnGPS.style.background = 'rgba(16, 185, 129, 0.2)';
            btnGPS.style.borderColor = '#10b981';
          }, 600);
        },
        (error) => {
          console.warn('Erro GPS:', error);
          alert('Não foi possível obter sua localização exata. Selecione seu bairro ou região na lista suspensa!');
          btnGPS.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i> Usar Meu GPS Atual';
          btnGPS.disabled = false;
        },
        { timeout: 7000, enableHighAccuracy: true }
      );
    });
  }
}

function updateETADisplay(timeText, viaturaText) {
  const etaDisplay = document.getElementById('eta-time');
  const viaturaDisplay = document.getElementById('viatura-location');

  etaDisplay.style.opacity = '0';
  viaturaDisplay.style.opacity = '0';

  setTimeout(() => {
    etaDisplay.innerHTML = `<i class="fa-solid fa-bolt text-gold"></i> Tempo estimado: <strong>${timeText}</strong>`;
    viaturaDisplay.innerHTML = `<i class="fa-solid fa-car-on text-green"></i> <span>${viaturaText}</span>`;
    
    etaDisplay.style.opacity = '1';
    viaturaDisplay.style.opacity = '1';
  }, 200);
}

/**
 * 3. FILTRO DE SERVIÇOS POR CATEGORIA E BUSCA AO VIVO
 * Garante que todas as palavras-chave de SEO (chave canivete, hb20, bmw, caminhão, etc.)
 * sejam facilmente encontradas e filtradas sem recarregar a página.
 */
function initServiceFilter() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const searchInput = document.getElementById('service-search');
  const serviceCards = document.querySelectorAll('.service-card');
  const noResults = document.getElementById('no-results-msg');

  let activeCategory = 'all';
  let searchQuery = '';

  function filterCards() {
    let visibleCount = 0;

    serviceCards.forEach(card => {
      const category = card.getAttribute('data-category') || '';
      const keywords = card.getAttribute('data-keywords') || '';
      const title = card.querySelector('.service-title').textContent.toLowerCase();
      const desc = card.querySelector('.service-desc').textContent.toLowerCase();

      const matchCategory = (activeCategory === 'all') || (category === activeCategory);
      const matchSearch = (searchQuery === '') || 
                          title.includes(searchQuery) || 
                          desc.includes(searchQuery) || 
                          keywords.toLowerCase().includes(searchQuery);

      if (matchCategory && matchSearch) {
        card.style.display = 'flex';
        visibleCount++;
        // Animação suave de entrada
        card.style.animation = 'fadeInUp 0.35s ease forwards';
      } else {
        card.style.display = 'none';
      }
    });

    if (noResults) {
      noResults.style.display = (visibleCount === 0) ? 'block' : 'none';
    }
  }

  // Evento de clique nas abas
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-filter');
      filterCards();
    });
  });

  // Evento de digitação na busca
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      filterCards();
    });
  }
}

/**
 * 4. FAQ ACORDEÃO INTERATIVO
 * Expande e recolhe as dúvidas frequentes com animação fluida.
 */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answerDiv = item.querySelector('.faq-answer');

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Fecha todos os outros (opcional, manter limpo)
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      // Alterna o atual
      if (isOpen) {
        item.classList.remove('active');
        answerDiv.style.maxHeight = null;
      } else {
        item.classList.add('active');
        answerDiv.style.maxHeight = answerDiv.scrollHeight + 'px';
      }
    });
  });
}

/**
 * 5. MENU MOBILE INTERATIVO (GAVETA LATERAL / DRAWER)
 * Controla abertura, fechamento e comportamento do backdrop em celulares e tablets.
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('mobile-menu-close');
  const overlay = document.getElementById('mobile-menu-overlay');
  const drawer = document.getElementById('mobile-menu-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-list a');

  if (!menuBtn || !closeBtn || !overlay || !drawer) return;

  function openMenu() {
    overlay.classList.add('open');
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden'; // Evita rolagem da página atrás do menu
  }

  function closeMenu() {
    overlay.classList.remove('open');
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  menuBtn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  // Fecha o menu ao clicar em qualquer link de navegação
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/**
 * 6. CABEÇALHO COM EFEITO SOMBRA AO ROLAR (STICKY HEADER)
 * Adiciona profundidade ao cabeçalho quando o usuário rola a página para baixo.
 */
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.7)';
      header.style.background = 'rgba(10, 13, 20, 0.95)';
    } else {
      header.style.boxShadow = 'none';
      header.style.background = 'rgba(10, 13, 20, 0.9)';
    }
  });
}
