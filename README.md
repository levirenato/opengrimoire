# OpenGrimoire

> Teste aqui -> <https://levirenato.github.io/dd-sheet>

> Um gerenciador de fichas para D&D 5ª Edição simples, moderno, internacional e 100% offline.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.1.0-green.svg)
![Tech](https://img.shields.io/badge/tech-HTML%20%7C%20CSS%20%7C%20JS-orange.svg)

## Sobre o Projeto

O **OpenGrimoire** (antigo _Grimório de Lendas_) é uma aplicação web focada na simplicidade e na experiência do usuário para gerenciar personagens de RPG de mesa.

Diferente de plataformas complexas, este projeto foi construído para ser **leve**, **rápido** e **totalmente independente de servidores**. Todos os seus dados ficam salvos no seu próprio navegador ou em arquivos JSON que você controla.

### Funcionalidades Principais

- **🌐 Internacionalização (i18n):** Suporte completo para **Português (BR)** e **Inglês (US)** com troca instantânea.
- **📄 Exportação PDF:** Gere a ficha do seu personagem no modelo oficial da 5e, com formatação garantida (formulários achatados) para impressão perfeita.
- **💾 Persistência Local:** Tudo é salvo automaticamente no `LocalStorage` do navegador. Nada vai para a nuvem.
- **📱 Layout Otimizado para Mobile:**
  - No PC: Visualização em 3 colunas (estilo painel).
  - No Celular: Ordem inteligente de prioridade (Vida/Combate no topo → Atributos → Equipamentos → Magias).
- **🌙 Temas Dinâmicos:** Alterne entre o modo **Pergaminho (Claro)** e **Caverna (Escuro)**.
- **🎨 Personalização:** Escolha a cor de destaque (tema) individual para cada personagem.
- **✨ Magias Dinâmicas:** A lista de slots de magia se expande automaticamente (Círculos 1 ao 9) baseada no nível do personagem.
- **🧮 Automação Inteligente:** Cálculo automático de modificadores de atributos.
- **📤 Importar & Exportar:** Backup completo via JSON, incluindo a imagem do avatar.

---

## Screenshots

<img width="1342" height="620" alt="home" src="https://github.com/user-attachments/assets/64fdd289-13c4-43e2-8b9a-bd464ce001c4" />

<img width="1220" height="565" alt="image" src="https://github.com/user-attachments/assets/fdb0eb26-d8e9-4483-8f79-d5e19477024a" />

---

## Como Usar

Não é necessário instalar nada (Node, Python, PHP, etc). É front-end puro!

### Opção 1: Rodando Localmente

1. Baixe este repositório.
2. Abra o arquivo `index.html` em qualquer navegador moderno (Chrome, Firefox, Edge).
3. Pronto!

### Opção 2: Hospedagem (GitHub Pages)

Basta subir os arquivos para um repositório no GitHub e ativar o **GitHub Pages** nas configurações. O projeto já está otimizado para rodar na raiz.

---

## Estrutura de Arquivos

O projeto mantém a simplicidade, mas agora modularizado:

- `index.html`: Estrutura semântica, layout e tags de internacionalização (`data-i18n`).
- `style.css`: Design System, variáveis CSS, Grid Layout e Media Queries para a ordenação mobile.
- `script.js`: Lógica central (CRUD, Cálculos, UI).
- `language.js`: Dicionário de traduções e lógica de troca de idioma.
- `pdf-exporter.js`: Integração com `pdf-lib` para gerar o PDF oficial preenchido.

---

## Tecnologias Utilizadas

- **HTML5** Semântico.
- **CSS3** Moderno (CSS Variables, Flexbox, Grid, Glassmorphism).
- **Vanilla JavaScript (ES6+)** sem frameworks.
- **PDF-Lib** (via CDN) para manipulação de PDFs.
- **Google Fonts** (Cinzel & Merriweather).
- **Material Icons**.

---

## Formato JSON (Backup)

O sistema exporta um arquivo JSON robusto. Exemplo da estrutura:

```json
{
  "personal_data": {
    "name": "Ivel, o Negro",
    "class": "Bardo",
    "level": 5
  },
  "theme_color": "#AB6DAC",
  "spells": {
      "cantrips": ["Prestidigitação", "Zombaria Viciosa"],
      "level_1": ["Curar Ferimentos"],
      "level_3": ["Bola de Fogo"]
  },
  "attributes": {
    "strength": 8,
    "dexterity": 15
  },
  "portrait": "data:image/png;base64..."
}
---

## Contribuição

Sinta-se livre para fazer um fork deste projeto e adicionar novas funcionalidades! Ideias para o futuro:

- [ ] Rolagem de dados 3D na tela.
- [ ] Bestiário simples.
- [ ] Filtro de magias via API Open5e.

---

Feito para a comunidade de RPG.
```
