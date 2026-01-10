let characters = JSON.parse(localStorage.getItem('dnd_neon_chars')) || [];
let currentId = null;
let globalTheme = localStorage.getItem('dnd_global_theme') || 'light';

const dashboard = document.getElementById('dashboard');
const sheetEditor = document.getElementById('sheet-editor');
const charList = document.getElementById('character-list');
const charForm = document.getElementById('char-form');

function initGlobalTheme() {
  if (globalTheme === 'dark') {
    document.documentElement.classList.add('dark');
    updateThemeIcons('light_mode');
  } else {
    document.documentElement.classList.remove('dark');
    updateThemeIcons('dark_mode');
  }
}

function toggleGlobalTheme() {
  if (document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.remove('dark');
    globalTheme = 'light';
    updateThemeIcons('dark_mode');
  } else {
    document.documentElement.classList.add('dark');
    globalTheme = 'dark';
    updateThemeIcons('light_mode');
  }
  localStorage.setItem('dnd_global_theme', globalTheme);
}

function updateThemeIcons(iconName) {
  const iconHome = document.getElementById('theme-icon-home');
  const iconSheet = document.getElementById('theme-icon-sheet');
  if (iconHome) iconHome.textContent = iconName;
  if (iconSheet) iconSheet.textContent = iconName;
}

function setCharColor(color) {
  document.documentElement.style.setProperty('--accent-primary', color);
  document.documentElement.style.setProperty('--accent-hover', adjustColorBrightness(color, -20));

  const colorInput = document.getElementById('charColorInput');
  if (colorInput) colorInput.value = color;

  document.querySelectorAll('.dot').forEach(dot => {
    dot.style.border = '2px solid transparent';
    dot.style.transform = 'scale(1)';
  });

  const activeDot = Array.from(document.querySelectorAll('.dot')).find(d => {
    return d.getAttribute('onclick').includes(color);
  });

  if (activeDot) {
    activeDot.style.border = '2px solid var(--text-primary)';
    activeDot.style.transform = 'scale(1.2)';
  }
}

function adjustColorBrightness(hex, percent) {
  let num = parseInt(hex.replace("#", ""), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = (num >> 8 & 0x00FF) + amt,
    B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

function renderList() {
  charList.innerHTML = '';
  setCharColor('#b8860b');

  if (characters.length === 0) {
    charList.innerHTML = '<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center; margin-top: 20px;">Nenhum herói encontrado.</p>';
    return;
  }

  characters.forEach(char => {
    const div = document.createElement('div');
    div.className = 'char-item surface-elevated';

    const itemColor = char.theme_color || '#b8860b';
    div.style.borderLeft = `4px solid ${itemColor}`;

    const name = char.charName || 'Desconhecido';
    const details = `${char.species || 'Raça'} - ${char.charClass || 'Classe'} ${char.level || '1'}`;

    let portraitHtml = `<div class="char-item-portrait" style="background-color: var(--surface-subtle); display:flex; align-items:center; justify-content:center;"><span class="material-icons-round" style="font-size:36px; color:var(--text-disabled);">person</span></div>`;

    if (char.portrait) {
      portraitHtml = `<div class="char-item-portrait"><img src="${char.portrait}" alt="${name}"></div>`;
    }

    div.innerHTML = `
      ${portraitHtml}
      <div class="char-item-info">
        <strong style="color: ${itemColor}">${name}</strong>
        <span>${details}</span>
      </div>
    `;

    div.onclick = () => loadCharacter(char.id);
    charList.appendChild(div);
  });
}

function createNewCharacter() {
  const newId = Date.now().toString();
  const newChar = { id: newId, theme_color: '#b8860b' };
  characters.push(newChar);
  saveToStorage();
  loadCharacter(newId);
}

function loadCharacter(id) {
  currentId = id;
  const char = characters.find(c => c.id === id);

  charForm.reset();

  const charTheme = char.theme_color || '#b8860b';
  setCharColor(charTheme);

  Array.from(charForm.elements).forEach(el => {
    if (el.name && char[el.name] !== undefined) {
      if (el.type === 'checkbox') {
        el.checked = char[el.name];
      } else {
        el.value = char[el.name];
      }
    }
  });

  const portrait = document.getElementById('char-portrait');
  const placeholder = document.getElementById('portrait-placeholder');

  if (char.portrait) {
    portrait.src = char.portrait;
    portrait.classList.remove('hidden');
    placeholder.classList.add('hidden');
  } else {
    portrait.classList.add('hidden');
    placeholder.classList.remove('hidden');
  }

  updateModifiers();

  const firstTab = document.querySelector('.tab-button');
  if (firstTab) firstTab.click();

  dashboard.classList.add('hidden');
  sheetEditor.classList.remove('hidden');
  window.scrollTo(0, 0);
}

function saveCharacter() {
  if (!currentId) return;

  const formData = new FormData(charForm);
  const updatedData = { id: currentId };

  formData.forEach((value, key) => updatedData[key] = value);

  Array.from(charForm.querySelectorAll('input[type="checkbox"]')).forEach(checkbox => {
    updatedData[checkbox.name] = checkbox.checked;
  });

  const currentChar = characters.find(c => c.id === currentId);
  if (currentChar && currentChar.portrait) {
    updatedData.portrait = currentChar.portrait;
  }

  const colorInput = document.getElementById('charColorInput');
  updatedData.theme_color = colorInput.value || '#b8860b';

  const index = characters.findIndex(c => c.id === currentId);
  characters[index] = updatedData;

  saveToStorage();

  const saveBtn = document.querySelector('.btn-primary');
  const originalText = saveBtn.innerHTML;
  saveBtn.innerHTML = '<span class="material-icons-round">check</span> Salvo!';
  setTimeout(() => { saveBtn.innerHTML = originalText; }, 1500);
}

function deleteCharacter() {
  if (!confirm("ATENÇÃO: Deseja apagar esta ficha?")) return;

  characters = characters.filter(c => c.id !== currentId);
  saveToStorage();
  closeCharacter();
}

function closeCharacter() {
  currentId = null;
  sheetEditor.classList.add('hidden');
  dashboard.classList.remove('hidden');
  renderList();
}

function saveToStorage() {
  localStorage.setItem('dnd_neon_chars', JSON.stringify(characters));
}

function updateModifiers() {
  const attributes = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

  attributes.forEach(attr => {
    const scoreInput = document.querySelector(`input[name="${attr}_score"]`);
    const modInput = document.querySelector(`input[name="${attr}_mod"]`);

    if (scoreInput && modInput) {
      const score = parseInt(scoreInput.value);
      if (!isNaN(score)) {
        const mod = Math.floor((score - 10) / 2);
        modInput.value = (mod >= 0 ? '+' : '') + mod;
      } else {
        modInput.value = "+0";
      }
    }
  });
}

function handlePortraitUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const portrait = document.getElementById('char-portrait');
    const placeholder = document.getElementById('portrait-placeholder');

    portrait.src = e.target.result;
    portrait.classList.remove('hidden');
    placeholder.classList.add('hidden');

    const currentChar = characters.find(c => c.id === currentId);
    if (currentChar) {
      currentChar.portrait = e.target.result;
    }
  };

  reader.readAsDataURL(file);
}

function switchTab(event, tabId) {

  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.remove('active');
  });


  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.remove('active');
  });


  event.currentTarget.classList.add('active');


  document.getElementById(tabId).classList.add('active');
}

function exportCharacter() {
  if (!currentId) return;

  const char = characters.find(c => c.id === currentId);
  if (!char) return;

  const exportData = {
    personal_data: {
      name: char.charName || "",
      level: parseInt(char.level) || 1,
      species: char.species || "",
      class: char.charClass || "",
      subclass: char.subclass || "",
      background: char.background || "",
      alignment: char.alignment || "",
      max_hp: parseInt(char.hpMax) || 0,
      armor_class: parseInt(char.ac) || 10,
      speed: char.speed || "",
      proficiency_bonus: char.profBonus || "+2"
    },
    theme_color: char.theme_color || "#b8860b",
    attributes: {
      strength: parseInt(char.str_score) || 10,
      dexterity: parseInt(char.dex_score) || 10,
      constitution: parseInt(char.con_score) || 10,
      intelligence: parseInt(char.int_score) || 10,
      wisdom: parseInt(char.wis_score) || 10,
      charisma: parseInt(char.cha_score) || 10
    },
    proficiencies: {
      saving_throws: extractSavingThrows(char),
      skills: extractSkills(char)
    },
    spells: {
      cantrips: char.spells_cantrips ? char.spells_cantrips.split('\n') : [],
      level_1: char.spells_lvl1 ? char.spells_lvl1.split('\n') : [],
      level_2: char.spells_lvl2 ? char.spells_lvl2.split('\n') : [],
      level_3: char.spells_lvl3 ? char.spells_lvl3.split('\n') : []
    },
    text_areas: {
      equipment: char.equipment || "",
      featuresTraits: char.featuresTraits || "",
      proficiencies: char.proficiencies || "",
      backstory: char.backstory || "",
      attacks: char.attacks || ""
    },
    portrait: char.portrait || null
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${char.charName || 'character'}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function importCharacter(input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const json = JSON.parse(e.target.result);

      let charId;
      let isOverwrite = false;

      if (currentId) {
        if (!confirm("Deseja substituir os dados do personagem atual pelos dados do arquivo?")) {
          input.value = '';
          return;
        }
        charId = currentId;
        isOverwrite = true;
      } else {
        charId = Date.now().toString();
        isOverwrite = false;
      }

      const newChar = {
        id: charId,
        charName: json.personal_data?.name || "",
        level: json.personal_data?.level || 1,
        species: json.personal_data?.species || "",
        charClass: json.personal_data?.class || "",
        subclass: json.personal_data?.subclass || "",
        background: json.personal_data?.background || "",
        alignment: json.personal_data?.alignment || "",
        hpMax: json.personal_data?.max_hp || 0,
        ac: json.personal_data?.armor_class || 10,
        speed: json.personal_data?.speed || "",
        profBonus: json.personal_data?.proficiency_bonus || "+2",
        theme_color: json.theme_color || "#b8860b",
        str_score: json.attributes?.strength || 10,
        dex_score: json.attributes?.dexterity || 10,
        con_score: json.attributes?.constitution || 10,
        int_score: json.attributes?.intelligence || 10,
        wis_score: json.attributes?.wisdom || 10,
        cha_score: json.attributes?.charisma || 10,
        portrait: json.portrait || null
      };

      if (json.spells) {
        newChar.spells_cantrips = (json.spells.cantrips || []).join('\n');
        newChar.spells_lvl1 = (json.spells.level_1 || []).join('\n');
        newChar.spells_lvl2 = (json.spells.level_2 || []).join('\n');
        newChar.spells_lvl3 = (json.spells.level_3 || []).join('\n');
      }

      if (json.text_areas?.equipment) newChar.equipment = json.text_areas.equipment;
      else if (Array.isArray(json.equipment)) newChar.equipment = json.equipment.join('\n');

      newChar.backstory = json.text_areas?.backstory || json.character_history || "";

      if (json.text_areas?.featuresTraits) newChar.featuresTraits = json.text_areas.featuresTraits;
      else if (json.habilidades_e_talentos) newChar.featuresTraits = formatComplexTraits(json.habilidades_e_talentos);

      if (json.text_areas?.proficiencies) newChar.proficiencies = json.text_areas.proficiencies;
      else if (json.proficiencies) newChar.proficiencies = formatLegacyProficiencies(json.proficiencies);

      if (json.proficiencies?.saving_throws) {
        const saveMap = {
          'Força': 'save_str_prof',
          'Destreza': 'save_dex_prof',
          'Constituição': 'save_con_prof',
          'Inteligência': 'save_int_prof',
          'Sabedoria': 'save_wis_prof',
          'Carisma': 'save_cha_prof'
        };
        json.proficiencies.saving_throws.forEach(s => {
          if (saveMap[s]) newChar[saveMap[s]] = true;
        });
      }

      if (json.proficiencies?.skills) {
        const skillMap = {
          'Acrobacia': 'skill_acro_prof',
          'Adestrar Animais': 'skill_anim_prof',
          'Arcanismo': 'skill_arca_prof',
          'Atletismo': 'skill_athl_prof',
          'Enganação': 'skill_decp_prof',
          'História': 'skill_hist_prof',
          'Intuição': 'skill_insg_prof',
          'Intimidação': 'skill_inti_prof',
          'Investigação': 'skill_invs_prof',
          'Medicina': 'skill_medi_prof',
          'Natureza': 'skill_natu_prof',
          'Percepção': 'skill_perc_prof',
          'Atuação': 'skill_perf_prof',
          'Persuasão': 'skill_pers_prof',
          'Religião': 'skill_reli_prof',
          'Prestidigitação': 'skill_slei_prof',
          'Furtividade': 'skill_stea_prof',
          'Sobrevivência': 'skill_surv_prof'
        };
        json.proficiencies.skills.forEach(skill => {
          const cleanSkill = skill.split('(')[0].trim();
          if (skillMap[cleanSkill]) newChar[skillMap[cleanSkill]] = true;
        });
      }

      if (isOverwrite) {
        const index = characters.findIndex(c => c.id === charId);
        if (index !== -1) {
          characters[index] = newChar;
        } else {
          characters.push(newChar);
        }
      } else {
        characters.push(newChar);
      }

      saveToStorage();
      loadCharacter(charId);

      const msg = isOverwrite ? 'Personagem atualizado!' : 'Personagem importado!';
      alert(msg);

    } catch (error) {
      console.error(error);
      alert('Erro ao processar o arquivo JSON.');
    }

    input.value = '';
  };

  reader.readAsText(file);
}

function extractSavingThrows(char) {
  const saves = [];
  const map = {
    save_str_prof: 'Força',
    save_dex_prof: 'Destreza',
    save_con_prof: 'Constituição',
    save_int_prof: 'Inteligência',
    save_wis_prof: 'Sabedoria',
    save_cha_prof: 'Carisma'
  };
  for (let k in map) {
    if (char[k]) saves.push(map[k]);
  }
  return saves;
}

function extractSkills(char) {
  const skills = [];
  const map = {
    skill_acro_prof: 'Acrobacia',
    skill_anim_prof: 'Adestrar Animais',
    skill_arca_prof: 'Arcanismo',
    skill_athl_prof: 'Atletismo',
    skill_decp_prof: 'Enganação',
    skill_hist_prof: 'História',
    skill_insg_prof: 'Intuição',
    skill_inti_prof: 'Intimidação',
    skill_invs_prof: 'Investigação',
    skill_medi_prof: 'Medicina',
    skill_natu_prof: 'Natureza',
    skill_perc_prof: 'Percepção',
    skill_perf_prof: 'Atuação',
    skill_pers_prof: 'Persuasão',
    skill_reli_prof: 'Religião',
    skill_slei_prof: 'Prestidigitação',
    skill_stea_prof: 'Furtividade',
    skill_surv_prof: 'Sobrevivência'
  };
  for (let k in map) {
    if (char[k]) skills.push(map[k]);
  }
  return skills;
}

function formatComplexTraits(data) {
  if (!data) return "";
  let text = "";
  if (Array.isArray(data)) {
    return data.map(i => typeof i === 'string' ? i : `${i.nome}: ${i.descricao}`).join('\n\n');
  }
  for (const key in data) {
    if (Array.isArray(data[key])) {
      text += `--- ${key.toUpperCase().replace('_', ' ')} ---\n`;
      data[key].forEach(item => {
        if (item.nome) text += `• ${item.nome}: ${item.descricao}\n`;
      });
      text += "\n";
    }
  }
  return text;
}

function formatLegacyProficiencies(prof) {
  let t = "";
  if (prof.armaduras) t += "Armaduras: " + prof.armaduras.join(', ') + "\n";
  if (prof.armas) t += "Armas: " + prof.armas.join(', ') + "\n";
  if (prof.ferramentas) t += "Ferramentas: " + prof.ferramentas.join(', ') + "\n";
  if (prof.idiomas) t += "Idiomas: " + prof.idiomas.join(', ') + "\n";
  return t;
}

initGlobalTheme();
renderList();
