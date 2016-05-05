/**
 * Created by xastey on 4/22/2016.
 */

import {Gear} from '../gear-overview/gear.model';
import {GenderType, Rarity, ItemType} from '../../common/models/common';
import {Attributes, Attribute} from '../attributes/attributes.model';
import {Talent} from "../talents/talent.model";
export class Inventory {

  id: string;
  name: string;

  gender: GenderType;
  primary: any;
  secondary: any;
  sidearm: any;

  bodyArmor: Gear;
  mask: Gear;
  kneePads: Gear;
  backPack: Gear;
  gloves: Gear;
  holster: Gear;
}


export interface ItemModSlot {
  id: number;
  primary?: Attribute;
  secondary?: Attribute;
}
export interface InventoryItem {
  rarity: Rarity;
  type: ItemType;
  name: string;
  score: number;
  attributes: Attributes;
  mods: ItemModSlot[];
  talents: Talent[];

}

