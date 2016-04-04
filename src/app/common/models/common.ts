/**
 * Created by xastey on 4/2/2016.
 */

import {Gear} from "../../components/gear-overview/gear.model";
export type Rarity = "high-end" | "superior" | "specialized";
export type StatType = "firearms" | "stamaina" | "electronics";

export type GearType = "body-armor" | "mask" | "knee-pads" | "backpack" | "gloves" | "holster";


const ATTRIBUTE_OFFENSIVE = "offensive";
const ATTRIBUTE_DEFENSIVE = "defensive";
const ATTRIBUTE_UTILITY = "utility";
const MAJOR_ATTRIBUTE = "major";
const MINOR_ATTRIBUTE = "minor";

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


export interface IAttribute {
  name:string;
  id:number;
  format:AttributeFormat;
  //canSupport(rarity:Rarity, level:number):boolean;
}
export type AttributeFormat = "percent" | "number";
export const AttributeFormat = {
  PERCENT: "percent" as AttributeFormat,
  NUMBER: "number" as AttributeFormat
};

abstract class BaseAttribute implements IAttribute {
  protected _support:GearSupport[];
  kind:string;
  name:string;
  id:number;
  format:AttributeFormat;

  constructor(kind:string, id:number, name:string, format:AttributeFormat, support:GearSupport[]) {
    this.name = name;
    this.id = id;
    this.kind = kind;
    this._support = support;
    this.format = format;
  }


  canSupport(rarity:Rarity, level:number):boolean {
    let found = this._support
      .filter(support=> support.rarity == rarity && support.level == level);
    return !!found.length;
  }
}

export class EmptyAttribute implements IAttribute {


  name:string;
  id:number;
  format:AttributeFormat;
}
export class MajorAttribute extends BaseAttribute {
  constructor(id:number, name:string, format:AttributeFormat, support:GearSupport[]) {
    super("major", id, name, format, support)

  }
}

export class MinorAttribute extends BaseAttribute {
  constructor(id:number, name:string, format:AttributeFormat, support:GearSupport[]) {
    super("minor", id, name, format, support)

  }
}


