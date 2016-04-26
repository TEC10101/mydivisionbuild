/**
 * Created by xastey on 4/3/2016.
 */

import {Rarity, GearType, GearStats} from "../../common/models/common";
import {Attributes, Attribute} from "../attributes/attributes.model";


export interface Gear {
  itemId:number;
  rarity:Rarity;
  type:GearType;
  title:string;

  score:number;
  stats:GearStats;
  armor:number;
  attributes:Attributes;
  mods:GearModSlot[];
}


export interface GearModSlot {
  id:number;
  primary?:Attribute;
  secondary?:Attribute;
}


export const DUMMY_GEAR:Gear = {
  rarity: "superior",
  type: GearType.BodyArmor,
  itemId: 16,
  title: "Rapid Assault Vest",
  armor: 1049,
  score: 131,
  stats: {
    firearms: 0,
    stamina: 422,
    electronics: 0
  },
  attributes: {
    major: [{
      id: 13,//"Health on Kill",
      value: 8

    }],
    minor: [],
    skill: []

  },
  mods: [{
    id: 1
  }, {
    id: 5
  }]
};
