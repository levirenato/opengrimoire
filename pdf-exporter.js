async function exportToPDF() {
  if (!currentId) {
    alert('Nenhum personagem carregado!');
    return;
  }

  const char = characters.find(c => c.id === currentId);
  if (!char) {
    alert('Erro ao encontrar dados do personagem.');
    return;
  }

  try {
    const exportBtn = document.querySelector('.btn-secondary:nth-child(1)');
    const originalHTML = exportBtn.innerHTML;
    exportBtn.innerHTML = '<span class="material-icons-round">hourglass_empty</span> Gerando PDF...';
    exportBtn.disabled = true;

    const { PDFDocument } = window.PDFLib;

    const templateUrl = 'assets/template.pdf';
    const existingPdfBytes = await fetch(templateUrl).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();

    // ========== MAPEAMENTO DOS CAMPOS ==========

    // Informações Básicas
    setTextField(form, 'CharacterName', char.charName || '');
    setTextField(form, 'CharacterName 2', char.charName || '');
    setTextField(form, 'ClassLevel', `${char.charClass || ''} ${char.level || ''}`);
    setTextField(form, 'Background', char.background || '');
    setTextField(form, 'PlayerName', ''); // Campo não existe na ficha atual
    setTextField(form, 'Race ', char.species || '');
    setTextField(form, 'Alignment', char.alignment || '');
    setTextField(form, 'XP', ''); // Campo não existe na ficha atual

    // Atributos
    setTextField(form, 'STR', char.str_score || '10');
    setTextField(form, 'STRmod', char.str_mod || '+0');
    setTextField(form, 'DEX', char.dex_score || '10');
    setTextField(form, 'DEXmod ', char.dex_mod || '+0');
    setTextField(form, 'CON', char.con_score || '10');
    setTextField(form, 'CONmod', char.con_mod || '+0');
    setTextField(form, 'INT', char.int_score || '10');
    setTextField(form, 'INTmod', char.int_mod || '+0');
    setTextField(form, 'WIS', char.wis_score || '10');
    setTextField(form, 'WISmod', char.wis_mod || '+0');
    setTextField(form, 'CHA', char.cha_score || '10');
    setTextField(form, 'CHamod', char.cha_mod || '+0');

    // Inspiração e Bônus de Proficiência
    setTextField(form, 'Inspiration', char.inspiration ? '✓' : '');
    setTextField(form, 'ProfBonus', char.profBonus || '+2');

    // Combate
    setTextField(form, 'AC', char.ac || '10');
    setTextField(form, 'Initiative', char.initiative || '+0');
    setTextField(form, 'Speed', char.speed || '9m');
    setTextField(form, 'HPMax', char.hpMax || '0');
    setTextField(form, 'HPCurrent', char.hpCurrent || '0');
    setTextField(form, 'HPTemp', char.hpTemp || '0');

    // Dados de Vida
    setTextField(form, 'HDTotal', char.hitDiceTotal || '1d8');
    setTextField(form, 'HD', ''); // Dados de vida usados - não temos na ficha

    // Testes contra Morte
    setCheckbox(form, 'Check Box 12', false); // Sucesso 1
    setCheckbox(form, 'Check Box 13', false); // Sucesso 2
    setCheckbox(form, 'Check Box 14', false); // Sucesso 3
    setCheckbox(form, 'Check Box 15', false); // Falha 1
    setCheckbox(form, 'Check Box 16', false); // Falha 2
    setCheckbox(form, 'Check Box 17', false); // Falha 3

    // Testes de Resistência
    setTextField(form, 'ST Strength', char.save_str_mod || '+0');
    setTextField(form, 'ST Dexterity', char.save_dex_mod || '+0');
    setTextField(form, 'ST Constitution', char.save_con_mod || '+0');
    setTextField(form, 'ST Intelligence', char.save_int_mod || '+0');
    setTextField(form, 'ST Wisdom', char.save_wis_mod || '+0');
    setTextField(form, 'ST Charisma', char.save_cha_mod || '+0');

    // Checkboxes de Proficiência em Saves
    setCheckbox(form, 'Check Box 11', char.save_str_prof || false);
    setCheckbox(form, 'Check Box 18', char.save_dex_prof || false);
    setCheckbox(form, 'Check Box 19', char.save_con_prof || false);
    setCheckbox(form, 'Check Box 20', char.save_int_prof || false);
    setCheckbox(form, 'Check Box 21', char.save_wis_prof || false);
    setCheckbox(form, 'Check Box 22', char.save_cha_prof || false);

    // Perícias
    setTextField(form, 'Acrobatics', char.skill_acro_mod || '+0');
    setTextField(form, 'Animal', char.skill_anim_mod || '+0');
    setTextField(form, 'Arcana', char.skill_arca_mod || '+0');
    setTextField(form, 'Athletics', char.skill_athl_mod || '+0');
    setTextField(form, 'Deception ', char.skill_decp_mod || '+0');
    setTextField(form, 'History ', char.skill_hist_mod || '+0');
    setTextField(form, 'Insight', char.skill_insg_mod || '+0');
    setTextField(form, 'Intimidation', char.skill_inti_mod || '+0');
    setTextField(form, 'Investigation ', char.skill_invs_mod || '+0');
    setTextField(form, 'Medicine', char.skill_medi_mod || '+0');
    setTextField(form, 'Nature', char.skill_natu_mod || '+0');
    setTextField(form, 'Perception ', char.skill_perc_mod || '+0');
    setTextField(form, 'Performance', char.skill_perf_mod || '+0');
    setTextField(form, 'Persuasion', char.skill_pers_mod || '+0');
    setTextField(form, 'Religion', char.skill_reli_mod || '+0');
    setTextField(form, 'SleightofHand', char.skill_slei_mod || '+0');
    setTextField(form, 'Stealth ', char.skill_stea_mod || '+0');
    setTextField(form, 'Survival', char.skill_surv_mod || '+0');

    // Checkboxes de Proficiência em Perícias
    setCheckbox(form, 'Check Box 23', char.skill_acro_prof || false);
    setCheckbox(form, 'Check Box 24', char.skill_anim_prof || false);
    setCheckbox(form, 'Check Box 25', char.skill_arca_prof || false);
    setCheckbox(form, 'Check Box 26', char.skill_athl_prof || false);
    setCheckbox(form, 'Check Box 27', char.skill_decp_prof || false);
    setCheckbox(form, 'Check Box 28', char.skill_hist_prof || false);
    setCheckbox(form, 'Check Box 29', char.skill_insg_prof || false);
    setCheckbox(form, 'Check Box 30', char.skill_inti_prof || false);
    setCheckbox(form, 'Check Box 31', char.skill_invs_prof || false);
    setCheckbox(form, 'Check Box 32', char.skill_medi_prof || false);
    setCheckbox(form, 'Check Box 33', char.skill_natu_prof || false);
    setCheckbox(form, 'Check Box 34', char.skill_perc_prof || false);
    setCheckbox(form, 'Check Box 35', char.skill_perf_prof || false);
    setCheckbox(form, 'Check Box 36', char.skill_pers_prof || false);
    setCheckbox(form, 'Check Box 37', char.skill_reli_prof || false);
    setCheckbox(form, 'Check Box 38', char.skill_slei_prof || false);
    setCheckbox(form, 'Check Box 39', char.skill_stea_prof || false);
    setCheckbox(form, 'Check Box 40', char.skill_surv_prof || false);

    // Percepção Passiva
    setTextField(form, 'Passive', char.passivePerception || '10');

    // Moedas
    setTextField(form, 'CP', char.cp || '0');
    setTextField(form, 'SP', char.sp || '0');
    setTextField(form, 'EP', char.ep || '0');
    setTextField(form, 'GP', char.gp || '0');
    setTextField(form, 'PP', char.pp || '0');

    // Ataques e Armas (parsear a textarea de ataques)
    const attacks = parseAttacks(char.attacks || '');
    if (attacks[0]) {
      setTextField(form, 'Wpn Name', attacks[0].name);
      setTextField(form, 'Wpn1 AtkBonus', attacks[0].bonus);
      setTextField(form, 'Wpn1 Damage', attacks[0].damage);
    }
    if (attacks[1]) {
      setTextField(form, 'Wpn Name 2', attacks[1].name);
      setTextField(form, 'Wpn2 AtkBonus ', attacks[1].bonus);
      setTextField(form, 'Wpn2 Damage ', attacks[1].damage);
    }
    if (attacks[2]) {
      setTextField(form, 'Wpn Name 3', attacks[2].name);
      setTextField(form, 'Wpn3 AtkBonus  ', attacks[2].bonus);
      setTextField(form, 'Wpn3 Damage ', attacks[2].damage);
    }

    // Equipamento e Proficiências
    setTextField(form, 'Equipment', char.equipment || '');
    setTextField(form, 'ProficienciesLang', char.proficiencies || '');

    // Características e Traços
    setTextField(form, 'Features and Traits', char.featuresTraits || '');
    setTextField(form, 'Feat+Traits', char.featuresTraits || '');

    // AttacksSpellcasting (campo grande de ataques)
    setTextField(form, 'AttacksSpellcasting', char.attacks || '');

    // Personalidade e História (Página 2)
    setTextField(form, 'PersonalityTraits ', '');
    setTextField(form, 'Ideals', '');
    setTextField(form, 'Bonds', '');
    setTextField(form, 'Flaws', '');
    setTextField(form, 'Backstory', char.backstory || '');

    // Informações Físicas (Página 2)
    setTextField(form, 'Age', '');
    setTextField(form, 'Height', '');
    setTextField(form, 'Weight', '');
    setTextField(form, 'Eyes', '');
    setTextField(form, 'Skin', '');
    setTextField(form, 'Hair', '');
    setTextField(form, 'Allies', '');
    setTextField(form, 'FactionName', '');
    setTextField(form, 'Treasure', '');

    // Magias (Página 3)
    setTextField(form, 'Spellcasting Class 2', char.charClass || '');
    setTextField(form, 'SpellcastingAbility 2', char.spellcastingAbility || '');
    setTextField(form, 'SpellSaveDC  2', char.spellSaveDC || '');
    setTextField(form, 'SpellAtkBonus 2', char.spellAttackBonus || '');

    // Truques (Cantrips)
    const cantrips = (char.spells_cantrips || '').split('\n').filter(s => s.trim());
    for (let i = 0; i < Math.min(cantrips.length, 8); i++) {
      setTextField(form, `Spells 10${14 + i}`, cantrips[i]);
    }

    // Nível 1
    setTextField(form, 'SlotsTotal 19', char.slots_lvl1_total || '0');
    setTextField(form, 'SlotsRemaining 19', char.slots_lvl1_used || '0');
    const lvl1 = (char.spells_lvl1 || '').split('\n').filter(s => s.trim());
    for (let i = 0; i < Math.min(lvl1.length, 12); i++) {
      setTextField(form, `Spells 10${23 + i}`, lvl1[i]);
    }

    // Nível 2
    setTextField(form, 'SlotsTotal 20', char.slots_lvl2_total || '0');
    setTextField(form, 'SlotsRemaining 20', char.slots_lvl2_used || '0');
    const lvl2 = (char.spells_lvl2 || '').split('\n').filter(s => s.trim());
    for (let i = 0; i < Math.min(lvl2.length, 13); i++) {
      setTextField(form, `Spells 10${34 + i}`, lvl2[i]);
    }

    // Nível 3
    setTextField(form, 'SlotsTotal 21', char.slots_lvl3_total || '0');
    setTextField(form, 'SlotsRemaining 21', char.slots_lvl3_used || '0');
    const lvl3 = (char.spells_lvl3 || '').split('\n').filter(s => s.trim());
    for (let i = 0; i < Math.min(lvl3.length, 13); i++) {
      setTextField(form, `Spells 10${47 + i}`, lvl3[i]);
    }

    // Salvar o PDF preenchido
    const pdfBytes = await pdfDoc.save();

    // Download
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${char.charName || 'character'}_ficha.pdf`;
    link.click();
    URL.revokeObjectURL(url);

    // Restaurar botão
    exportBtn.innerHTML = originalHTML;
    exportBtn.disabled = false;

    alert('PDF exportado com sucesso!');

  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    alert('Erro ao exportar PDF: ' + error.message);

    // Restaurar botão em caso de erro
    const exportBtn = document.querySelector('.btn-secondary:nth-child(1)');
    exportBtn.innerHTML = '<span class="material-icons-round">download</span> Exportar';
    exportBtn.disabled = false;
  }
}

// ========== FUNÇÕES AUXILIARES ==========

function setTextField(form, fieldName, value) {
  try {
    const field = form.getTextField(fieldName);
    field.setText(String(value || ''));
  } catch (e) {
    console.warn(`Campo "${fieldName}" não encontrado no PDF`);
  }
}

function setCheckbox(form, fieldName, checked) {
  try {
    const field = form.getCheckBox(fieldName);
    if (checked) {
      field.check();
    } else {
      field.uncheck();
    }
  } catch (e) {
    console.warn(`Checkbox "${fieldName}" não encontrado no PDF`);
  }
}

function parseAttacks(attacksText) {
  const attacks = [];
  const lines = attacksText.split('\n').filter(l => l.trim());

  for (const line of lines) {
    const parts = line.split('|').map(p => p.trim());
    if (parts.length >= 3) {
      attacks.push({
        name: parts[0],
        bonus: parts[1],
        damage: parts[2]
      });
    }
  }

  return attacks;
}
