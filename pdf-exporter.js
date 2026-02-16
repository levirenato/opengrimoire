async function exportToPDF() {
  if (!currentId) {
    await showAlert(getTranslation('msg_no_char_loaded'), { title: getTranslation('modal_title_error'), icon: 'error', iconClass: 'modal-icon-error' });
    return;
  }

  // Save current form state before exporting
  saveCharacter();

  const char = characters.find(c => c.id === currentId);
  if (!char) {
    await showAlert(getTranslation('msg_char_data_error'), { title: getTranslation('modal_title_error'), icon: 'error', iconClass: 'modal-icon-error' });
    return;
  }

  try {
    const exportBtn = document.querySelector('.btn-secondary:nth-child(1)');
    const originalHTML = exportBtn.innerHTML;
    exportBtn.innerHTML = `<span class="material-icons-round">hourglass_empty</span> ${getTranslation('msg_pdf_generating')}`;
    exportBtn.disabled = true;

    const { PDFDocument, StandardFonts } = window.PDFLib;

    const templateUrl = 'assets/template.pdf';
    const existingPdfBytes = await fetch(templateUrl).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const form = pdfDoc.getForm();


    const fill = (name, value, size = 10, isMultiline = false) => {
      try {
        const field = form.getTextField(name);
        field.setText(String(value || ''));

        if (isMultiline) {
          field.enableMultiline();
        }

        field.updateAppearances(font);
        field.setFontSize(size);

      } catch (e) {
      }
    };

    const check = (name, isChecked) => {
      try {
        const field = form.getCheckBox(name);
        if (isChecked) field.check(); else field.uncheck();
        field.updateAppearances(font);
      } catch (e) { }
    };


    fill('CharacterName', char.charName, 12);
    fill('CharacterName 2', char.charName, 12);
    fill('ClassLevel', `${char.charClass || ''} ${char.level || ''}`, 10);
    fill('Background', char.background, 10);
    fill('Race ', char.species, 10);
    fill('Alignment', char.alignment, 10);
    fill('PlayerName', getTranslation('msg_player'), 10);
    fill('XP', '', 10);

    fill('STR', char.str_score, 14); fill('STRmod', char.str_mod, 18);
    fill('DEX', char.dex_score, 14); fill('DEXmod ', char.dex_mod, 18);
    fill('CON', char.con_score, 14); fill('CONmod', char.con_mod, 18);
    fill('INT', char.int_score, 14); fill('INTmod', char.int_mod, 18);
    fill('WIS', char.wis_score, 14); fill('WISmod', char.wis_mod, 18);
    fill('CHA', char.cha_score, 14); fill('CHamod', char.cha_mod, 18);

    fill('Inspiration', char.inspiration ? 'X' : '', 18);
    fill('ProfBonus', char.profBonus, 14);
    fill('AC', char.ac, 18);
    fill('Initiative', char.initiative || '+0', 18);
    fill('Speed', char.speed, 14);
    fill('HDTotal', char.hitDiceTotal, 10);

    fill('HPMax', char.hpMax, 12, false);
    fill('HPCurrent', char.hpCurrent, 18, true);
    fill('HPTemp', char.hpTemp, 18, true);

    fill('PersonalityTraits ', '', 9, true);
    fill('Ideals', '', 9, true);
    fill('Bonds', '', 9, true);
    fill('Flaws', '', 9, true);
    fill('AttacksSpellcasting', char.attacks, 9, true);
    fill('Equipment', char.equipment, 9, true);
    fill('ProficienciesLang', char.proficiencies, 9, true);
    fill('Features and Traits', char.featuresTraits, 9, true);
    fill('Feat+Traits', char.featuresTraits, 9, true);
    fill('Backstory', char.backstory, 10, true);
    fill('Allies', '', 10, true);
    fill('Treasure', '', 10, true);

    const modSize = 10;
    fill('ST Strength', char.save_str_mod, modSize); fill('ST Dexterity', char.save_dex_mod, modSize);
    fill('ST Constitution', char.save_con_mod, modSize); fill('ST Intelligence', char.save_int_mod, modSize);
    fill('ST Wisdom', char.save_wis_mod, modSize); fill('ST Charisma', char.save_cha_mod, modSize);

    check('Check Box 11', char.save_str_prof); check('Check Box 18', char.save_dex_prof);
    check('Check Box 19', char.save_con_prof); check('Check Box 20', char.save_int_prof);
    check('Check Box 21', char.save_wis_prof); check('Check Box 22', char.save_cha_prof);

    fill('Acrobatics', char.skill_acro_mod, modSize); fill('Animal', char.skill_anim_mod, modSize);
    fill('Arcana', char.skill_arca_mod, modSize); fill('Athletics', char.skill_athl_mod, modSize);
    fill('Deception ', char.skill_decp_mod, modSize); fill('History ', char.skill_hist_mod, modSize);
    fill('Insight', char.skill_insg_mod, modSize); fill('Intimidation', char.skill_inti_mod, modSize);
    fill('Investigation ', char.skill_invs_mod, modSize); fill('Medicine', char.skill_medi_mod, modSize);
    fill('Nature', char.skill_natu_mod, modSize); fill('Perception ', char.skill_perc_mod, modSize);
    fill('Performance', char.skill_perf_mod, modSize); fill('Persuasion', char.skill_pers_mod, modSize);
    fill('Religion', char.skill_reli_mod, modSize); fill('SleightofHand', char.skill_slei_mod, modSize);
    fill('Stealth ', char.skill_stea_mod, modSize); fill('Survival', char.skill_surv_mod, modSize);

    check('Check Box 23', char.skill_acro_prof); check('Check Box 24', char.skill_anim_prof);
    check('Check Box 25', char.skill_arca_prof); check('Check Box 26', char.skill_athl_prof);
    check('Check Box 27', char.skill_decp_prof); check('Check Box 28', char.skill_hist_prof);
    check('Check Box 29', char.skill_insg_prof); check('Check Box 30', char.skill_inti_prof);
    check('Check Box 31', char.skill_invs_prof); check('Check Box 32', char.skill_medi_prof);
    check('Check Box 33', char.skill_natu_prof); check('Check Box 34', char.skill_perc_prof);
    check('Check Box 35', char.skill_perf_prof); check('Check Box 36', char.skill_pers_prof);
    check('Check Box 37', char.skill_reli_prof); check('Check Box 38', char.skill_slei_prof);
    check('Check Box 39', char.skill_stea_prof); check('Check Box 40', char.skill_surv_prof);

    fill('Passive', char.passivePerception, 14);
    fill('CP', char.cp, 10); fill('SP', char.sp, 10); fill('EP', char.ep, 10);
    fill('GP', char.gp, 10); fill('PP', char.pp, 10);

    const attacks = parseAttacks(char.attacks || '');
    if (attacks[0]) { fill('Wpn Name', attacks[0].name, 8); fill('Wpn1 AtkBonus', attacks[0].bonus, 10); fill('Wpn1 Damage', attacks[0].damage, 8); }
    if (attacks[1]) { fill('Wpn Name 2', attacks[1].name, 8); fill('Wpn2 AtkBonus ', attacks[1].bonus, 10); fill('Wpn2 Damage ', attacks[1].damage, 8); }
    if (attacks[2]) { fill('Wpn Name 3', attacks[2].name, 8); fill('Wpn3 AtkBonus  ', attacks[2].bonus, 10); fill('Wpn3 Damage ', attacks[2].damage, 8); }

    if (char.portrait) {
      await setImage(pdfDoc, form, 'CHARACTER IMAGE', char.portrait);
    }

    fill('Spellcasting Class 2', char.charClass, 10);
    fill('SpellcastingAbility 2', char.spellcastingAbility, 10);
    fill('SpellSaveDC  2', char.spellSaveDC, 10);
    fill('SpellAtkBonus 2', char.spellAttackBonus, 10);

    const cantrips = (char.spells_cantrips || '').split('\n').filter(s => s.trim());
    for (let i = 0; i < Math.min(cantrips.length, 8); i++) fill(`Spells 10${14 + i}`, cantrips[i], 9);

    fill('SlotsTotal 19', char.slots_lvl1_total, 10); fill('SlotsRemaining 19', char.slots_lvl1_used, 10);
    const lvl1 = (char.spells_lvl1 || '').split('\n').filter(s => s.trim());
    for (let i = 0; i < Math.min(lvl1.length, 12); i++) fill(`Spells 10${23 + i}`, lvl1[i], 9);

    fill('SlotsTotal 20', char.slots_lvl2_total, 10); fill('SlotsRemaining 20', char.slots_lvl2_used, 10);
    const lvl2 = (char.spells_lvl2 || '').split('\n').filter(s => s.trim());
    for (let i = 0; i < Math.min(lvl2.length, 13); i++) fill(`Spells 10${34 + i}`, lvl2[i], 9);

    fill('SlotsTotal 21', char.slots_lvl3_total, 10); fill('SlotsRemaining 21', char.slots_lvl3_used, 10);
    const lvl3 = (char.spells_lvl3 || '').split('\n').filter(s => s.trim());
    for (let i = 0; i < Math.min(lvl3.length, 13); i++) fill(`Spells 10${47 + i}`, lvl3[i], 9);

    fill('SlotsTotal 22', char.slots_lvl4_total, 10); fill('SlotsRemaining 22', char.slots_lvl4_used, 10);
    const lvl4 = (char.spells_lvl4 || '').split('\n').filter(s => s.trim());
    for (let i = 0; i < Math.min(lvl4.length, 13); i++) fill(`Spells 10${60 + i}`, lvl4[i], 9);

    fill('SlotsTotal 23', char.slots_lvl5_total, 10); fill('SlotsRemaining 23', char.slots_lvl5_used, 10);
    const lvl5 = (char.spells_lvl5 || '').split('\n').filter(s => s.trim());
    for (let i = 0; i < Math.min(lvl5.length, 9); i++) fill(`Spells 10${73 + i}`, lvl5[i], 9);

    fill('SlotsTotal 24', char.slots_lvl6_total, 10); fill('SlotsRemaining 24', char.slots_lvl6_used, 10);
    const lvl6 = (char.spells_lvl6 || '').split('\n').filter(s => s.trim());
    for (let i = 0; i < Math.min(lvl6.length, 9); i++) fill(`Spells 10${82 + i}`, lvl6[i], 9);

    fill('SlotsTotal 25', char.slots_lvl7_total, 10); fill('SlotsRemaining 25', char.slots_lvl7_used, 10);
    const lvl7 = (char.spells_lvl7 || '').split('\n').filter(s => s.trim());
    for (let i = 0; i < Math.min(lvl7.length, 9); i++) fill(`Spells 10${91 + i}`, lvl7[i], 9);

    fill('SlotsTotal 26', char.slots_lvl8_total, 10); fill('SlotsRemaining 26', char.slots_lvl8_used, 10);
    const lvl8 = (char.spells_lvl8 || '').split('\n').filter(s => s.trim());
    for (let i = 0; i < Math.min(lvl8.length, 7); i++) fill(`Spells 10${100 + i}`, lvl8[i], 9);

    fill('SlotsTotal 27', char.slots_lvl9_total, 10); fill('SlotsRemaining 27', char.slots_lvl9_used, 10);
    const lvl9 = (char.spells_lvl9 || '').split('\n').filter(s => s.trim());
    for (let i = 0; i < Math.min(lvl9.length, 7); i++) fill(`Spells 10${107 + i}`, lvl9[i], 9);

    // Death saves
    check('Check Box 12', char.death_save_success_1); check('Check Box 13', char.death_save_success_2); check('Check Box 14', char.death_save_success_3);
    check('Check Box 15', char.death_save_fail_1); check('Check Box 16', char.death_save_fail_2); check('Check Box 17', char.death_save_fail_3);

    form.flatten();

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${char.charName || 'Personagem'}_Ficha.pdf`;
    link.click();
    URL.revokeObjectURL(url);

    exportBtn.innerHTML = originalHTML;
    exportBtn.disabled = false;
    await showAlert(getTranslation('msg_pdf_success'), { title: getTranslation('modal_title_success'), icon: 'military_tech', iconClass: 'modal-icon-success' });

  } catch (error) {
    console.error(error);
    await showAlert(error.message, { title: getTranslation('modal_title_error'), icon: 'error', iconClass: 'modal-icon-error' });
    const exportBtn = document.querySelector('.btn-secondary:nth-child(1)');
    exportBtn.disabled = false;
    exportBtn.innerHTML = '<span class="material-icons-round">picture_as_pdf</span> PDF';
  }
}


async function setImage(pdfDoc, form, buttonFieldName, base64Image) {
  try {
    const button = form.getButton(buttonFieldName);
    const widgets = button.acroField.getWidgets();
    const rect = widgets[0].getRectangle();

    let image;
    if (base64Image.startsWith('data:image/png')) {
      image = await pdfDoc.embedPng(base64Image);
    } else {
      image = await pdfDoc.embedJpg(base64Image);
    }

    const pages = pdfDoc.getPages();
    const page = pages[1];
    page.drawImage(image, { x: rect.x, y: rect.y, width: rect.width, height: rect.height });
  } catch (e) {
  }
}

function parseAttacks(text) {
  const list = [];
  const lines = text.split('\n').filter(l => l.trim());
  lines.forEach(l => {
    const p = l.split('|').map(s => s.trim());
    if (p.length >= 3) list.push({ name: p[0], bonus: p[1], damage: p[2] });
  });
  return list;
}
