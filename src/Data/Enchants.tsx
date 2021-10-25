import { ItemSlotKey, Enchant, ItemSource } from '../Types';

export const Enchants: Enchant[] = [
  // Head
  { name: 'Glyph of Power', varName: 'glyphOfPower', itemSlot: ItemSlotKey.Head, spellPower: 22, hitRating: 14, id: 35447, source: ItemSource.ShatarRevered, phase: 1 },
  { name: 'Glyph of Renewal', varName: 'glyphOfRenewal', itemSlot: ItemSlotKey.Head, spellPower: 12, mp5: 7, id: 35445, source: ItemSource.HonorHoldOrThrallmarRevered, phase: 1 },
  { name: 'Glyph of Fire Warding', varName: 'glyphOfFireWarding', itemSlot: ItemSlotKey.Head, fireResist: 20, id: 35456, source: ItemSource.HonorHoldOrThrallmarHonored, phase: 1 },
  { name: 'Glyph of Shadow Warding', varName: 'glyphOfShadowWarding', itemSlot: ItemSlotKey.Head, shadowResist: 20, id: 35458, source: ItemSource.LowerCityHonored, phase: 1 },
  { name: 'Glyph of Arcane Warding', varName: 'glyphOfArcaneWarding', itemSlot: ItemSlotKey.Head, arcaneResist: 20, id: 35455, source: ItemSource.ShatarHonored, phase: 1 },
  { name: 'Glyph of Nature Warding', varName: 'glyphOfNatureWarding', itemSlot: ItemSlotKey.Head, natureResist: 20, id: 35454, source: ItemSource.CenarionExpeditionHonored, phase: 1 },
  { name: 'Glyph of Frost Warding', varName: 'glyphOfFrostWarding', itemSlot: ItemSlotKey.Head, frostResist: 20, id: 35457, source: ItemSource.KeepersOfTimeHonored, phase: 1 },
  { name: 'Glyph of Chromatic Warding', varName: 'glyphOfChromaticWarding', itemSlot: ItemSlotKey.Head, arcaneResist: 8, fireResist: 8, natureResist: 8, shadowResist: 8, frostResist: 8, id: 37889, source: ItemSource.LowerCityHonored, phase: 1 },
  { name: 'Hoodoo Hex', varName: 'hoodooHex', itemSlot: ItemSlotKey.Head, stamina: 10, spellPower: 18, id: 24165, source: ItemSource.ZulGurub, phase: 0 },

  // Shoulders
  { name: 'Greater Inscription of Discipline', varName: 'greaterInscriptionOfDiscipline', itemSlot: ItemSlotKey.Shoulders, spellPower: 18, critRating: 10, id: 35406, source: ItemSource.AldorExalted, phase: 1 },
  { name: 'Greater Inscription of the Orb', varName: 'greaterInscriptionOfTheOrb', itemSlot: ItemSlotKey.Shoulders, spellPower: 12, critRating: 15, id: 35437, source: ItemSource.ScryersExalted, phase: 1 },
  { name: 'Inscription of Discipline', varName: 'inscriptionOfDiscipline', itemSlot: ItemSlotKey.Shoulders, spellPower: 15, id: 35405, source: ItemSource.AldorHonored, phase: 1 },
  { name: 'Inscription of the Orb', varName: 'inscriptionOfTheOrb', itemSlot: ItemSlotKey.Shoulders, critRating: 13, id: 35436, source: ItemSource.ScryersHonored, phase: 1, },
  { name: 'Inscription of Endurance', varName: 'inscriptionOfEndurance', itemSlot: ItemSlotKey.Shoulders, fireResist: 7, shadowResist: 7, arcaneResist: 7, natureResist: 7, frostResist: 7, id: 35441, source: ItemSource.VioletEyeHonored, phase: 1 },
  { name: 'Power of the Scourge', varName: 'powerOfTheScourge', itemSlot: ItemSlotKey.Shoulders, spellPower: 15, critRating: 14, id: 29467, source: ItemSource.Naxxramas, phase: 0 },
  { name: 'Zandalar SIgnet of Mojo', varName: 'zandalarSignetOfMojo', itemSlot: ItemSlotKey.Shoulders, spellPower: 18, id: 24421, source: ItemSource.ZandalarTribeExalted, phase: 0 },

  // Back
  { name: 'Subtlety', varName: 'subtlety', itemSlot: ItemSlotKey.Back, threatReduction: 0.02, id: 25084, source: ItemSource.Enchanting, phase: 0 },
  { name: 'Spell Penetration', varName: 'spellPenetration', itemSlot: ItemSlotKey.Back, spellPenetration: 20, id: 34003, source: ItemSource.Enchanting, phase: 1 },
  { name: 'Major Resistance', varName: 'majorResistance', itemSlot: ItemSlotKey.Back, fireResist: 7, shadowResist: 7, arcaneResist: 7, natureResist: 7, frostResist: 7, id: 27962, source: ItemSource.Enchanting, phase: 1 },
  { name: 'Greater Arcane Resistance', varName: 'greaterArcaneResistance', itemSlot: ItemSlotKey.Back, arcaneResist: 15, id: 34005, source: ItemSource.Enchanting, phase: 1 },
  { name: 'Greater Fire Resistance', varName: 'greaterFireResistance', itemSlot: ItemSlotKey.Back, fireResist: 15, id: 25081, source: ItemSource.Enchanting, phase: 0 },
  { name: 'Greater Shadow Resistance', varName: 'greaterShadowResistance', itemSlot: ItemSlotKey.Back, shadowResist: 15, id: 34006, source: ItemSource.Enchanting, phase: 1 },
  { name: 'Greater Nature Resistance', varName: 'greaterNatureResistance', itemSlot: ItemSlotKey.Back, natureResist: 15, id: 25082, source: ItemSource.Enchanting, phase: 0 },

  // Chest
  { name: 'Exceptional Stats', varName: 'exceptionalStats', itemSlot: ItemSlotKey.Chest, stamina: 6, intellect: 6, spirit: 6, id: 27960, source: ItemSource.Enchanting, phase: 1 },
  { name: 'Major Resilience', varName: 'majorResilience', itemSlot: ItemSlotKey.Chest, resilienceRating: 15, id: 33992, source: ItemSource.Enchanting, phase: 1 },
  { name: "Magister's Armor Kit", varName: 'magistersArmorKit', itemSlot: ItemSlotKey.Chest, mp5: 3, id: 32399, source: ItemSource.Leatherworking, phase: 1 },
  { name: 'Arcane Armor Kit', varName: 'arcaneArmorKit', itemSlot: ItemSlotKey.Chest, arcaneResist: 8, id: 35420, source: ItemSource.Leatherworking, phase: 1 },
  { name: 'Flame Armor Kit', varName: 'flameArmorKit', itemSlot: ItemSlotKey.Chest, fireResist: 8, id: 35416, source: ItemSource.Leatherworking, phase: 1 },
  { name: 'Shadow Armor Kit', varName: 'shadowArmorKit', itemSlot: ItemSlotKey.Chest, shadowResist: 8, id: 35415, source: ItemSource.Leatherworking, phase: 1 },
  { name: 'Nature Armor Kit', varName: 'natureArmorKit', itemSlot: ItemSlotKey.Chest, natureResist: 8, id: 35419, source: ItemSource.Leatherworking, phase: 1 },
  { name: 'Frost Armor Kit', varName: 'frostArmorKit', itemSlot: ItemSlotKey.Chest, frostResist: 8, id: 35418, source: ItemSource.Leatherworking, phase: 1 },
  { name: 'Greater Stats', varName: 'greaterStats', itemSlot: ItemSlotKey.Chest, stamina: 4, intellect: 4, spirit: 4, id: 20025, source: ItemSource.Enchanting, phase: 0 },

  // Bracer
  { name: 'Spellpower', varName: 'spellpower', itemSlot: ItemSlotKey.Bracer, spellPower: 15, id: 27917, source: ItemSource.Enchanting, phase: 1 },
  { name: 'Superior Healing', varName: 'superiorHealing', itemSlot: ItemSlotKey.Bracer, spellPower: 10, id: 27911, source: ItemSource.Enchanting, phase: 1 },
  { name: 'Major Intellect', varName: 'majorIntellect', itemSlot: ItemSlotKey.Bracer, intellect: 12, id: 34001, source: ItemSource.Enchanting, phase: 1 },
  { name: 'Stats', varName: 'stats', itemSlot: ItemSlotKey.Bracer, stamina: 4, intellect: 4, spirit: 4, id: 27905, source: ItemSource.Enchanting, phase: 1 },
  { name: 'Healing Power', varName: 'healingPower', itemSlot: ItemSlotKey.Bracer, spellPower: 8, id: 23802, source: ItemSource.Enchanting, phase: 0 },

  // Gloves
  { name: 'Major Spellpower', varName: 'majorSpellpower', itemSlot: ItemSlotKey.Gloves, spellPower: 20, id: 33997, source: ItemSource.Enchanting, phase: 1 },
  { name: 'Spell Strike', varName: 'spellStrike', itemSlot: ItemSlotKey.Gloves, hitRating: 15, id: 33994, source: ItemSource.Enchanting, phase: 1 },
  { name: 'Blasting', varName: 'blasting', itemSlot: ItemSlotKey.Gloves, critRating: 10, id: 33993, source: ItemSource.Enchanting, phase: 1 },
  { name: "Magister's Armor Kit", varName: 'magistersArmorKit', itemSlot: ItemSlotKey.Gloves, mp5: 3, id: 32399, source: ItemSource.Leatherworking, phase: 1 },
  { name: 'Arcane Armor Kit', varName: 'arcaneArmorKit', itemSlot: ItemSlotKey.Gloves, arcaneResist: 8, id: 35420, source: ItemSource.Leatherworking, phase: 1 },
  { name: 'Flame Armor Kit', varName: 'flameArmorKit', itemSlot: ItemSlotKey.Gloves, fireResist: 8, id: 35416, source: ItemSource.Leatherworking, phase: 1 },
  { name: 'Shadow Armor Kit', varName: 'shadowArmorKit', itemSlot: ItemSlotKey.Gloves, shadowResist: 8, id: 35415, source: ItemSource.Leatherworking, phase: 1 },
  { name: 'Nature Armor Kit', varName: 'natureArmorKit', itemSlot: ItemSlotKey.Gloves, natureResist: 8, id: 35419, source: ItemSource.Leatherworking, phase: 1 },
  { name: 'Frost Armor Kit', varName: 'frostArmorKit', itemSlot: ItemSlotKey.Gloves, frostResist: 8, id: 29486, source: ItemSource.Leatherworking, phase: 1 },

  // Legs
  { name: 'Runic Spellthread', varName: 'runicSpellthread', itemSlot: ItemSlotKey.Legs, stamina: 20, spellPower: 35, id: 31372, source: ItemSource.Tailoring, phase: 1 },
  { name: 'Mystic Spellthread', varName: 'mysticSpellthread', itemSlot: ItemSlotKey.Legs, stamina: 15, spellPower: 25, id: 31371, source: ItemSource.Tailoring, phase: 1 },
  { name: "Magister's Armor Kit", varName: 'magistersArmorKit', itemSlot: ItemSlotKey.Legs, mp5: 3, id: 32399, source: ItemSource.Leatherworking, phase: 1 },
  { name: 'Arcane Armor Kit', varName: 'arcaneArmorKit', itemSlot: ItemSlotKey.Legs, arcaneResist: 8, id: 35420, source: ItemSource.Leatherworking, phase: 1 },
  { name: 'Flame Armor Kit', varName: 'flameArmorKit', itemSlot: ItemSlotKey.Legs, fireResist: 8, id: 35416, source: ItemSource.Leatherworking, phase: 1 },
  { name: 'Shadow Armor Kit', varName: 'shadowArmorKit', itemSlot: ItemSlotKey.Legs, shadowResist: 8, id: 35415, source: ItemSource.Leatherworking, phase: 1 },
  { name: 'Nature Armor Kit', varName: 'natureArmorKit', itemSlot: ItemSlotKey.Legs, natureResist: 8, id: 35419, source: ItemSource.Leatherworking, phase: 1 },
  { name: 'Frost Armor Kit', varName: 'frostArmorKit', itemSlot: ItemSlotKey.Legs, frostResist: 8, id: 29486, source: ItemSource.Leatherworking, phase: 1 },
  { name: 'Hoodoo Hex', varName: 'hoodooHex', itemSlot: ItemSlotKey.Legs, stamina: 10, spellPower: 18, id: 24165, source: ItemSource.ZulGurub, phase: 0 },

  // Boots
  { name: 'Fortitude', varName: 'fortitude', itemSlot: ItemSlotKey.Boots, stamina: 12, id: 46490, source: ItemSource.Enchanting, phase: 1 },
  { name: "Boar's Speed", varName: 'boarsSpeed', itemSlot: ItemSlotKey.Boots, stamina: 9, id: 34008, source: ItemSource.Enchanting, phase: 1 },
  { name: "Magister's Armor Kit", varName: 'magistersArmorKit', itemSlot: ItemSlotKey.Boots, mp5: 3, id: 32399, source: ItemSource.Leatherworking, phase: 1 },
  { name: 'Arcane Armor Kit', varName: 'arcaneArmorKit', itemSlot: ItemSlotKey.Boots, arcaneResist: 8, id: 35420, source: ItemSource.Leatherworking, phase: 1 },
  { name: 'Flame Armor Kit', varName: 'flameArmorKit', itemSlot: ItemSlotKey.Boots, fireResist: 8, id: 35416, source: ItemSource.Leatherworking, phase: 1 },
  { name: 'Shadow Armor Kit', varName: 'shadowArmorKit', itemSlot: ItemSlotKey.Boots, shadowResist: 8, id: 35415, source: ItemSource.Leatherworking, phase: 1 },
  { name: 'Nature Armor Kit', varName: 'natureArmorKit', itemSlot: ItemSlotKey.Boots, natureResist: 8, id: 35419, source: ItemSource.Leatherworking, phase: 1 },
  { name: 'Frost Armor Kit', varName: 'frostArmorKit', itemSlot: ItemSlotKey.Boots, frostResist: 8, id: 29486, source: ItemSource.Leatherworking, phase: 1 },

  // Ring
  { name: 'Spellpower', varName: 'spellpower', itemSlot: ItemSlotKey.Ring, spellPower: 12, id: 27924, source: ItemSource.Enchanting, phase: 1 },
  { name: 'Stats', varName: 'stats', itemSlot: ItemSlotKey.Ring, stamina: 4, intellect: 4, spirit: 4, id: 27927, source: ItemSource.Enchanting, phase: 1 },

  // Weapon
  { name: 'Soulfrost', varName: 'soulfrost', itemSlot: ItemSlotKey.Mainhand, shadowPower: 54, id: 27982, source: ItemSource.Enchanting, phase: 1 },
  { name: 'Major Spellpower', varName: 'majorSpellpower', itemSlot: ItemSlotKey.Mainhand, spellPower: 40, id: 27975, source: ItemSource.Enchanting, phase: 1 },
  { name: 'Sunfire', varName: 'sunfire', itemSlot: ItemSlotKey.Mainhand, firePower: 50, id: 27981, source: ItemSource.Enchanting, phase: 1 },
  { name: 'Major Intellect', varName: 'majorIntellect', itemSlot: ItemSlotKey.Mainhand, intellect: 30, id: 27968, source: ItemSource.Enchanting, phase: 1 },
  { name: 'Spell Power', varName: 'spellPower', itemSlot: ItemSlotKey.Mainhand, spellPower: 30, id: 22749, source: ItemSource.Enchanting, phase: 0 }
]