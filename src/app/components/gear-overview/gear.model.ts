/**
 * Created by xastey on 4/3/2016.
 */

import {Rarity, GearType, GearStats} from "../../common/models/common";
import {Attributes, Attribute} from "../attributes/attributes.model";


export class Gear {
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
