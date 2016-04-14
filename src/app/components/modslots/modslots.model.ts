import {GearStats, Rarity, GearRarity} from "../../common/models/common";
import {Attribute} from "../attributes/attributes.model";
import {CONST_EXPR} from "angular2/src/facade/lang";
/**
 * Created by xastey on 4/10/2016.
 */
export interface ModSlot {

  rarity:Rarity;
  stats?:GearStats;
  attribute:Attribute;
  attribute2?:Attribute;

}


export class ModSlotType {

  constructor(private _id:number, private _rarity:Rarity, private _slotKind:ModSlotKind) {
  }

  get id() {
    return this._id;
  }

  get rarity() {
    return this._rarity;
  }

  static toString(slotKind:ModSlotKind) {
    switch (slotKind) {
      case ModSlotKind.PERFORMANCE:
        return "Performance";

      case ModSlotKind.FIREARMS:
        return "Firearms";

      case ModSlotKind.STAMINA:
        return "Stamina";

      case ModSlotKind.ELECTRONICS:
        return "Electronics";
    }
  }

  get name() {
    return [
      this._rarity == GearRarity.SUPERIOR
        ? "Advanced " : "Prototype ",
      ModSlotType.toString(this._slotKind),
      " Mod"].join('');

  }

  create() {

  }

  get isPerformance() {
    return this._slotKind == ModSlotKind.PERFORMANCE
  }


}

export enum ModSlotKind{
  PERFORMANCE,
  FIREARMS,
  STAMINA,
  ELECTRONICS
}                                                           


export const MOD_SLOT_TYPES = CONST_EXPR([

  new ModSlotType(1, GearRarity.SUPERIOR, ModSlotKind.FIREARMS),
  new ModSlotType(2, GearRarity.SUPERIOR, ModSlotKind.STAMINA),
  new ModSlotType(3, GearRarity.SUPERIOR, ModSlotKind.ELECTRONICS),
  new ModSlotType(4, GearRarity.SUPERIOR, ModSlotKind.PERFORMANCE),

  new ModSlotType(5, GearRarity.HIGH_END, ModSlotKind.FIREARMS),
  new ModSlotType(6, GearRarity.HIGH_END, ModSlotKind.STAMINA),
  new ModSlotType(7, GearRarity.HIGH_END, ModSlotKind.ELECTRONICS),
  new ModSlotType(8, GearRarity.HIGH_END, ModSlotKind.PERFORMANCE),

]);




