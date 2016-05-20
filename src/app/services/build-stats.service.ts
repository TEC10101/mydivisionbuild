/**
 * Created by Keyston on 5/7/2016.
 */


import {Injectable, Inject, forwardRef} from '@angular/core';
import {Inventory, Weapon, InventoryGear} from '../components/inventory/inventory.model';
import {ItemType, GearStats} from '../common/models/common';
import {Affects} from '../common/models/affects';
import {
  WeaponDescriptor,
  WeaponInfo,
  WeaponDescriptorCollection,
  ItemsService,
  GearDescriptorCollection,
  WeaponBaseStats
} from './item.service';
import {Gear} from '../components/item-overview/gear.model';
import * as _ from 'lodash/index';
import {InventoryService} from './inventory.service';
import {Attribute} from '../components/attributes/attributes.model';
import {dashCaseToCamelCase} from '@angular/compiler/src/util';
@Injectable()
export class BuildStatsService {

  _defaultInstance: InventoryCalculator;

  constructor(private _itemsService: ItemsService,
              @Inject(forwardRef(() => InventoryService))
              private _inventoryService: InventoryService) {


  }

  get instance() {
    return !this._defaultInstance ? this._defaultInstance = this.create()
      : this._defaultInstance;

  }


  create(inventory?: Inventory, primary?: Weapon, secondary?: Weapon) {

    let gearDescriptors = this._itemsService._gearDescriptors;
    let weaponDescriptors = this._itemsService._weaponDescriptors;
    inventory = inventory ? inventory : this._inventoryService.inventory;
    primary = primary || inventory.weapons.primary;
    secondary = secondary || inventory.weapons.secondary;
    return new InventoryCalculator(
      inventory, weaponDescriptors,
      gearDescriptors, primary, secondary);
  }

  createForWeapon(weapon: Weapon, inventory?: Inventory) {
    return this.create(inventory, weapon).primary;
  }

  computeSheet() {

    let gearNames = _.map(this._itemsService.gearTypes, dashCaseToCamelCase);
    let sheet = new CharacterSheet();
    let calc = this._defaultInstance;
    let gearItems = this._inventoryService.inventory.gear;
    let weapons = this._inventoryService.inventory.weapons;
    _.forEach(Affects, (affects: Affects) => {
      let breakdown = new StatBreakdown();
      let sumFromGear = _.sumBy(gearNames, (name) => {
        return breakdown[name] = calc.calculateTotalAffectsValue(affects);
      });
      breakdown.primary = calc.primary.calculateTotalAffectsValue(affects);
      breakdown.secondary = calc.secondary.calculateTotalAffectsValue(affects);

      sheet.add(affects, breakdown);

    });
    return sheet;
  }

}
export class CharacterSheet {

  _info: {[id: string]: StatBreakdown};

  add(key: Affects, breakdown) {
    this._info[key] = breakdown;
  }

  retrieve(key: Affects): StatBreakdown {
    return this._info[key];
  }
}

class StatBreakdown {
  primary: number;
  secondary: number;
  pistol: number;
  bodyArmor: number;
  mask: number;
  kneePads: number;
  gloves: number;
  holster: number;

}


export class InventoryCalculator {


  private _primary: WeaponStatsCalculator;
  private _secondary: WeaponStatsCalculator;

  constructor(private _inventory: Inventory,
              weaponDescriptors: WeaponDescriptorCollection,
              private _gearDescriptors: GearDescriptorCollection,
              private _primaryWeapon: Weapon, private _secondaryWeapon: Weapon) {


    this._primary = new WeaponStatsCalculator(_primaryWeapon, weaponDescriptors, this);
    this._secondary = new WeaponStatsCalculator(_secondaryWeapon, weaponDescriptors, this);
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
    let base = 535; // base at lvl 30
    let fromGear = this._reduce((sum, gear) => sum + gear.stats.firearms);
    let fireArmsFromMods = this.calculateAffectsValueFromMods(Affects.FIREARMS);
    return base + fromGear + fireArmsFromMods;
  }

  get stamina() {
    let base = 535; // base at lvl 30
    let fromGear = this._reduce((sum, gear) => sum + gear.stats.stamina);
    let fromMods = this.calculateAffectsValueFromMods(Affects.STAMINA);
    return base + fromGear + fromMods;
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


  calculateTotalAffectsValue(affects: Affects, limitToGear?: Gear) {
    let talentAffects = this.calculateAffectsValueFromTalents(affects, limitToGear);
    let modsAffects = this.calculateAffectsValueFromMods(affects, limitToGear);
    let attributesAffects = this.calculateAffectsValueFromAttributes(affects, limitToGear);
    let nativeValue = 0;
    switch (affects) {
      case Affects.FIREARMS:
      case Affects.STAMINA:
      case Affects.ELECTRONICS:

        nativeValue = 535;
        break;
      case Affects.CRIT_HIT_DAMAGE:
        nativeValue = 25;
        break;
      default:
        nativeValue = 0;
    }

    return talentAffects + modsAffects + attributesAffects;
  }


  descriptorForType(itemType: ItemType) {
    return this._gearDescriptors.forType(itemType);
  }

  calculateAffectsValueFromTalents(affects: Affects, limitToGear?: Gear) {
    return this._reduce((sum, gear) => {

      if (!gear.talents.length) return sum;
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
      return sum + ( _.includes(talentsThatAffects, talent.id) ? talent.value : 0);

    }, limitToGear);
  }


  _attributesThatAffects(affects: Affects): number[] {
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

  calculateAffectsValueFromAttributes(affects: Affects, limitToGear?: Gear) {
    let attributesThatAffects = this._attributesThatAffects(affects);
    if (!attributesThatAffects.length) return 0;


    return this._reduce((sum, gear) => {
      let attributes = <Attribute[]>_.flatten(_.values(gear.attributes));
      return sum + _.reduce(attributes, (total, attr) => {
          return total + (_.includes(attributesThatAffects, attr.id) ? +attr.value : 0);
        }, 0);
    }, limitToGear);
  }


  _reduce(fn: (sum: number, gear: Gear) => number, limitToGear?: Gear) {

    let all = limitToGear ? [limitToGear] : <Gear[]>_.values(this._inventory.gear);
    return _.reduce(all, (sum, gear) => {
      return gear ? fn(sum, gear) : sum;
    }, 0);
  }


  caculateDps(weapon: Weapon) {
    let calc = weapon === this._secondaryWeapon
      ? this._secondary : this._primary;

    return calc.dps;
  }

  gearStatsFor(itemType: ItemType): GearStats {
    let gear = this._inventory.gear[dashCaseToCamelCase(itemType)];
    let base = gear.stats;

    return {
      firearms: base.firearms
      + this.calculateAffectsValueFromMods(Affects.FIREARMS, gear),
      stamina: base.stamina
      + this.calculateAffectsValueFromMods(Affects.STAMINA, gear),
      electronics: base.electronics
      + this.calculateAffectsValueFromMods(Affects.ELECTRONICS, gear)
    };

  }
}


export class WeaponStatsCalculator {


  constructor(private _weapon: Weapon,
              private _weaponDescriptors: WeaponDescriptorCollection,
              private _inventoryCalc: InventoryCalculator) {


  }


  get dps() {

    // https://docs.google.com/spreadsheets/d/1lOh5fD3l1xhh1NE8HG0iQfY-d2Q_3-Yi9euvx_MH4Lg/edit#gid=522138074
    let rpm = this.rpm;

    let reloadSpeed = this.reloadSpeed; // C18

    let magazineSize = this.magazineSize; // C19


    let damagePerBullet = this.damage;  // C12
    let accuracy = this.accuracy / 100;   // C13
    let critChanceFromGear = this._inventoryCalc
      .calculateTotalAffectsValue(Affects.CRIT_HIT_CHANCE);
    let critChanceFromWeaponMods = this
      .calculateAffectsValueFromMods(Affects.CRIT_HIT_CHANCE);

    let critChanceFromWeaponTalents = this
      .calculateAffectsFromWeaponTalents(Affects.CRIT_HIT_CHANCE);
    let inheritedWeaponCritChance = this.calculateAffectsFromWeaponBonus(Affects.CRIT_HIT_CHANCE);
    let critChance = (inheritedWeaponCritChance + critChanceFromGear
      + critChanceFromWeaponTalents + critChanceFromWeaponMods)
      / 100; // C15
    critChance = 0.235;

    let critDamageFromGear = this._inventoryCalc
      .calculateTotalAffectsValue(Affects.CRIT_HIT_DAMAGE);
    let critDamageFromWeaponMods = this.calculateAffectsValueFromMods(Affects.CRIT_HIT_DAMAGE);
    let critDamageFromWeaponTalents = this
      .calculateAffectsFromWeaponTalents(Affects.CRIT_HIT_DAMAGE);
    let critDamage = (critDamageFromGear + critDamageFromWeaponMods
      + critDamageFromWeaponTalents) / 100; // C16


    let headShotBonus = this
        .calculateAffectsValueFromMods(Affects.ASSAULT_RIFLE_DAMAGE) / 100; // C14
    let damagePerHeadShot = damagePerBullet * headShotBonus; // F15

    let nonHeadShotBullets = magazineSize * (1 - accuracy);  // F20
    let headShotBullets = magazineSize * accuracy; // F21

    let oneIsNoneExtraBullets = 0; // F22

    let adjustedMagSize = magazineSize + oneIsNoneExtraBullets;  // F23
    let adjustedNonHeadShotBullets = nonHeadShotBullets + (oneIsNoneExtraBullets * (1 - accuracy)); // F24
    let adjustedHeadShotBullets = headShotBullets + (oneIsNoneExtraBullets * accuracy); // F25

    // Crit
    // let critNonHeadShotDamage = damagePerBullet * (1 + critDamage); // F29
    // let critHeadShotDamage = damagePerHeadShot + (1 + critDamage); // F30
    // let nonHeadShotCritChance = adjustedNonHeadShotBullets * critChance; // F31
    // let headShotCritChance = adjustedHeadShotBullets * critChance; // F32

    // DPS Breakdown
    let totalDamage = (adjustedMagSize * (1 - critChance) * (1 - accuracy)) * damagePerBullet;
    let totalHeadShotDamage = (adjustedMagSize * accuracy
      - (adjustedMagSize * critChance * accuracy))
      * (damagePerBullet * headShotBonus);
    let totalCritDamage = (adjustedMagSize * (critChance * (1 - accuracy)))
      * (damagePerBullet * (1 + critDamage));
    let critHeadShotDamage = (adjustedMagSize * accuracy * critChance)
      * (damagePerBullet * headShotBonus * (1 + critDamage));

    let cycleTime = adjustedMagSize / (rpm / 60) + reloadSpeed;

    let finalDPS = (totalDamage + totalHeadShotDamage + totalCritDamage + critHeadShotDamage)
      / cycleTime;


    return Math.floor(finalDPS);


  }


  get reloadSpeed() {
    let stats = this._weaponBaseStats;
    let base = stats.reloadEmpty / 1000;
    return (base * (this.calculateAffectsValueFromMods(Affects.RELOAD) / 100)) + base;
  }

  get rpm() {
    let stats = this._weaponBaseStats;
    let rpm = (stats.rpm * (this.calculateAffectsValueFromMods(Affects.RPM) / 100)) + stats.rpm;
    return Math.floor(rpm);
  }

  get magazineSize() {
    let stats = this._weaponBaseStats;
    let magazineSize = (stats.magazine
      * (this.calculateAffectsValueFromMods(Affects.MAGAZINE_SIZE) / 100)) + stats.magazine;

    return Math.floor(magazineSize);
  }

  get weaponDescriptor() {

    return this._weaponDescriptors.forType(this._weapon.type);

  }

  weaponInfo(descriptor?: WeaponDescriptor) {


    let items = <WeaponInfo[]>_.merge([], ..._.values(descriptor
      ? descriptor.items : this.weaponDescriptor.items));
    return _.find(items, {name: this._weapon.name});
  }

  get damage() {

    // https://www.reddit.com/r/thedivision/comments/4cfhr6/more_information_on_weapon_damage_math/
    // https://www.reddit.com/r/thedivision/comments/4auh6v/actual_formula_for_weapon_damage/
    let base = (
    this._weapon.stats.damage
    + this._flatDamageBonus + this._scalingFactor
    * this._inventoryCalc.firearms);

    let damagePercentage = (1 + this._weaponDamagePercent()) / 100;
    return base * damagePercentage * this._otherWeaponDamageMultipliers();
  }


  get accuracy() {


    return this._weapon.type !== ItemType.Marksman
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

  get _scalingFactor() {

    // https://www.reddit.com/r/thedivision/comments/4e0c7k/all_weapons_dmg_scaling_values/
    return this._weaponBaseStats.scaling;

  }

  get _flatDamageBonus() {
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

  calculateAffectsFromWeaponBonus(affects: Affects) {
    let bonus = this._weapon.stats.bonus;
    return bonus && bonus.affects === affects ? bonus.value : 0;
  }

  calculateAffectsFromWeaponTalents(affects: Affects) {
    let talentsThatAffects = this._attributesThatAffects(affects);
    if (!talentsThatAffects.length) return 0;
    let talents = _.filter(this._weapon.talents, {unlocked: true});
    return _.reduce(talents,
      (sum, talent) => sum + (_.includes(talentsThatAffects, talent.id)
        ? talent.value : 0), 0);
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

  calculateTotalAffectsValue(affects: Affects) {
    let fromTalents = this.calculateAffectsFromWeaponTalents(affects);
    let fromMods = this.calculateAffectsValueFromMods(affects);
    return fromTalents + fromMods;
  }

  _attributesThatAffects(affects: Affects): string[] {
    return _.filter(
      this.weaponDescriptor.talents,
      {affects: [affects]}
    ).map(attr => attr.id);
  }


}
