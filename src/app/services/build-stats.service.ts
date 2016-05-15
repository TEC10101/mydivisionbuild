/**
 * Created by xastey on 5/7/2016.
 */


import {Injectable} from '@angular/core';
import {Inventory, Weapon, InventoryGear} from '../components/inventory/inventory.model';
import {ItemType, Affects} from '../common/models/common';
import {
  WeaponDescriptor,
  WeaponInfo,
  WeaponDescriptorCollection,
  ItemsService,
  GearDescriptorCollection,
  WeaponBaseStats
} from './item.service';
import {Gear} from '../components/gear-overview/gear.model';
import * as _ from 'lodash/index';
@Injectable()
export class BuildStatsService {


  constructor(private _itemsService: ItemsService) {

  }

  create(inventory: Inventory) {

    let gearDescriptors = this._itemsService._gearDescriptors;
    let weaponDescriptors = this._itemsService._weaponDescriptors;
    return new InventoryCalculator(
      inventory, weaponDescriptors,
      gearDescriptors);
  }

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

export class InventoryCalculator {


  private _primary: WeaponStatsCalculator;
  private _secondary: WeaponStatsCalculator;

  constructor(private _inventory: Inventory,
              weaponDescriptors: WeaponDescriptorCollection,
              private _gearDescriptors: GearDescriptorCollection) {

    let weapons = this._inventory.weapons;
    this._primary = new WeaponStatsCalculator(weapons.primary, weaponDescriptors, this);
    this._secondary = new WeaponStatsCalculator(weapons.secondary, weaponDescriptors, this);
  }

  get primary() {
    return this._primary;
  }

  get secondary() {
    return this._secondary;
  }

  get skillpower() {

    let fromElectronics = (this.electronics * 10);
    let fromMods = this.calculateAffectsValueFromMods(Affects.SKILL_POWER);
    let fromAttributes = this.calculateAffectsValueFromAttributes(Affects.SKILL_POWER);
    return fromElectronics + fromMods + fromAttributes;
  }

  get firearms() {
    let base = this._reduce((sum, gear) => sum + gear.stats.firearms);
    let fireArmsFromMods = this.calculateAffectsValueFromMods(Affects.FIREARMS);
    return base + fireArmsFromMods;
  }

  get stamina() {
    let base = this._reduce((sum, gear) => sum + gear.stats.stamina);
    let fromMods = this.calculateAffectsValueFromMods(Affects.STAMINA);
    return base + fromMods;
  }

  staminaFor(gear: Gear) {
    let base = gear.stats.stamina;
    let fromMods = this.calculateAffectsValueFromMods(Affects.STAMINA, gear);
    return base + fromMods;

  }

  get electronics() {
    let base = 535; // base at lvl 30
    let fromGear = this._reduce((sum, gear) => sum + gear.stats.electronics);
    let fromMods = this.calculateAffectsValueFromMods(Affects.ELECTRONICS);
    return base + fromGear + fromMods;
  }

  get health() {
    // http://divisionfieldguide.com/post/2016/03/which-is-better-armor-versus-health/
    let base = this.stamina * 30;
    let fromMods = this.calculateAffectsValueFromMods(Affects.HEALTH);
    let fromAttributes = this.calculateAffectsValueFromAttributes(Affects.HEALTH);
    return base + fromMods + fromAttributes;
  }

  weaponDamage(itemType: ItemType) {
    let affects = Affects.normalize(itemType + '_damage');
    return this.calculateAffectsValueFromAttributes(affects);
  }


  calculateTotalAffectsValue(affects: Affects) {
    let talentAffects = this.calculateAffectsValueFromTalents(affects);
    let modsAffects = this.calculateAffectsValueFromMods(affects);
    let attributesAffects = this.calculateAffectsValueFromAttributes(affects);
    return talentAffects + modsAffects + attributesAffects;
  }


  descriptorForType(itemType: ItemType) {
    return this._gearDescriptors.forType(itemType);
  }

  calculateAffectsValueFromTalents(affects: Affects) {
    return this._reduce((sum, gear) => {
      // resolve descriptor to get correct talents
      let descriptor = this.descriptorForType(gear.type);
      // filter out only the talents that can affect this value
      // and return only the ids for quick checking
      let talentsThatAffects = _.filter(
        descriptor.talents,
        {affects: [affects]}
      ).map(talent => talent.id);

      // no talents found that can affect this so return zero
      if (!talentsThatAffects.length) return sum;

      // gear only has one talent
      let talent = gear.talents[0];
      return sum + (_.includes(talentsThatAffects, talent.id) ? talent.value : 0);

    });
  }


  _attributesThatAffects(affects: Affects) {
    return _.filter(
      this._gearDescriptors.attributes,
      {affects: [affects]}
    ).map(attr => attr.id);
  }

  calculateAffectsValueFromMods(affects: Affects, limitToGear?: Gear) {
    let attributesThatAffects = this._attributesThatAffects(affects);
    if (!attributesThatAffects.length) return 0;
    return this._reduce((sum, gear) => {

      let mods = gear.mods;


      return sum + _.reduce(mods, (total, mod) => {

          let primary = mod.primary && _.includes(attributesThatAffects, mod.primary.id)
            ? mod.primary.value
            : 0;

          let secondary = mod.secondary && _.includes(attributesThatAffects, mod.secondary.id)
            ? mod.secondary.value
            : 0;

          return total + primary + secondary;

        }, 0);

    }, limitToGear);
  }

  calculateAffectsValueFromAttributes(affects: Affects) {
    let attributesThatAffects = this._attributesThatAffects(affects);
    if (!attributesThatAffects.length) return 0;


    return this._reduce((sum, gear) => {
      let attributes = _.flatten(_.values(gear.attributes));
      return sum + _.reduce(attributes, (total, attr) => {
          return total + (_.includes(attributesThatAffects, attr.id) ? +attr.value : 0);
        }, 0);
    });
  }


  _reduce(fn: (sum: number, gear: Gear) => number, limitToGear?: Gear) {

    let all = limitToGear ? [limitToGear] : <Gear[]>_.values(this._inventory.gear);
    return _.reduce(all, (sum, gear) => {
      return gear ? fn(sum, gear) : sum;
    }, 0);
  }


}


class WeaponStatsCalculator {


  constructor(private _weapon: Weapon,
              private _weaponDescriptors: WeaponDescriptorCollection,
              private _inventoryCalc: InventoryCalculator) {


  }


  get weaponDescriptor() {

    return this._weaponDescriptors.forType(this._weapon.type);

  }

  weaponInfo(descriptor?: WeaponDescriptor) {


    let items = <WeaponInfo[]>_.merge(..._.values(descriptor
      ? descriptor.items : this.weaponDescriptor.items));
    return _.find(items, {name: this._weapon.name});
  }

  get damage() {
    // https://www.reddit.com/r/thedivision/comments/4cfhr6/more_information_on_weapon_damage_math/
    // https://www.reddit.com/r/thedivision/comments/4auh6v/actual_formula_for_weapon_damage/
    let base = (
    this._weapon.stats.damage
    + this._flatDamageBonus() + this._scalingFactor()
    * this._inventoryCalc.firearms);

    let damagePercentage = 1 + this._weaponDamagePercent();
    return base * damagePercentage * this._otherWeaponDamageMultipliers();
  }


  get accuracy() {


    return this._weapon.type !== ItemType.Sniper
      ? this._accuracy() : this._sniperAccuracy();


  }

  _accuracy() {
    // ui_dictionary.mdict   WeaponAccuracyCompareUI
    let stats = this._weaponBaseStats;
    // (1/(1+Weapon.AimSpreadMin))*100 + (1/(1+Weapon.AimSpreadMax))*10
    // + (1/(1+Weapon.SpreadMax))*20 + WeaponSpreadSizeModBonus*40
    // + WeaponSpreadMaxModBonus*20 -40
    let base = (1 / (1 + stats.aimSpreadMin)) * 100
      + (1 / (1 + stats.aimSpreadMax)) * 10
      + (1 / (1 + stats.spreadMax));
    let spreadSizeModBonus = this.calculateAffectsValueFromMods(Affects.ACCURACY) * 40;
    let spreadMaxModBonus = this.calculateAffectsValueFromMods(Affects.HIP_ACCURACY) * 20;

    return base + spreadSizeModBonus + spreadMaxModBonus - 40;
  }

  _sniperAccuracy() {
    let stats = this._weaponBaseStats;
    // ((1/(1+(TimeToMinAccuracyMSFinal + TimeToMaxAccuracyMSFinal))) *200 + 0.6) 
    // * 60 + WeaponSpreadSizeModBonus*40 +20
    let base = ((1 / (1 + (stats.timeToMinAccuracy + stats.timeToMaxAccuracy))) * 200 + 0.6) * 60;
    let spreadSizeModBonus = this.calculateAffectsValueFromMods(Affects.ACCURACY) * 40;
    return base + spreadSizeModBonus + 20;
  }

  get _weaponBaseStats(): WeaponBaseStats {
    let descriptor = this.weaponDescriptor;
    let family = this.weaponInfo(descriptor).family;
    return this._weaponDescriptors.weaponStatsFor(descriptor, family);

  }

  _scalingFactor() {

    // https://www.reddit.com/r/thedivision/comments/4e0c7k/all_weapons_dmg_scaling_values/
    return this._weaponBaseStats.scaling;

  }

  _flatDamageBonus() {
    return this._inventoryCalc.weaponDamage(this._weapon.type);
  }

  _weaponDamagePercent() {
    return this
        .calculateAffectsValueFromMods(Affects.WEAPON_DAMAGE)
      + this._inventoryCalc
        .calculateTotalAffectsValue(Affects.WEAPON_DAMAGE);
  }

  _otherWeaponDamageMultipliers() {
    // https://www.reddit.com/r/thedivision/comments/4gica6/all_your_multipliers_are_belong_to_us/
    return 1;
  }

  calculateAffectsValueFromMods(affects: Affects) {
    let mods = this._weapon.mods;
    let attributes = _.filter(
      this._weaponDescriptors.attributes,
      {affects: [affects]}
    ).map(attr => attr.id);
    if (!attributes.length) return 0;
    return _.reduce(mods, (sum, mod) => {

      let primary = _.includes(attributes, mod.primary.id) ? mod.primary.value : 0;
      let secondary = _.includes(attributes, mod.secondary.id) ? mod.secondary.value : 0;
      return sum + primary + secondary;
    }, 0);
  }

}
