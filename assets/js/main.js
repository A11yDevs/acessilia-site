/**
 * Acessília — Scripts de Acessibilidade e Interatividade
 * Segue rigorosamente as diretrizes WCAG 2.2 AAA e W3C WAI-ARIA APG
 * Universidade Federal de Goiás (UFG) • INF • LaMCAD • A11yDevs
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elementos globais
  const htmlEl = document.documentElement;
  const announcer = document.getElementById('a11y-announcer');

  /**
   * Comunica alterações para usuários de leitores de tela
   * @param {string} message 
   */
  function announce(message) {
    if (announcer) {
      announcer.textContent = '';
      setTimeout(() => {
        announcer.textContent = message;
      }, 50);
    }
  }

  /* ==========================================================================
     1. Controles de Tamanho de Fonte
     ========================================================================== */
  const btnFontDecrease = document.getElementById('btn-font-decrease');
  const btnFontReset = document.getElementById('btn-font-reset');
  const btnFontIncrease = document.getElementById('btn-font-increase');

  let currentFontScale = parseFloat(localStorage.getItem('acessilia_font_scale')) || 1;

  function updateFontScale(scale) {
    currentFontScale = Math.min(Math.max(scale, 0.85), 1.3);
    htmlEl.style.setProperty('--font-scale', currentFontScale);
    localStorage.setItem('acessilia_font_scale', currentFontScale);
    const percentage = Math.round(currentFontScale * 100);
    const lang = htmlEl.getAttribute('lang') || 'pt-BR';
    const msg = lang.startsWith('pt') 
      ? `Tamanho do texto ajustado para ${percentage} por cento`
      : `Text size adjusted to ${percentage} percent`;
    announce(msg);
  }

  if (currentFontScale !== 1) {
    htmlEl.style.setProperty('--font-scale', currentFontScale);
  }

  btnFontDecrease?.addEventListener('click', () => updateFontScale(currentFontScale - 0.1));
  btnFontReset?.addEventListener('click', () => updateFontScale(1));
  btnFontIncrease?.addEventListener('click', () => updateFontScale(currentFontScale + 0.1));

  /* ==========================================================================
     2. Alternador de Alto Contraste
     ========================================================================== */
  const btnToggleContrast = document.getElementById('btn-toggle-contrast');
  const savedContrast = localStorage.getItem('acessilia_contrast') || 'normal';

  if (savedContrast === 'high') {
    htmlEl.setAttribute('data-contrast', 'high');
    btnToggleContrast?.setAttribute('aria-pressed', 'true');
  }

  function toggleContrast() {
    const isHigh = htmlEl.getAttribute('data-contrast') === 'high';
    const lang = htmlEl.getAttribute('lang') || 'pt-BR';
    if (isHigh) {
      htmlEl.setAttribute('data-contrast', 'normal');
      btnToggleContrast?.setAttribute('aria-pressed', 'false');
      localStorage.setItem('acessilia_contrast', 'normal');
      announce(lang.startsWith('pt') ? 'Modo de alto contraste desativado' : 'High contrast mode disabled');
    } else {
      htmlEl.setAttribute('data-contrast', 'high');
      btnToggleContrast?.setAttribute('aria-pressed', 'true');
      localStorage.setItem('acessilia_contrast', 'high');
      announce(lang.startsWith('pt') ? 'Modo de alto contraste ativado' : 'High contrast mode activated');
    }
  }

  btnToggleContrast?.addEventListener('click', toggleContrast);

  /* ==========================================================================
     3. Alternador de Tema Escuro / Claro
     ========================================================================== */
  const btnToggleTheme = document.getElementById('btn-toggle-theme');
  const themeIcon = document.getElementById('theme-icon');
  const themeLabel = document.getElementById('theme-label');

  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('acessilia_theme') || (systemPrefersDark ? 'dark' : 'light');

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem('acessilia_theme', theme);
    const lang = htmlEl.getAttribute('lang') || 'pt-BR';

    if (theme === 'dark') {
      if (themeIcon) themeIcon.textContent = '☀️';
      if (themeLabel) themeLabel.textContent = lang.startsWith('pt') ? 'Tema Claro' : 'Light Mode';
      btnToggleTheme?.setAttribute('aria-label', lang.startsWith('pt') ? 'Alternar para tema claro' : 'Switch to light mode');
    } else {
      if (themeIcon) themeIcon.textContent = '🌙';
      if (themeLabel) themeLabel.textContent = lang.startsWith('pt') ? 'Tema Escuro' : 'Dark Mode';
      btnToggleTheme?.setAttribute('aria-label', lang.startsWith('pt') ? 'Alternar para tema escuro' : 'Switch to dark mode');
    }
  }

  applyTheme(savedTheme);

  function toggleTheme() {
    const current = htmlEl.getAttribute('data-theme') || 'light';
    const nextTheme = current === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    const lang = htmlEl.getAttribute('lang') || 'pt-BR';
    const modeName = nextTheme === 'dark' 
      ? (lang.startsWith('pt') ? 'escuro' : 'dark') 
      : (lang.startsWith('pt') ? 'claro' : 'light');
    announce(lang.startsWith('pt') ? `Tema alternado para ${modeName}` : `Theme changed to ${modeName}`);
  }

  btnToggleTheme?.addEventListener('click', toggleTheme);

  /* ==========================================================================
     4. Internacionalização (i18n PT-BR / EN)
     ========================================================================== */
  const btnToggleLang = document.getElementById('btn-toggle-lang');
  const langCurrentLabel = document.getElementById('lang-current-label');

  const i18nTranslations = {
    'pt-BR': {
      'lang.toggle_label': 'Mudar idioma para Inglês / Switch to English',
      'lang.button_text': 'EN',
      'toolbar.shortcuts': 'Atalhos (?)',
      'toolbar.contrast': 'Alto Contraste',
      'toolbar.theme_dark': 'Tema Escuro',
      'toolbar.theme_light': 'Tema Claro',
      'nav.home': 'Início',
      'nav.institutional': 'Institucional',
      'nav.research': 'Pesquisa & Artigo',
      'nav.ecosystem': 'Ecossistema',
      'nav.demo': 'Demonstração',
      'nav.how_to_use': 'Como Usar',
      'nav.roadmap': 'Roadmap',
      'nav.about': 'Sobre',
      'nav.features': 'Recursos',
      'nav.architecture': 'Arquitetura',
      'nav.formats': 'Formatos',
      'hero.badge': '🏛️ Pesquisa & Extensão UFG • Apoio LaMCAD • Software Livre',
      'hero.title': 'Inteligência Artificial Aberta para Documentos Acessíveis no Ensino Superior',
      'hero.lead': 'O <strong>Acessília</strong> é uma iniciativa multidisciplinar de pesquisa e extensão da <strong>Universidade Federal de Goiás (UFG)</strong> com apoio de supercomputação do <strong>LaMCAD/UFG</strong>. Desenvolvido em software livre, transforma apostilas, artigos e livros acadêmicos em <strong>PDF/UA</strong>, <strong>áudio narrado</strong> e <strong>HTML semântico</strong> com audiodescrição técnica para estudantes cegos e com baixa visão.',
      'hero.btn_start': 'Começar a Usar',
      'hero.btn_demo': 'Ver Demonstração Interativa',
      'hero.btn_audio': 'Ouvir Exemplo de Áudio',
      'audio.section_title': 'Demonstração Sonora Real & Download Acessível',
      'audio.section_subtitle': 'Experimente a síntese de voz com descrição detalhada de gráficos e equações matemáticas estruturadas, e baixe um pacote de exemplo.',
      'audio.badge': 'Síntese de Voz & Audiodescrição',
      'audio.card_title': 'Exemplo Narrado: Artigo de Física & Matemática',
      'audio.play': 'Reproduzir Áudio',
      'audio.pause': 'Pausar',
      'audio.stop': 'Parar',
      'audio.speed': 'Velocidade',
      'audio.download_sample': 'Baixar Amostra Acessível (.HTML / MathML)',
      'audio.download_desc': 'Pacote modelo com HTML5 semântico, MathML legível por leitor de tela, audiodescrição de imagem e tags WCAG 2.2 AAA.',
      'roadmap.badge': 'Planejamento Estratégico',
      'roadmap.title': 'Roadmap Público de Desenvolvimento',
      'roadmap.subtitle': 'Da concepção dos modelos agenticos à implantação no Núcleo de Acessibilidade da UFG e dispositivos vestíveis.',
      'satellites.badge': 'Iniciativas da Comunidade',
      'satellites.title': 'Projetos Satélites da Comunidade A11yDevs',
      'satellites.subtitle': 'Soluções complementares de hardware vestível, matemática móvel e padrões semânticos abertos.',
      'declaration.title': 'Declaração de Conformidade de Acessibilidade',
      'declaration.p1': 'O sítio oficial do Acessília foi projetado e auditado para alcançar nível AAA de conformidade segundo as Diretrizes de Acessibilidade para Conteúdo Web (WCAG 2.2) do W3C e as recomendações do e-MAG (Modelo de Acessibilidade em Governo Eletrônico).',
      'declaration.p2': 'A plataforma é validada continuamente com leitores de tela NVDA, JAWS, VoiceOver e Orca, além de navegação exclusiva por teclado.',
      'shortcuts.title': 'Atalhos de Teclado Globais',
      'shortcuts.key_col': 'Tecla de Atalho',
      'shortcuts.action_col': 'Ação Executada'
    },
    'en': {
      'lang.toggle_label': 'Mudar idioma para Português / Switch to Portuguese',
      'lang.button_text': 'PT',
      'toolbar.shortcuts': 'Shortcuts (?)',
      'toolbar.contrast': 'High Contrast',
      'toolbar.theme_dark': 'Dark Mode',
      'toolbar.theme_light': 'Light Mode',
      'nav.home': 'Home',
      'nav.institutional': 'Institutional',
      'nav.research': 'Research & Paper',
      'nav.ecosystem': 'Ecosystem',
      'nav.demo': 'Demonstration',
      'nav.how_to_use': 'Getting Started',
      'nav.roadmap': 'Roadmap',
      'nav.about': 'About',
      'nav.features': 'Features',
      'nav.architecture': 'Architecture',
      'nav.formats': 'Formats',
      'hero.badge': '🏛️ UFG Research & Outreach • Supported by LaMCAD • Open Source',
      'hero.title': 'Open Artificial Intelligence for Accessible Documents in Higher Education',
      'hero.lead': '<strong>Acessília</strong> is a multidisciplinary research and university outreach initiative at the <strong>Federal University of Goiás (UFG)</strong> powered by supercomputing from <strong>LaMCAD/UFG</strong>. Built as free open-source software, it transforms textbooks, papers, and course notes into <strong>PDF/UA</strong>, <strong>narrated audio</strong>, and <strong>semantic HTML</strong> with technical audio description for blind and low-vision students.',
      'hero.btn_start': 'Get Started',
      'hero.btn_demo': 'Interactive Demo',
      'hero.btn_audio': 'Listen to Audio Sample',
      'audio.section_title': 'Real Audio Demonstration & Accessible Sample Download',
      'audio.section_subtitle': 'Experience text-to-speech with detailed descriptions of technical charts and structured mathematical equations, and download an accessible sample package.',
      'audio.badge': 'Speech Synthesis & Audio Description',
      'audio.card_title': 'Narrated Sample: Physics & Mathematics Paper',
      'audio.play': 'Play Audio',
      'audio.pause': 'Pause',
      'audio.stop': 'Stop',
      'audio.speed': 'Speed',
      'audio.download_sample': 'Download Accessible Sample (.HTML / MathML)',
      'audio.download_desc': 'Template package with semantic HTML5, screen-reader readable MathML, image audio description, and WCAG 2.2 AAA compliance tags.',
      'roadmap.badge': 'Strategic Milestones',
      'roadmap.title': 'Public Development Roadmap',
      'roadmap.subtitle': 'From agentic pipeline conception to adoption at the UFG Accessibility Center and wearable assistive devices.',
      'satellites.badge': 'Community Initiatives',
      'satellites.title': 'A11yDevs Community Satellite Projects',
      'satellites.subtitle': 'Complementary open-source solutions for wearable hardware, mobile mathematics, and semantic accessibility standards.',
      'declaration.title': 'Accessibility Conformance Statement',
      'declaration.p1': 'The official Acessília website is designed and audited to achieve WCAG 2.2 Level AAA compliance as well as Brazilian government digital accessibility recommendations (e-MAG).',
      'declaration.p2': 'The platform is continuously tested using NVDA, JAWS, VoiceOver, and Orca screen readers, as well as keyboard-only navigation.',
      'shortcuts.title': 'Global Keyboard Shortcuts',
      'shortcuts.key_col': 'Shortcut Key',
      'shortcuts.action_col': 'Action'
    }
  };

  let currentLang = localStorage.getItem('acessilia_lang') || 'pt-BR';

  function applyLanguage(lang) {
    currentLang = lang;
    htmlEl.setAttribute('lang', lang);
    localStorage.setItem('acessilia_lang', lang);

    const strings = i18nTranslations[lang] || i18nTranslations['pt-BR'];

    // Atualiza botão de idioma
    if (btnToggleLang) {
      btnToggleLang.setAttribute('aria-label', strings['lang.toggle_label']);
    }
    if (langCurrentLabel) {
      langCurrentLabel.textContent = strings['lang.button_text'];
    }

    // Atualiza todos os nós marcados com data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (strings[key]) {
        el.innerHTML = strings[key];
      }
    });

    // Atualiza labels de acessibilidade com data-i18n-aria
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      if (strings[key]) {
        el.setAttribute('aria-label', strings[key]);
      }
    });

    // Atualiza texto do tema caso necessário
    const isDark = htmlEl.getAttribute('data-theme') === 'dark';
    if (themeLabel) {
      themeLabel.textContent = isDark 
        ? (lang.startsWith('pt') ? 'Tema Claro' : 'Light Mode')
        : (lang.startsWith('pt') ? 'Tema Escuro' : 'Dark Mode');
    }
  }

  // Aplica idioma inicial
  if (currentLang !== 'pt-BR') {
    applyLanguage(currentLang);
  }

  function toggleLanguage() {
    const nextLang = currentLang === 'pt-BR' ? 'en' : 'pt-BR';
    applyLanguage(nextLang);
    const msg = nextLang === 'pt-BR'
      ? 'Idioma alterado para Português (Brasil)'
      : 'Language changed to English';
    announce(msg);
  }

  btnToggleLang?.addEventListener('click', toggleLanguage);

  /* ==========================================================================
     5. Menu de Navegação Responsivo Acessível & Destaque de Página Ativa
     ========================================================================== */
  const btnNavToggle = document.getElementById('btn-nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  // Identifica página atual e define aria-current="page"
  const rawPath = window.location.pathname.split('/').pop() || 'index.html';
  const currentPath = rawPath === '' ? 'index.html' : rawPath;
  document.querySelectorAll('#primary-nav .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === 'index.html' && (href === 'index.html' || href === './' || href === '/'))) {
      link.setAttribute('aria-current', 'page');
      link.classList.add('is-active');
    } else {
      link.removeAttribute('aria-current');
      link.classList.remove('is-active');
    }
  });

  btnNavToggle?.addEventListener('click', () => {
    const isExpanded = btnNavToggle.getAttribute('aria-expanded') === 'true';
    btnNavToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu?.classList.toggle('is-active', !isExpanded);

    const lang = htmlEl.getAttribute('lang') || 'pt-BR';
    if (!isExpanded) {
      announce(lang.startsWith('pt') ? 'Menu de navegação aberto' : 'Navigation menu opened');
    } else {
      announce(lang.startsWith('pt') ? 'Menu de navegação fechado' : 'Navigation menu closed');
    }
  });

  // Fechar menu ao teclar Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu?.classList.contains('is-active')) {
      navMenu.classList.remove('is-active');
      btnNavToggle?.setAttribute('aria-expanded', 'false');
      btnNavToggle?.focus();
      const lang = htmlEl.getAttribute('lang') || 'pt-BR';
      announce(lang.startsWith('pt') ? 'Menu fechado' : 'Menu closed');
    }
  });

  // Fechar menu ao clicar em um link interno
  navMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768 && navMenu.classList.contains('is-active')) {
        navMenu.classList.remove('is-active');
        btnNavToggle?.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* ==========================================================================
     6. Abas de Instalação (W3C ARIA Tab Pattern com Navegação por Setas)
     ========================================================================== */
  const tabsList = document.querySelector('.tabs__list');
  if (tabsList) {
    const tabs = Array.from(tabsList.querySelectorAll('[role="tab"]'));
    const panels = Array.from(document.querySelectorAll('.tab-panel'));

    function selectTab(newTab) {
      tabs.forEach(tab => {
        const isSelected = tab === newTab;
        tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        tab.setAttribute('tabindex', isSelected ? '0' : '-1');
      });

      panels.forEach(panel => {
        const match = panel.id === newTab.getAttribute('aria-controls');
        panel.hidden = !match;
      });

      newTab.focus();
      const lang = htmlEl.getAttribute('lang') || 'pt-BR';
      const label = newTab.textContent.trim();
      announce(lang.startsWith('pt') ? `Aba selecionada: ${label}` : `Selected tab: ${label}`);
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => selectTab(tab));

      tab.addEventListener('keydown', (e) => {
        let targetIndex = null;
        if (e.key === 'ArrowRight') {
          targetIndex = (index + 1) % tabs.length;
        } else if (e.key === 'ArrowLeft') {
          targetIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (e.key === 'Home') {
          targetIndex = 0;
        } else if (e.key === 'End') {
          targetIndex = tabs.length - 1;
        }

        if (targetIndex !== null) {
          e.preventDefault();
          selectTab(tabs[targetIndex]);
        }
      });
    });
  }

  /* ==========================================================================
     7. Botões de Copiar Código com Notificação Acessível
     ========================================================================== */
  document.querySelectorAll('.btn-copy').forEach(button => {
    button.addEventListener('click', async () => {
      const codeBlock = button.closest('.code-block') || button.closest('.citation-block');
      const code = codeBlock?.querySelector('pre code')?.innerText || '';
      const lang = htmlEl.getAttribute('lang') || 'pt-BR';

      try {
        await navigator.clipboard.writeText(code);
        const originalText = button.textContent;
        button.textContent = lang.startsWith('pt') ? 'Copiado!' : 'Copied!';
        button.style.backgroundColor = 'var(--color-success)';
        button.style.color = '#FFFFFF';
        announce(lang.startsWith('pt') ? 'Código copiado para a área de transferência' : 'Code copied to clipboard');

        setTimeout(() => {
          button.textContent = originalText;
          button.style.backgroundColor = '';
          button.style.color = '';
        }, 2500);
      } catch (err) {
        announce(lang.startsWith('pt') ? 'Falha ao copiar automaticamente. Selecione e copie manualmente.' : 'Failed to copy. Please copy manually.');
      }
    });
  });

  /* ==========================================================================
     8. Simulador Interativo do Pipeline Acessília
     ========================================================================== */
  const btnRunSimulation = document.getElementById('btn-run-simulation');
  const demoSelectDoc = document.getElementById('demo-select-doc');
  const demoStatusText = document.getElementById('demo-status-text');
  const demoResultsBox = document.getElementById('demo-results-box');
  const demoRawContent = document.getElementById('demo-raw-content');
  const demoAccessibleContent = document.getElementById('demo-accessible-content');

  const simulationData = {
    artigo: {
      raw: `Fig 1. Grafico_analise_2026.png\nEquacao 4: E = mc^2\n1. INTRODUCAO O processamento de linguagem natural...\nTab. 1 Taxa de Acuracia Algoritmo Baseline 72% Nosso 94%`,
      accessible: `
        <p><span class="tag-badge">H1</span> <strong>1. INTRODUÇÃO: O processamento de linguagem natural...</strong></p>
        <p><span class="tag-badge">AUDIODESCRIÇÃO</span> <em>Gráfico de barras vertical comparando a taxa de acurácia. O algoritmo baseline atinge 72%, enquanto a abordagem Acessília alcança 94%, um ganho de 22 pontos percentuais.</em></p>
        <p><span class="tag-badge">FÓRMULA MATHML</span> Expressão de equivalência massa-energia: <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>E</mi><mo>=</mo><mi>m</mi><msup><mi>c</mi><mn>2</mn></msup></math> (anotada para leitura linear por sintetizador de voz).</p>
        <p><span class="tag-badge">TABELA ACESSÍVEL</span> Tabela com cabeçalhos <code>&lt;th scope="col"&gt;</code> devidamente associados às células de dados.</p>
        <p><span class="tag-badge">ÁUDIO MP3</span> Faixa 01 gerada: <em>"Introdução e análise de resultados"</em> (03:45).</p>
      `
    },
    apostila: {
      raw: `CAP 3 - ESTRUTURAS DE DADOS\nColuna A Coluna B Lista Pilha\nFila Arvore Grafos\n[Imagem diagrama_arvore.jpg sem texto alternativo]`,
      accessible: `
        <p><span class="tag-badge">H2</span> <strong>Capítulo 3 — Estruturas de Dados Fundamentais</strong></p>
        <p><span class="tag-badge">AUDIODESCRIÇÃO</span> <em>Diagrama de árvore binária de busca com raiz no nó 50, subárvore esquerda com nós 30 e 20, e subárvore direita com nós 70 e 85.</em></p>
        <p><span class="tag-badge">LISTA SEMÂNTICA</span> Lista ordenada de 5 itens com hierarquia preservada (Listas, Pilhas, Filas, Árvores e Grafos).</p>
        <p><span class="tag-badge">PDF/UA TAGS</span> Estrutura validada com 100% de conformidade PAC (PDF Accessibility Checker).</p>
      `
    },
    relatorio: {
      raw: `GOVERNO FEDERAL RELATORIO 2026\n(Texto escaneado com ruido visual e 2 colunas tortas)\nOrcamento: R$ 450M investidos em acessibilidade digital.`,
      accessible: `
        <p><span class="tag-badge">OCR LIMPO</span> Remoção de ruídos de digitalização e alinhamento ortográfico via LLM.</p>
        <p><span class="tag-badge">H1</span> <strong>Relatório Governamental de Acessibilidade Digital 2026</strong></p>
        <p><span class="tag-badge">ORDEM DE LEITURA</span> Linearização correta das 2 colunas, evitando leitura intercalada.</p>
        <p><span class="tag-badge">EXPORTAÇÃO</span> DOCX acessível + PDF/UA + Áudio narrado MP3 prontos para download.</p>
      `
    }
  };

  btnRunSimulation?.addEventListener('click', () => {
    const docKey = demoSelectDoc ? demoSelectDoc.value : 'artigo';
    const data = simulationData[docKey];
    const lang = htmlEl.getAttribute('lang') || 'pt-BR';

    btnRunSimulation.disabled = true;
    demoStatusText.textContent = lang.startsWith('pt') 
      ? 'Etapa 1/3: Analisando layout e extraindo estrutura com Docling e RapidOCR...'
      : 'Step 1/3: Analyzing layout and extracting structure with Docling and RapidOCR...';
    announce(demoStatusText.textContent);

    setTimeout(() => {
      demoStatusText.textContent = lang.startsWith('pt')
        ? 'Etapa 2/3: Invocando agentes de IA para audiodescrição técnica e enriquecimento semântico...'
        : 'Step 2/3: Invoking AI agents for technical audio description and semantic enrichment...';
      announce(demoStatusText.textContent);

      setTimeout(() => {
        demoStatusText.textContent = lang.startsWith('pt')
          ? 'Etapa 3/3: Exportando formatos (PDF/UA, MP3, HTML Semântico)... Concluído com sucesso!'
          : 'Step 3/3: Exporting accessible formats (PDF/UA, MP3, Semantic HTML)... Finished successfully!';
        announce(lang.startsWith('pt') ? 'Simulação concluída com sucesso. Resultados exibidos.' : 'Simulation completed successfully. Results displayed.');

        if (demoResultsBox) demoResultsBox.style.display = 'block';
        if (demoRawContent) demoRawContent.textContent = data.raw;
        if (demoAccessibleContent) demoAccessibleContent.innerHTML = data.accessible;

        btnRunSimulation.disabled = false;
        demoResultsBox?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 900);
    }, 900);
  });

  /* ==========================================================================
     9. Player de Áudio e Síntese de Voz Acessível (Web Speech API)
     ========================================================================== */
  const audioPlayBtn = document.getElementById('audio-play-btn');
  const audioStopBtn = document.getElementById('audio-stop-btn');
  const audioRateSelect = document.getElementById('audio-rate-select');
  const audioProgressBar = document.getElementById('audio-progress-bar');
  const audioTimeDisplay = document.getElementById('audio-time-display');
  const audioTranscript = document.getElementById('audio-transcript');
  const btnDownloadSample = document.getElementById('btn-download-sample');

  let synthUtterance = null;
  let isSpeaking = false;
  let isPaused = false;
  let speechProgressTimer = null;
  let simulatedSeconds = 0;
  const totalSimulatedSeconds = 24;

  const demoPhrasesPt = [
    "Acessília: Demonstração de audiodescrição técnica e matemática acessível.",
    "Figura 1: Gráfico comparativo de desempenho.",
    "No eixo horizontal estão os modelos e no eixo vertical a taxa de acurácia.",
    "O algoritmo de linha de base obtém 72 porcento, enquanto o pipeline Acessília atinge 94 porcento.",
    "Equação matemática 4: E é igual a m vezes c ao quadrado.",
    "Fórmula quadrática: x é igual a menos b mais ou menos raiz quadrada de delta dividido por dois a.",
    "Documento integralmente acessível em conformidade com o padrão internacional PDF/UA."
  ];

  const demoPhrasesEn = [
    "Acessília: Demonstration of technical audio description and accessible mathematics.",
    "Figure 1: Comparative performance chart.",
    "The horizontal axis lists the models, and the vertical axis indicates accuracy rate.",
    "The baseline algorithm scores 72 percent, whereas the Acessília pipeline reaches 94 percent.",
    "Mathematical equation 4: E equals m times c squared.",
    "Quadratic formula: x equals minus b plus or minus square root of delta divided by two a.",
    "Fully accessible document compliant with international PDF/UA standards."
  ];

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function highlightSentence(index) {
    if (!audioTranscript) return;
    const spans = audioTranscript.querySelectorAll('.transcript-phrase');
    spans.forEach((s, idx) => {
      if (idx === index) {
        s.classList.add('is-active');
        s.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        s.classList.remove('is-active');
      }
    });
  }

  function resetAudioPlayer() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    clearInterval(speechProgressTimer);
    isSpeaking = false;
    isPaused = false;
    simulatedSeconds = 0;

    if (audioPlayBtn) {
      audioPlayBtn.setAttribute('aria-pressed', 'false');
      const lang = htmlEl.getAttribute('lang') || 'pt-BR';
      audioPlayBtn.innerHTML = `<span class="icon" aria-hidden="true">▶</span> <span>${lang.startsWith('pt') ? 'Reproduzir Áudio' : 'Play Audio'}</span>`;
    }
    if (audioProgressBar) {
      audioProgressBar.style.width = '0%';
      audioProgressBar.setAttribute('aria-valuenow', '0');
    }
    if (audioTimeDisplay) {
      audioTimeDisplay.textContent = `00:00 / ${formatTime(totalSimulatedSeconds)}`;
    }
    highlightSentence(-1);
  }

  function startSpeech() {
    if (!('speechSynthesis' in window)) {
      announce('Síntese de voz não suportada pelo seu navegador.');
      return;
    }

    const lang = htmlEl.getAttribute('lang') || 'pt-BR';
    const phrases = lang.startsWith('pt') ? demoPhrasesPt : demoPhrasesEn;
    const fullText = phrases.join(' ');

    window.speechSynthesis.cancel();
    synthUtterance = new SpeechSynthesisUtterance(fullText);
    synthUtterance.lang = lang.startsWith('pt') ? 'pt-BR' : 'en-US';

    const selectedRate = parseFloat(audioRateSelect ? audioRateSelect.value : 1.0);
    synthUtterance.rate = selectedRate;

    // Tentar selecionar voz natural correspondente
    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find(v => v.lang.startsWith(lang.startsWith('pt') ? 'pt' : 'en'));
    if (targetVoice) {
      synthUtterance.voice = targetVoice;
    }

    isSpeaking = true;
    isPaused = false;
    simulatedSeconds = 0;

    if (audioPlayBtn) {
      audioPlayBtn.setAttribute('aria-pressed', 'true');
      audioPlayBtn.innerHTML = `<span class="icon" aria-hidden="true">❚❚</span> <span>${lang.startsWith('pt') ? 'Pausar' : 'Pause'}</span>`;
    }

    let currentPhraseIdx = 0;
    highlightSentence(0);

    const stepInterval = Math.max(200, Math.floor((totalSimulatedSeconds * 1000) / (phrases.length * 4) / selectedRate));

    speechProgressTimer = setInterval(() => {
      if (isPaused) return;

      simulatedSeconds += (stepInterval / 1000) * selectedRate;
      const progressPercent = Math.min(100, Math.round((simulatedSeconds / totalSimulatedSeconds) * 100));

      if (audioProgressBar) {
        audioProgressBar.style.width = `${progressPercent}%`;
        audioProgressBar.setAttribute('aria-valuenow', progressPercent.toString());
      }
      if (audioTimeDisplay) {
        audioTimeDisplay.textContent = `${formatTime(simulatedSeconds)} / ${formatTime(totalSimulatedSeconds)}`;
      }

      const phraseStep = totalSimulatedSeconds / phrases.length;
      const calculatedIdx = Math.min(phrases.length - 1, Math.floor(simulatedSeconds / phraseStep));
      if (calculatedIdx !== currentPhraseIdx) {
        currentPhraseIdx = calculatedIdx;
        highlightSentence(currentPhraseIdx);
      }

      if (simulatedSeconds >= totalSimulatedSeconds) {
        clearInterval(speechProgressTimer);
      }
    }, stepInterval);

    synthUtterance.onend = () => {
      resetAudioPlayer();
      announce(lang.startsWith('pt') ? 'Reprodução de áudio concluída.' : 'Audio playback completed.');
    };

    synthUtterance.onerror = () => {
      resetAudioPlayer();
    };

    window.speechSynthesis.speak(synthUtterance);
    announce(lang.startsWith('pt') ? 'Iniciando audiodescrição técnica narrada' : 'Starting narrated technical audio description');
  }

  audioPlayBtn?.addEventListener('click', () => {
    if (!isSpeaking) {
      startSpeech();
    } else if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      isPaused = true;
      const lang = htmlEl.getAttribute('lang') || 'pt-BR';
      audioPlayBtn.innerHTML = `<span class="icon" aria-hidden="true">▶</span> <span>${lang.startsWith('pt') ? 'Continuar' : 'Resume'}</span>`;
      announce(lang.startsWith('pt') ? 'Áudio pausado' : 'Audio paused');
    } else if (isSpeaking && isPaused) {
      window.speechSynthesis.resume();
      isPaused = false;
      const lang = htmlEl.getAttribute('lang') || 'pt-BR';
      audioPlayBtn.innerHTML = `<span class="icon" aria-hidden="true">❚❚</span> <span>${lang.startsWith('pt') ? 'Pausar' : 'Pause'}</span>`;
      announce(lang.startsWith('pt') ? 'Áudio retomado' : 'Audio resumed');
    }
  });

  audioStopBtn?.addEventListener('click', () => {
    resetAudioPlayer();
    const lang = htmlEl.getAttribute('lang') || 'pt-BR';
    announce(lang.startsWith('pt') ? 'Áudio interrompido' : 'Audio stopped');
  });

  audioRateSelect?.addEventListener('change', () => {
    if (isSpeaking) {
      startSpeech(); // Reinicia com a nova velocidade
    }
  });

  // Download do Modelo Acessível
  btnDownloadSample?.addEventListener('click', () => {
    const lang = htmlEl.getAttribute('lang') || 'pt-BR';
    const sampleHtmlContent = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Acessília — Amostra de Documento Acessível (WCAG 2.2 AAA / PDF/UA)</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; max-width: 800px; margin: 2rem auto; padding: 0 1rem; color: #1e293b; }
    h1, h2 { color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.3rem; }
    .a11y-box { border-left: 4px solid #2563eb; background: #eff6ff; padding: 1rem; margin: 1.5rem 0; }
    figure { border: 1px solid #cbd5e1; padding: 1rem; border-radius: 6px; margin: 1.5rem 0; }
    figcaption { margin-top: 0.5rem; font-style: italic; color: #475569; }
    math { font-size: 1.25rem; }
  </style>
</head>
<body>
  <header>
    <h1>Acessília: Amostra Estruturada de Documento Acessível</h1>
    <p><strong>Instituição:</strong> Universidade Federal de Goiás (UFG) • INF • LaMCAD • A11yDevs</p>
  </header>
  <main>
    <section>
      <h2>1. Gráfico Técnico com Audiodescrição Estruturada</h2>
      <figure>
        <svg width="400" height="200" viewBox="0 0 400 200" role="img" aria-labelledby="chart-title chart-desc">
          <title id="chart-title">Comparação de Acurácia entre Algoritmos</title>
          <desc id="chart-desc">Gráfico de barras: Modelo Baseline tem 72% de acurácia; Pipeline Acessília tem 94% de acurácia.</desc>
          <rect x="50" y="56" width="80" height="144" fill="#64748b" />
          <rect x="180" y="12" width="80" height="188" fill="#2563eb" />
          <text x="50" y="50" font-size="14">Baseline: 72%</text>
          <text x="180" y="10" font-size="14" font-weight="bold">Acessília: 94%</text>
        </svg>
        <figcaption>Figura 1: Desempenho comparativo com ganho de 22 pontos percentuais.</figcaption>
      </figure>
    </section>
    <section>
      <h2>2. Fórmula Matemática em MathML Semântico</h2>
      <div class="a11y-box">
        <p>Equação de equivalência massa-energia formulada por Albert Einstein:</p>
        <math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
          <mrow>
            <mi>E</mi>
            <mo>=</mo>
            <mi>m</mi>
            <mo>&times;</mo>
            <msup>
              <mi>c</mi>
              <mn>2</mn>
            </msup>
          </mrow>
        </math>
      </div>
    </section>
  </main>
  <footer>
    <hr>
    <p><small>© 2026 Acessília • Licença MIT • Gerado por agentes de IA da UFG</small></p>
  </footer>
</body>
</html>`;

    const blob = new Blob([sampleHtmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'acessilia-amostra-documento-acessivel.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    announce(lang.startsWith('pt') 
      ? 'Download da amostra acessível concluído com sucesso.' 
      : 'Accessible sample download completed successfully.');
  });

  /* ==========================================================================
     10. Modal de Atalhos de Teclado (<dialog>) & Navegação Global
     ========================================================================== */
  const modalShortcuts = document.getElementById('modal-shortcuts');
  const btnOpenShortcuts = document.getElementById('btn-open-shortcuts');
  const btnCloseShortcuts = document.getElementById('btn-close-shortcuts');

  function openShortcutsModal() {
    if (modalShortcuts && typeof modalShortcuts.showModal === 'function') {
      modalShortcuts.showModal();
      const lang = htmlEl.getAttribute('lang') || 'pt-BR';
      announce(lang.startsWith('pt') ? 'Janela de atalhos de teclado aberta. Pressione Escape para fechar.' : 'Keyboard shortcuts dialog opened. Press Escape to close.');
    }
  }

  function closeShortcutsModal() {
    if (modalShortcuts && modalShortcuts.open) {
      modalShortcuts.close();
      btnOpenShortcuts?.focus();
      const lang = htmlEl.getAttribute('lang') || 'pt-BR';
      announce(lang.startsWith('pt') ? 'Janela de atalhos fechada.' : 'Shortcuts dialog closed.');
    }
  }

  btnOpenShortcuts?.addEventListener('click', openShortcutsModal);
  btnCloseShortcuts?.addEventListener('click', closeShortcutsModal);

  modalShortcuts?.addEventListener('click', (e) => {
    // Fecha ao clicar fora do conteúdo interno
    const rect = modalShortcuts.getBoundingClientRect();
    const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height
      && rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
    if (!isInDialog) {
      closeShortcutsModal();
    }
  });

  // Atalhos Globais de Teclado
  document.addEventListener('keydown', (e) => {
    // Se estiver digitando em um input ou select, ignorar atalhos simples
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
      return;
    }

    // Tecla '?' abre a modal de atalhos
    if (e.key === '?' || (e.shiftKey && e.key === '/')) {
      e.preventDefault();
      openShortcutsModal();
      return;
    }

    // Tecla Escape fecha a modal se aberta
    if (e.key === 'Escape' && modalShortcuts?.open) {
      closeShortcutsModal();
      return;
    }

    // Atalhos com Alt
    if (e.altKey && !e.ctrlKey && !e.metaKey) {
      const key = e.key.toLowerCase();
      if (key === '1') {
        e.preventDefault();
        const main = document.getElementById('main-content');
        main?.focus();
        announce('Saltou para o conteúdo principal');
      } else if (key === '2') {
        e.preventDefault();
        const tb = document.getElementById('accessibility-toolbar');
        tb?.scrollIntoView({ behavior: 'smooth' });
        btnFontDecrease?.focus();
        announce('Saltou para a barra de acessibilidade');
      } else if (key === '3') {
        e.preventDefault();
        const nav = document.getElementById('primary-nav');
        nav?.scrollIntoView({ behavior: 'smooth' });
        navMenu?.querySelector('a')?.focus();
        announce('Saltou para o menu de navegação');
      } else if (key === 'c') {
        e.preventDefault();
        toggleContrast();
      } else if (key === 't') {
        e.preventDefault();
        toggleTheme();
      } else if (key === 'l') {
        e.preventDefault();
        toggleLanguage();
      }
    }
  });

});
