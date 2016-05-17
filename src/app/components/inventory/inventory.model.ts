/**
 * Created by Keyston on 4/22/2016.
 */

import {Gear} from '../item-overview/gear.model';
import {GenderType, Rarity, ItemType, Affects} from '../../common/models/common';
import {Attributes, Attribute} from '../attributes/attributes.model';
import {Talent} from '../talents/talent.model';


export type InventoryItemType = 'weapon' | 'gear';
// tslint:disable-next-line
export const InventoryItemType = {
  Weapon: 'weapon' as InventoryItemType,
  Gear: 'gear' as InventoryItemType
};

export class InventoryWeapons {
  primary: Weapon;
  secondary: Weapon;
  sidearm: Weapon;
}

export class InventoryGear {
  bodyArmor: Gear;
  mask: Gear;
  kneePads: Gear;
  backPack: Gear;
  gloves: Gear;
  holster: Gear;
}

export class Inventory {

  id: string;
  name: string;

  gender: GenderType;

  weapons: InventoryWeapons = new InventoryWeapons();
  gear: InventoryGear = new InventoryGear();


}


export interface ItemModSlot {
  id: number;
  itemId?: number;
  primary?: Attribute;
  secondary?: Attribute;
}

export interface WeaponBonusStat {
  value: number;
  affects: Affects;
}
export interface WeaponStats {
  damage: number;  
  bonus?: WeaponBonusStat;
}


export interface InventoryItem {
  rarity: Rarity;
  type: ItemType;
  name: string;
  score: number;
  attributes?: Attributes;
  mods: ItemModSlot[];
  talents: Talent[];


}

export interface Weapon extends InventoryItem {
  stats: WeaponStats;
}


