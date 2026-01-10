# 🐉 Grimório de Lendas (Character Vault)

> Um gerenciador de fichas para D&D 5ª Edição simples, moderno e 100% offline.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Tech](https://img.shields.io/badge/tech-HTML%20%7C%20CSS%20%7C%20JS-orange.svg)

## Sobre o Projeto

O **Grimório de Lendas** é uma aplicação web focada na simplicidade e na experiência do usuário para gerenciar personagens de RPG de mesa.

Diferente de plataformas complexas, este projeto foi construído para ser **leve**, **rápido** e **totalmente independente de servidores**. Todos os seus dados ficam salvos no seu próprio navegador ou em arquivos JSON que você controla.

### Funcionalidades Principais

- **💾 Persistência Local:** Tudo é salvo automaticamente no `LocalStorage` do navegador. Nada vai para a nuvem.
- **🌙 Temas Dinâmicos:** Alterne entre o modo **Pergaminho (Claro)** e **Caverna (Escuro)**.
- **🎨 Personalização:** Escolha a cor de destaque (tema) individual para cada personagem (Dourado para Paladinos, Vermelho para Bárbaros, etc.).
- **📱 100% Responsivo:** Funciona perfeitamente no PC, Tablet ou Celular.
- **🧮 Automação Inteligente:** Cálculo automático de modificadores de atributos baseado nos valores inseridos.
- **📤 Importar & Exportar:** Faça backup dos seus personagens via arquivos `.json` completos, incluindo a imagem do avatar.
- **🖼️ Upload de Avatar:** Suporte para imagens de personagem (salvas em Base64).

---

## Como Usar

Não é necessário instalar nada (Node, Python, PHP, etc). É front-end puro!

### Opção 1: Rodando Localmente

1. Baixe este repositório.
2. Abra o arquivo `index.html` em qualquer navegador moderno (Chrome, Firefox, Edge).
3. Pronto!

### Opção 2: Hospedagem (GitHub Pages)

Basta subir os arquivos (`index.html`, `style.css`, `script.js`) para um repositório no GitHub e ativar o **GitHub Pages** nas configurações.

---

## Estrutura de Arquivos

O projeto é mantido o mais simples possível:

- `index.html`: Estrutura da página, ícones e layout.
- `style.css`: Estilização, variáveis CSS (Design System), Grid Layout e responsividade.
- `script.js`: Lógica de salvamento, cálculos de D&D, manipulação de JSON e DOM.

---

## Tecnologias Utilizadas

- **HTML5** Semântico.
- **CSS3** Moderno (CSS Variables, Flexbox, Grid, Glassmorphism).
- **Vanilla JavaScript (ES6+)** sem frameworks ou dependências externas.
- **Google Fonts** (Cinzel & Merriweather).
- **Material Icons**.

---

## Formato JSON (Backup)

O sistema exporta um arquivo JSON robusto que pode ser compartilhado entre dispositivos. Exemplo da estrutura:

```json
{
  "personal_data": {
    "name": "Ivel, o Negro",
    "class": "Bardo",
    "level": 3
  },
  "theme_color": "#AB6DAC",
  "attributes": {
    "strength": 8,
    "dexterity": 15
    ...
  },
  "portrait": "data:image/png;base64..."
}

```

---

## Contribuição

Sinta-se livre para fazer um fork deste projeto e adicionar novas funcionalidades! Ideias para o futuro:

- [ ] Rolagem de dados 3D na tela.
- [ ] Bestiário simples.
- [ ] Filtro de magias via API Open5e.

---

Feito para a comunidade de RPG.
