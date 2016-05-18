import {GearStats, Rarity, GearRarity, GearAttribute} from '../../common/models/common';
import {Attribute} from '../attributes/attributes.model';
import * as _ from 'lodash/index';
/**
 * Created by Keyston on 4/10/2016.
 */
export interface ModSlot {

  rarity: Rarity;
  stats?: GearStats;
  attribute: Attribute;
  attribute2?: Attribute;

}


export class ModSlotType {

  static toString(slotKind: ModSlotKind) {
    switch (slotKind) {
      case ModSlotKind.PERFORMANCE:
        return 'Performance';

      case ModSlotKind.FIREARMS:
        return 'Firearms';

      case ModSlotKind.STAMINA:
        return 'Stamina';

      case ModSlotKind.ELECTRONICS:
        return 'Electronics';
      case ModSlotKind.MUZZLE:
        return 'Muzzle';
      case ModSlotKind.UNDERBARREL:
        return 'Underbarrel';
      case ModSlotKind.OPTICS:
        return 'Optics';
      case ModSlotKind.MAGAZINE:
        return 'Magazine';
      default:
        throw new Error('Invalid ModSlotKind');
    }
  }

  constructor(private _id: number, private _rarity: Rarity, private _slotKind: ModSlotKind) {
  }


  get kind() {
    return this._slotKind;
  }

  get id() {
    return this._id;
  }

  get rarity() {
    return this._rarity;
  }

  get identifier() {
    return ModSlotType.toString(this._slotKind).toLowerCase();
  }

  get belongsToWeapon() {
    return this._slotKind >= ModSlotKind.MUZZLE;
  }


  get name() {
    return this._slotKind < ModSlotKind.MUZZLE ? [
      this._rarity === GearRarity.SUPERIOR
        ? 'Advanced ' : 'Prototype ',
      ModSlotType.toString(this._slotKind),
      ' Mod'].join('') : ModSlotType.toString(this._slotKind);

  }


  resolveMainAttribute(attributes: GearAttribute[]) {
    return _.find(attributes, {name: ModSlotType.toString(this._slotKind)});
  }

  get isPerformance() {
    return this._slotKind === ModSlotKind.PERFORMANCE;
  }


}

export enum ModSlotKind {
  PERFORMANCE,
  FIREARMS,
  STAMINA,
  ELECTRONICS,
  MUZZLE,
  UNDERBARREL,
  OPTICS,
  MAGAZINE
}


export const GEAR_MOD_SLOT_TYPES = [

  new ModSlotType(1, GearRarity.SUPERIOR, ModSlotKind.FIREARMS),
  new ModSlotType(2, GearRarity.SUPERIOR, ModSlotKind.STAMINA),
  new ModSlotType(3, GearRarity.SUPERIOR, ModSlotKind.ELECTRONICS),
  new ModSlotType(4, GearRarity.SUPERIOR, ModSlotKind.PERFORMANCE),

  new ModSlotType(5, GearRarity.HIGH_END, ModSlotKind.FIREARMS),
  new ModSlotType(6, GearRarity.HIGH_END, ModSlotKind.STAMINA),
  new ModSlotType(7, GearRarity.HIGH_END, ModSlotKind.ELECTRONICS),
  new ModSlotType(8, GearRarity.HIGH_END, ModSlotKind.PERFORMANCE)

];

export const WEAPON_MOD_SLOT_TYPES = [

  new ModSlotType(1, GearRarity.SUPERIOR, ModSlotKind.MUZZLE),
  new ModSlotType(2, GearRarity.SUPERIOR, ModSlotKind.UNDERBARREL),
  new ModSlotType(3, GearRarity.SUPERIOR, ModSlotKind.OPTICS),
  new ModSlotType(4, GearRarity.SUPERIOR, ModSlotKind.MAGAZINE),

  new ModSlotType(5, GearRarity.HIGH_END, ModSlotKind.MUZZLE),
  new ModSlotType(6, GearRarity.HIGH_END, ModSlotKind.UNDERBARREL),
  new ModSlotType(7, GearRarity.HIGH_END, ModSlotKind.OPTICS),
  new ModSlotType(8, GearRarity.HIGH_END, ModSlotKind.MAGAZINE)

];


export type WeaponModType =
  'recoil' | 'suppressor_small'  | 'suppressor_large' |'suppressor_small'|
    'iron_sights' | 'rds_small' | 'rds_large'|
    'grip_small' | 'grip_large' | 'laser'


