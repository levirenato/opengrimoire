let characters = JSON.parse(localStorage.getItem('dnd_neon_chars')) || [];
let currentId = null;

const dashboard = document.getElementById('dashboard');
const sheetEditor = document.getElementById('sheet-editor');
const charList = document.getElementById('character-list');
const charForm = document.getElementById('char-form');

function renderList() {
  charList.innerHTML = '';
  if (characters.length === 0) {
    charList.innerHTML = '<p style="color: var(--text-secondary); grid-column: 1/-1; text-align: center;">Nenhum personagem criado ainda.</p>';
    return;
  }

  characters.forEach(char => {
    const div = document.createElement('div');
    div.className = 'char-item neon-border';

    const name = char.charName || 'Sem Nome';
    const details = `${char.species || 'Raça'} - ${char.charClass || 'Classe'} ${char.level || '1'}`;

    let portraitHtml = '';
    if (char.portrait) {
      portraitHtml = `<div class="char-item-portrait"><img src="${char.portrait}" alt="${name}"></div>`;
    }

    div.innerHTML = `
            ${portraitHtml}
            <div class="char-item-info">
                <strong>${name}</strong>
                <span>${details}</span>
            </div>
        `;
    div.onclick = () => loadCharacter(char.id);
    charList.appendChild(div);
  });
}

function createNewCharacter() {
  const newId = Date.now().toString();
  const newChar = { id: newId };
  characters.push(newChar);
  saveToStorage();
  loadCharacter(newId);
}

function loadCharacter(id) {
  currentId = id;
  const char = characters.find(c => c.id === id);

  charForm.reset();

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

  document.querySelector('.tab-btn').click();

  dashboard.classList.add('hidden');
  sheetEditor.classList.remove('hidden');
  window.scrollTo(0, 0);
}

function saveCharacter() {
  if (!currentId) return;

  const formData = new FormData(charForm);
  const updatedData = { id: currentId };

  formData.forEach((value, key) => {
    updatedData[key] = value;
  });

  Array.from(charForm.querySelectorAll('input[type="checkbox"]')).forEach(checkbox => {
    updatedData[checkbox.name] = checkbox.checked;
  });

  const currentChar = characters.find(c => c.id === currentId);
  if (currentChar && currentChar.portrait) {
    updatedData.portrait = currentChar.portrait;
  }

  const index = characters.findIndex(c => c.id === currentId);
  characters[index] = updatedData;
  saveToStorage();

  const saveBtn = document.querySelector('.btn-accent');
  const originalText = saveBtn.innerHTML;
  saveBtn.innerHTML = '<span class="material-icons-round">check</span> Salvo!';
  setTimeout(() => {
    saveBtn.innerHTML = originalText;
  }, 1500);
}

function deleteCharacter() {
  if (!confirm("ATENÇÃO: Tem certeza que deseja apagar esta ficha permanentemente?")) return;

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
      saveToStorage();
    }
  };
  reader.readAsDataURL(file);
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
      skills: extractSkills(char),
      tools: [],
      armor: [],
      weapons: []
    },
    abilities_and_feats: {
      origin: [],
      species: [],
      class: []
    },
    spells: {
      cantrips: char.spells_cantrips ? char.spells_cantrips.split('\n').filter(s => s.trim()) : [],
      level_1: char.spells_lvl1 ? char.spells_lvl1.split('\n').filter(s => s.trim()) : [],
      level_2: char.spells_lvl2 ? char.spells_lvl2.split('\n').filter(s => s.trim()) : [],
      level_3: char.spells_lvl3 ? char.spells_lvl3.split('\n').filter(s => s.trim()) : []
    },
    equipment: char.equipment ? char.equipment.split('\n').filter(e => e.trim()) : [],
    physical_description: {
      general_appearance: char.physicalDescription || "",
      eyes: "",
      clothing: "",
      details: ""
    },
    character_history: char.backstory || "",
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

function extractSavingThrows(char) {
  const saves = [];
  const saveNames = {
    save_str_prof: 'Força',
    save_dex_prof: 'Destreza',
    save_con_prof: 'Constituição',
    save_int_prof: 'Inteligência',
    save_wis_prof: 'Sabedoria',
    save_cha_prof: 'Carisma'
  };

  for (let key in saveNames) {
    if (char[key]) saves.push(saveNames[key]);
  }
  return saves;
}

function extractSkills(char) {
  const skills = [];
  const skillNames = {
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

  for (let key in skillNames) {
    if (char[key]) skills.push(skillNames[key]);
  }
  return skills;
}

function importCharacter(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importData = JSON.parse(e.target.result);

      const newId = Date.now().toString();
      const newChar = {
        id: newId,
        charName: importData.personal_data?.name || "",
        level: importData.personal_data?.level || 1,
        species: importData.personal_data?.species || "",
        charClass: importData.personal_data?.class || "",
        subclass: importData.personal_data?.subclass || "",
        background: importData.personal_data?.background || "",
        alignment: importData.personal_data?.alignment || "",
        hpMax: importData.personal_data?.max_hp || 0,
        ac: importData.personal_data?.armor_class || 10,
        speed: importData.personal_data?.speed || "",
        profBonus: importData.personal_data?.proficiency_bonus || "+2",

        str_score: importData.attributes?.strength || 10,
        dex_score: importData.attributes?.dexterity || 10,
        con_score: importData.attributes?.constitution || 10,
        int_score: importData.attributes?.intelligence || 10,
        wis_score: importData.attributes?.wisdom || 10,
        cha_score: importData.attributes?.charisma || 10,

        spells_cantrips: importData.spells?.cantrips ? importData.spells.cantrips.join('\n') : "",
        spells_lvl1: importData.spells?.level_1 ? importData.spells.level_1.join('\n') : "",
        spells_lvl2: importData.spells?.level_2 ? importData.spells.level_2.join('\n') : "",
        spells_lvl3: importData.spells?.level_3 ? importData.spells.level_3.join('\n') : "",

        equipment: importData.equipment ? importData.equipment.join('\n') : "",
        physicalDescription: importData.physical_description?.general_appearance || "",
        backstory: importData.character_history || "",
        portrait: importData.portrait || null
      };

      if (importData.proficiencies?.saving_throws) {
        const saveMap = {
          'Força': 'save_str_prof',
          'Destreza': 'save_dex_prof',
          'Constituição': 'save_con_prof',
          'Inteligência': 'save_int_prof',
          'Sabedoria': 'save_wis_prof',
          'Carisma': 'save_cha_prof'
        };
        importData.proficiencies.saving_throws.forEach(save => {
          if (saveMap[save]) newChar[saveMap[save]] = true;
        });
      }

      if (importData.proficiencies?.skills) {
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
        importData.proficiencies.skills.forEach(skill => {
          const cleanSkill = skill.replace(/\s*\(Especialista\)\s*/, '').trim();
          if (skillMap[cleanSkill]) newChar[skillMap[cleanSkill]] = true;
        });
      }

      characters.push(newChar);
      saveToStorage();
      loadCharacter(newId);

      alert('Personagem importado com sucesso!');
    } catch (error) {
      alert('Erro ao importar personagem. Verifique se o arquivo JSON está correto.');
      console.error(error);
    }
  };
  reader.readAsText(file);

  event.target.value = '';
}

function openTab(evt, tabName) {
  const tabContents = document.getElementsByClassName("tab-content");
  for (let i = 0; i < tabContents.length; i++) {
    tabContents[i].classList.remove("active");
  }

  const tabLinks = document.getElementsByClassName("tab-btn");
  for (let i = 0; i < tabLinks.length; i++) {
    tabLinks[i].classList.remove("active");
  }

  document.getElementById(tabName).classList.add("active");
  evt.currentTarget.classList.add("active");
}

renderList();
