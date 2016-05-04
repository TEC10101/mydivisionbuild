/**
 * Created by xastey on 4/2/2016.
 */

export type Rarity = 'high-end' | 'superior' | 'specialized' | 'gear-set' ;
export type StatType = 'firearms' | 'stamaina' | 'electronics';

export type GearType = 'body-armor' | 'mask' | 'knee-pads' | 'back-pack' | 'gloves' | 'holster';
export type AttributeInheritance = 'native' | 'extra'
// tslint:disable-next-line
export const AttributeInheritance = {
  NATIVE: 'native' as AttributeInheritance,
  EXTRA: 'extra' as AttributeInheritance

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
export const GearType = {
  BodyArmor: 'body-armor' as GearType,
  Mask: 'mask' as GearType,
  KneePads: 'knee-pads' as GearType,
  BackPack: 'back-pack' as GearType,
  Gloves: 'gloves' as GearType,
  Holster: 'holster' as GearType
};


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
export interface GearAttribute {
  id: number;
  name: string;
  type: AttributeType;
  kind: AttributeKind;
  format: ValueFormat;
  native: boolean;
  mod: boolean;
  supports: GearType[];
  values: GearValues;


}
export type ValueFormat = 'percent' | 'number';
// tslint:disable-next-line
export const ValueFormat = {
  PERCENT: 'percent' as ValueFormat,
  NUMBER: 'number' as ValueFormat
};


export interface DivisionItem {
  id: number;
  name: string;
  icon?: string;
  belongsTo?: string;
}


export class GearStats {
  firearms: number;
  stamina: number;
  electronics: number;
}



