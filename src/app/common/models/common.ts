/**
 * Created by xastey on 4/2/2016.
 */

export type Rarity = "high-end" | "superior" | "specialized";
export type StatType = "firearms" | "stamaina" | "electronics";

export type GearType = "body-armor" | "mask" | "knee-pads" | "backpack" | "gloves" | "holster";


const ATTRIBUTE_OFFENSIVE = "offensive";
const ATTRIBUTE_DEFENSIVE = "defensive";
const ATTRIBUTE_UTILITY = "utility";
const MAJOR_ATTRIBUTE = "major";
const MINOR_ATTRIBUTE = "minor";

export type AttributeKind = "offensive" | "defensive" | "utility"
export const AttributeKind = {
  OFFENSIVE: "offensive" as AttributeKind,
  DEFENSIVE: "defensive" as AttributeKind,
  UTILITY: "utility" as AttributeKind
};
export type AttributeType  = "major" | "minor"
export const AttributeType = {
  MAJOR: "major" as AttributeType,
  MINOR: "minor" as AttributeType
};

//https://basarat.gitbooks.io/typescript/content/docs/enums.html
export const GearType = {
  BodyArmor: "body-armor" as GearType,
  Mask: "mask" as GearType,
  KneePads: "knee-pads" as GearType,
  Backpack: "backpack" as GearType,
  Gloves: "gloves" as GearType,
  Holster: "holster" as GearType,
};


export class AttributeRange {
  low:number;
  high:number;

}

export const GearRarity = {
  HIGH_END: "high-end" as Rarity,
  SUPERIOR: "superior" as Rarity,
  SPECIALIZED: "specialized" as Rarity
};


export class GearSupport {
  rarity:Rarity;
  level:number;
  range:AttributeRange

}


export interface GearAttribute {
  id:number;
  name:string;
  type:AttributeType;
  kind:AttributeKind;
  format:ValueFormat;
  native:boolean;
  slot:boolean;
  supports:GearType[];

}
export type ValueFormat = "percent" | "number";
export const ValueFormat = {
  PERCENT: "percent" as ValueFormat,
  NUMBER: "number" as ValueFormat
};


export interface DivisionItem {
  id:number;
  name:string;
}


