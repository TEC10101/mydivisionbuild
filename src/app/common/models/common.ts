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
  canSupport(rarity:Rarity, level:number):boolean;
}
abstract class BaseAttribute implements IAttribute {
  protected _support:GearSupport[];
  kind:string;
  name:string;

  constructor(kind:string, name:string, support:GearSupport[]) {
    this.name = name;
    this.kind = kind;
    this._support = support;
  }


  canSupport(rarity:Rarity, level:number):boolean {
    let found = this._support
      .filter(support=> support.rarity == rarity && support.level == level);
    return !!found.length;
  }
}
export class MajorAttribute extends BaseAttribute {
  constructor(name:string, support:GearSupport[]) {
    super("major", name, support)

  }
}

export class MinorAttribute extends BaseAttribute {
  constructor(name:string, support:GearSupport[]) {
    super("minor", name, support)

  }
}


