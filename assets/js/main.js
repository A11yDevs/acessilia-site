/**
 * Acessília — Scripts de Acessibilidade e Interatividade
 * Segue diretrizes WCAG 2.2 AAA e W3C WAI-ARIA APG
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
    announce(`Tamanho do texto ajustado para ${percentage} por cento`);
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

  btnToggleContrast?.addEventListener('click', () => {
    const isHigh = htmlEl.getAttribute('data-contrast') === 'high';
    if (isHigh) {
      htmlEl.setAttribute('data-contrast', 'normal');
      btnToggleContrast.setAttribute('aria-pressed', 'false');
      localStorage.setItem('acessilia_contrast', 'normal');
      announce('Modo de alto contraste desativado');
    } else {
      htmlEl.setAttribute('data-contrast', 'high');
      btnToggleContrast.setAttribute('aria-pressed', 'true');
      localStorage.setItem('acessilia_contrast', 'high');
      announce('Modo de alto contraste ativado');
    }
  });

  /* ==========================================================================
     3. Alternador de Tema Escuro / Claro
     ========================================================================== */
  const btnToggleTheme = document.getElementById('btn-toggle-theme');
  const themeIcon = document.getElementById('theme-icon');
  const themeLabel = document.getElementById('theme-label');

  // Detecta preferência do sistema
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('acessilia_theme') || (systemPrefersDark ? 'dark' : 'light');

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem('acessilia_theme', theme);

    if (theme === 'dark') {
      if (themeIcon) themeIcon.textContent = '☀️';
      if (themeLabel) themeLabel.textContent = 'Tema Claro';
      btnToggleTheme?.setAttribute('aria-label', 'Alternar para tema claro');
    } else {
      if (themeIcon) themeIcon.textContent = '🌙';
      if (themeLabel) themeLabel.textContent = 'Tema Escuro';
      btnToggleTheme?.setAttribute('aria-label', 'Alternar para tema escuro');
    }
  }

  applyTheme(savedTheme);

  btnToggleTheme?.addEventListener('click', () => {
    const current = htmlEl.getAttribute('data-theme') || 'light';
    const nextTheme = current === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    announce(`Tema alternado para ${nextTheme === 'dark' ? 'escuro' : 'claro'}`);
  });

  /* ==========================================================================
     4. Menu de Navegação Responsivo Acessível
     ========================================================================== */
  const btnNavToggle = document.getElementById('btn-nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  btnNavToggle?.addEventListener('click', () => {
    const isExpanded = btnNavToggle.getAttribute('aria-expanded') === 'true';
    btnNavToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu?.classList.toggle('is-active', !isExpanded);

    if (!isExpanded) {
      announce('Menu de navegação aberto');
    } else {
      announce('Menu de navegação fechado');
    }
  });

  // Fechar menu ao teclar Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu?.classList.contains('is-active')) {
      navMenu.classList.remove('is-active');
      btnNavToggle?.setAttribute('aria-expanded', 'false');
      btnNavToggle?.focus();
      announce('Menu fechado');
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
     5. Abas de Instalação (W3C ARIA Tab Pattern com Navegação por Setas)
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
      announce(`Aba selecionada: ${newTab.textContent.trim()}`);
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
     6. Botões de Copiar Código com Notificação Acessível
     ========================================================================== */
  document.querySelectorAll('.btn-copy').forEach(button => {
    button.addEventListener('click', async () => {
      const codeBlock = button.closest('.code-block');
      const code = codeBlock?.querySelector('pre code')?.innerText || '';

      try {
        await navigator.clipboard.writeText(code);
        const originalText = button.textContent;
        button.textContent = 'Copiado!';
        button.style.backgroundColor = 'var(--color-success)';
        button.style.color = '#FFFFFF';
        announce('Código copiado para a área de transferência');

        setTimeout(() => {
          button.textContent = originalText;
          button.style.backgroundColor = '';
          button.style.color = '';
        }, 2500);
      } catch (err) {
        announce('Falha ao copiar código automaticamente. Selecione e copie manualmente.');
      }
    });
  });

  /* ==========================================================================
     7. Simulador Interativo do Pipeline Acessília
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
        <p><span class="tag-badge">FÓRMULA MATHML</span> Expressão de equivalência massa-energia: <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>E</mi><mo>=</mo><mi>m</mi><msup><mi>c</mi><mn>2</mn></msup></math> (anotada para leitura linear por sintetizador).</p>
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

    btnRunSimulation.disabled = true;
    demoStatusText.textContent = 'Etapa 1/3: Analisando layout e extraindo estrutura com Docling e RapidOCR...';
    announce(demoStatusText.textContent);

    setTimeout(() => {
      demoStatusText.textContent = 'Etapa 2/3: Invocando agentes de IA para audiodescrição técnica e enriquecimento semântico...';
      announce(demoStatusText.textContent);

      setTimeout(() => {
        demoStatusText.textContent = 'Etapa 3/3: Exportando formatos (PDF/UA, MP3, HTML Semântico)... Concluído com sucesso!';
        announce('Simulação concluída com sucesso. Resultados exibidos.');

        if (demoResultsBox) demoResultsBox.style.display = 'block';
        if (demoRawContent) demoRawContent.textContent = data.raw;
        if (demoAccessibleContent) demoAccessibleContent.innerHTML = data.accessible;

        btnRunSimulation.disabled = false;
        demoResultsBox?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 900);
    }, 900);
  });
});
