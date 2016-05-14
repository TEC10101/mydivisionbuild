/**
 * Created by xastey on 4/2/2016.
 */

export type Rarity = 'high-end' | 'superior' | 'specialized' | 'gear-set' ;
export type StatType = 'firearms' | 'stamaina' | 'electronics';

export type ItemType = 'body-armor' | 'mask' | 'knee-pads'
  | 'back-pack' | 'gloves' | 'holster'
  | 'pistol' | 'assault-rifle'| 'smg'|'shotgun'|'sniper'|'lmg';
export type AttributeInheritance = 'native' | 'extra'
// tslint:disable-next-line
export const AttributeInheritance = {
  NATIVE: 'native' as AttributeInheritance,
  EXTRA: 'extra' as AttributeInheritance

};

export type WeaponSlot = 'primary' | 'secondary'| 'sidearm';
// tslint:disable-next-line
export const WeaponSlot = {
  Primary: 'primary' as WeaponSlot,
  Secondary: 'secondary' as WeaponSlot,
  Sidearm: 'sidearm' as WeaponSlot
};


export type GenderType = 'male' | 'female';

const ATTRIBUTE_OFFENSIVE = 'offensive';
const ATTRIBUTE_DEFENSIVE = 'defensive';
const ATTRIBUTE_UTILITY = 'utility';
const MAJOR_ATTRIBUTE = 'major';
const MINOR_ATTRIBUTE = 'minor';

export type AttributeKind = 'offensive' | 'defensive' | 'utility'
// tslint:disable-next-line
export const AttributeKind = {
  OFFENSIVE: 'offensive' as AttributeKind,
  DEFENSIVE: 'defensive' as AttributeKind,
  UTILITY: 'utility' as AttributeKind
};
export type AttributeType  = 'major' | 'minor' | 'main' | 'skill'
// tslint:disable-next-line
export const AttributeType = {
  MAJOR: 'major' as AttributeType,
  MINOR: 'minor' as AttributeType,
  MAIN: 'main' as AttributeType,
  SKILL: 'skill' as AttributeType
};

// https://basarat.gitbooks.io/typescript/content/docs/enums.html
// tslint:disable-next-line
export const ItemType = {
  BodyArmor: 'body-armor' as ItemType,
  Mask: 'mask' as ItemType,
  KneePads: 'knee-pads' as ItemType,
  BackPack: 'back-pack' as ItemType,
  Gloves: 'gloves' as ItemType,
  Holster: 'holster' as ItemType,
  Pistol: 'pistol' as ItemType,
  AR: 'assault-rifle' as ItemType,
  SMG: 'smg' as ItemType,
  LMG: 'lmg' as ItemType,
  Shotgun: 'shotgun' as ItemType,
  Sniper: 'sniper' as ItemType
};
export const GEAR_TYPES = [ItemType.BodyArmor, ItemType.Mask,
  ItemType.KneePads, ItemType.BackPack,
  ItemType.Gloves, ItemType.Holster];
export const WEAPON_TYPES = [ItemType.Pistol, ItemType.AR, ItemType.SMG, ItemType.LMG,
  ItemType.Shotgun, ItemType.Sniper];


// tslint:disable-next-line
export class AttributeRange {
  low: number;
  high: number;

}

// tslint:disable-next-line
export const Gender = {
  MALE: 'male' as GenderType,
  FEMALE: 'female' as GenderType
};
// tslint:disable-next-line
export const GearRarity = {
  HIGH_END: 'high-end' as Rarity,
  SUPERIOR: 'superior' as Rarity,
  SPECIALIZED: 'specialized' as Rarity,
  GEAR_SET: 'gear-set' as Rarity
};


export class GearSupport {
  rarity: Rarity;
  level: number;
  range: AttributeRange;

}


interface GearValues {
  131?: number[];
  147?: number[];
  165?: number[];
}

export interface DivisionAttribute {
  id: number;
  name: string;
  type: AttributeType;
  format?: ValueFormat;
  affects: Affects[];
}
export interface GearAttribute extends DivisionAttribute {

  name: string;
  type: AttributeType;
  kind: AttributeKind;

  native: boolean;
  mod: boolean;
  supports: ItemType[];
  values: GearValues;


}

export interface WeaponAttribute extends DivisionAttribute {
  id: number;
  name: string;
  type: AttributeType;
  slots: string[];
}
export type ValueFormat = 'percent' | 'number' | 'weapon'
// tslint:disable-next-line
export const ValueFormat = {
  PERCENT: 'percent' as ValueFormat,
  NUMBER: 'number' as ValueFormat,
  WEAPON: 'weapon' as ValueFormat
};


export interface DivisionItem {
  id: number;
  name: string;
  icon?: string;
  belongsTo?: string;
  // talents?: Talent[];
}


export class GearStats {
  firearms: number;
  stamina: number;
  electronics: number;
}


export interface ItemTalent {
  id: string;
  template: string;
  affects?: Affects[];
}

export interface WeaponTalent extends ItemTalent {

  supports: ItemType[];
}


export type Affects = 'chc' | 'chd' | 'weapon_damage'
  | 'assault_rifle_damage' | 'shotgun_damage' | 'lmg_damage'
  |'pistol_damage'|'sniper_damage'|'armor'|'health'|'skill_power'
  |'firearms'|'stamina'|'electronics' | 'accuracy' | 'hip_accuracy'
// tslint:disable-next-line
export const Affects = {
  normalize: function (value: string) {
    return (value.replace(/-/g, '_').toLowerCase()) as Affects;
  },
  CRIT_HIT_CHANCE: 'crit_hit_chance'  as Affects,
  CRIT_HIT_DAMAGE: 'chd'  as Affects,
  WEAPON_DAMAGE: 'weapon_damage'  as Affects,
  ASSAULT_RIFLE_DAMAGE: 'assault_rifle_damage'  as Affects,
  SHOTGUN_DAMAGE: 'shotgun_damage'  as Affects,
  LMG_DAMAGE: 'lmg_damage'  as Affects,
  PISTOL_DAMAGE: 'pistol_damage' as Affects,
  SNIPER_DAMAGE: 'sniper_damage' as Affects,
  ARMOR: 'armor' as Affects,
  HEALTH: 'health' as Affects,
  SKILL_POWER: 'skill_power'  as Affects,
  FIREARMS: 'firearms' as Affects,
  STAMINA: 'stamina' as Affects,
  ELECTRONICS: 'electronics' as Affects,
  ACCURACY: 'accuracy' as Affects,
  HIP_ACCURACY: 'hip_accuracy' as Affects

};

export interface AffectsResults {

  affects: Affects;
  value: number;
}



