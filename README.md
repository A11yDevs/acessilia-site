# Acessília — Site Oficial & Documentação Web

[![Website](https://img.shields.io/badge/Website-acessilia.org-blue?logo=googlechrome)](https://acessilia.org/)
[![WCAG AAA](https://img.shields.io/badge/Acessibilidade-WCAG%202.2%20AAA-green)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Org](https://img.shields.io/badge/Organização-A11yDevs-1E40AF)](https://github.com/A11yDevs)

Este repositório contém o código-fonte do website oficial do projeto **[Acessília](https://github.com/A11yDevs/acessilia)**, hospedado via **GitHub Pages**.

🔗 **Acesse o site online:** [https://acessilia.org/](https://acessilia.org/) (ou [https://a11ydevs.github.io/acessilia-site/](https://a11ydevs.github.io/acessilia-site/))

---

## 🏛️ Frentes Institucionais & Multidisciplinares

O **Acessília** é um projeto multidisciplinar que integra:

- **🔬 Projeto de Pesquisa Científica (UFG / INF / LaMCAD):** Desenvolvido no Instituto de Informática da Universidade Federal de Goiás, com apoio da infraestrutura de supercomputação do **LaMCAD/UFG** (Laboratório Multiusuário de Computação de Alto Desempenho e Arquitetura de Dados). A pesquisa fundamenta suas decisões técnicas na resolução dos desafios descritos no benchmark internacional **Dr.DocBench** (*A Comprehensive Benchmark for Expert-Level and Difficult Document Parsing*, arXiv:2606.01393).
- **🎓 Projeto de Extensão Universitária A11yDevs:** O Acessília é uma das principais frentes do projeto de extensão acadêmica da UFG, promovendo capacitação, difusão de diretrizes de acessibilidade e desenvolvimento de tecnologias assistivas de impacto social.
- **♿ Acessibilidade no Ensino Superior & Núcleo UFG:** Voltado para atender demandas de adaptação e conversão de livros didáticos, apostilas e artigos acadêmicos (PDF/UA e audiodescrição técnica) para estudantes cegos e com baixa visão. O sistema está **em fase de preparação e planejamento para ser colocado em uso em breve pelo Núcleo de Acessibilidade da UFG**.
- **🌐 Comunidade de Software Livre:** Iniciativa 100% aberta (Licença MIT) coordenada pelo **Prof. Dr. Marcelo Akira Inuzuka** e liderada tecnicamente por **Jhonata Fernandes Cordeiro**, com colaboração de estudantes, pesquisadores e voluntários.

---

## 🧩 Repositórios do Ecossistema Acessília

A plataforma é composta por quatro módulos complementares e integrados:

1. **[acessilia](https://github.com/A11yDevs/acessilia) (Core da Plataforma):**
   Núcleo inteligente que orquestra os pipelines de extração (Docling + RapidOCR) e agentes LLM (Ollama/OpenRouter). Gera exportações em PDF/UA (ISO 14289), áudio sintetizado MP3, HTML semântico e DOCX. Conta com API FastAPI, painel web acessível, bot do Telegram e CLI.

2. **[acessilia-ufg](https://github.com/A11yDevs/acessilia-ufg) (Gestor Acadêmico Institucional):**
   Painel institucional independente em Node.js e Fastify com SQLite WAL (30 tabelas normalizadas). Gerencia cursos, turmas, discentes com deficiência, docentes e fluxos de revisão humana de materiais. Desenvolvido para a administração acadêmica e em preparação para operação no Núcleo de Acessibilidade da UFG.

3. **[acessilia-toolbox](https://github.com/A11yDevs/acessilia-toolbox) (Gateway de Ferramentas & MCP):**
   Caixa de ferramentas sem estado (*stateless*) que expõe capacidades determinísticas via REST e **Model Context Protocol (MCP)**. Implementa planejamento formal PDDL e mediação neutra entre agentes e provedores (`docling-serve`, `MinerU`, MinIO, Valkey), evitando acoplamento direto a fornecedores.

4. **[acessilia-dataset](https://github.com/A11yDevs/acessilia-dataset) (Infraestrutura de Testes & Ground Truth):**
   Acervo padronizado de documentos reais e sintéticos desafiadores (fórmulas matemáticas de Bhaskara, integrais, matrizes, somatórios e tabelas) com suas extrações canônicas de referência (*ground truth*). Garante prevenção de regressão em pipelines de CI/CD via submódulo Git ou pacote Python.

---

## 🎯 Sobre o Projeto

O **Acessília** é uma plataforma de inteligência artificial orientada a agentes para extração de estruturas complexas de documentos (PDF, imagens, apostilas, DOCX) e conversão automática para formatos acessíveis de padrão internacional (**PDF/UA**, **áudio narrado MP3**, **HTML semântico** e **DOCX**).

Este website foi construído para apresentar o projeto, suas frentes institucionais, guias de execução e demonstrador interativo, priorizando os mais altos padrões de acessibilidade web.

---

## ♿ Recursos de Acessibilidade do Site

O site foi construído seguindo rigorosamente as diretrizes **WCAG 2.2 Nível AAA** e o **e-MAG** (Modelo de Acessibilidade em Governo Eletrônico):

- **Navegação completa por teclado:** Suporte a atalhos e salto rápido para o conteúdo principal (`Skip Links`).
- **Anéis de foco reforçados (`:focus-visible`):** Destaque nítido e de alto contraste em todos os elementos interativos.
- **Barra de acessibilidade nativa:**
  - Redimensionamento dinâmico de fonte (A-, Normal, A+);
  - Modo de **Alto Contraste** (preto e amarelo/branco);
  - Alternador de **Tema Escuro / Claro** com persistência no `localStorage`.
- **Regiões dinâmicas (`aria-live`):** Comunicação em tempo real para tecnologias assistivas e leitores de tela (NVDA, JAWS, VoiceOver, Orca).
- **Semântica HTML5 nativa:** Estruturação hierárquica clara de cabeçalhos (`h1` a `h6`), listas, marcos ARIA e tabelas acessíveis com `scope="col"`.
- **Respeito às preferências do usuário:** Suporte completo a `@media (prefers-reduced-motion)` e `@media (prefers-color-scheme)`.

---

## 📁 Estrutura de Arquivos

```text
acessilia-site/
├── .github/
│   └── workflows/
│       └── deploy.yml      # Workflow de deploy automático no GitHub Pages
├── assets/
│   ├── css/
│   │   └── style.css       # Estilos acessíveis com variáveis CSS e temas
│   └── js/
│       └── main.js         # Lógica de acessibilidade, abas ARIA e simulador
├── .nojekyll               # Desativa o processador Jekyll no Pages
├── index.html              # Página principal do website
└── README.md               # Documentação do repositório
```

---

## 🚀 Como Executar Localmente

Como o projeto é composto por tecnologias web nativas (HTML5, CSS3 e JavaScript puro), você pode executá-lo com qualquer servidor estático local:

### Usando Python 3
```bash
python -m http.server 3000
```
Depois, abra `http://localhost:3000` no seu navegador.

### Usando Node.js / npx
```bash
npx serve .
```

---

## 🔄 Deploy no GitHub Pages

O deploy é executado automaticamente pelo GitHub Actions a cada commit na branch `main`.

Para verificar ou habilitar nas configurações do repositório:
1. Acesse **Settings** > **Pages** no repositório.
2. Em **Build and deployment** > **Source**, selecione **GitHub Actions**.

---

## 🤝 Como Contribuir

Contribuições são muito bem-vindas! Sinta-se à vontade para:
1. Fazer um Fork do projeto.
2. Criar uma branch de funcionalidade (`git checkout -b feature/nova-melhoria`).
3. Submeter um Pull Request.

---

## 📜 Licença

Distribuído sob a licença MIT. Consulte o arquivo de licença do ecossistema [Acessília](https://github.com/A11yDevs/acessilia) para mais detalhes.

Copyright © 2026 **A11yDevs** — Jhonata Fernandes Cordeiro.
