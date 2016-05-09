/**
 * Created by xastey on 5/7/2016.
 */


import {Injectable} from '@angular/core';
import {Inventory, Weapon, InventoryGear} from '../components/inventory/inventory.model';
import {ItemType, Affects} from '../common/models/common';
import {WeaponDescriptor, WeaponInfo, WeaponMetaData} from './item.service';
import {Gear} from '../components/gear-overview/gear.model';
@Injectable()
export class CharacterSheetService {


  caculateDps(weapon: Weapon, inventory: InventoryGear) {

    return 12345;
  }

  caculateWeaponDamage(weapon: Weapon) {
    return weapon.stats.damage;
  }

  caculateWeaponRPM(weapon: Weapon) {
    return weapon.stats.rpm;
  }

  caculateWeaponMagazine(weapon: Weapon) {
    return weapon.stats.magazine;
  }
}

class InventoryCalculator {


  private _primary: WeaponStatsCalculator;

  constructor(private _inventory: Inventory) {

    let weapons = this._inventory.weapons;
    this._primary = new WeaponStatsCalculator(weapons.primary, void 0, this);
    this._secondary = new WeaponStatsCalculator(weapons.secondary, void 0, this);
  }

  get skillpower() {
    return 0;
  }

  get firearms() {
    return 0;
  }

  get stamina() {
    return 0;
  }

  get electronics() {

  }

  weaponDamage(itemType: ItemType) {
    return 0;
  }

  findGearThatAffects(affects: Affects) {
    let all = this._inventory.gear;
    _.filter(all, (gear: Gear) => {

      let talentAffects = this.checkTalentsForAffects(gear, affects);

    });
  }

  checkTalentsForAffects(gear: Gear, affects: Affects) {
    let talents = gear.talents;
    talents.
  }
}


class WeaponStatsCalculator {

  private _inventoryCalc: InventoryCalculator;
  private _weaponInfo: WeaponInfo;

  constructor(private _weapon: Weapon,
              private _weaponMetaData: WeaponMetaData,
              private _inventoryCalc: InventoryCalculator) {


  }


  get weaponDescriptor() {

    return this._weaponMetaData.forType(this._weapon.type);

  }

  weaponInfo(descriptor?: WeaponDescriptor) {

    return _.find(descriptor
        ? descriptor.items : this.weaponDescriptor.items,
      {name: this._weapon.name});
  }

  get damage() {
    // https://www.reddit.com/r/thedivision/comments/4cfhr6/more_information_on_weapon_damage_math/
    let base = (
    this._weapon.stats.damage
    + this._flatDamageBonus() + this._scalingFactor()
    * this._inventoryCalc.firearms);

    let damagePercentage = 1 + this._weaponDamagePercent();
    return base * damagePercentage * this._otherWeaponDamageMultipliers();
  }

  _scalingFactor() {

    let descriptor = this.weaponDescriptor;
    let family = this.weaponInfo(descriptor);
    return descriptor.attributes[family].scaling;

  }

  _flatDamageBonus() {
    return this._inventoryCalc.weaponDamage(this._weapon.type);
  }

  _weaponDamagePercent() {
    return 0;
  }

  _otherWeaponDamageMultipliers() {
    // https://www.reddit.com/r/thedivision/comments/4gica6/all_your_multipliers_are_belong_to_us/
    return 1;
  }

}
