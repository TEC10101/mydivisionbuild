/**
 * Created by Keyston on 4/2/2016.
 */

import {Component, Input, OnInit} from '@angular/core';
import {UcFirstPipe} from '../../common/pipes/ucfirst_pipe';
import {StatsDisplay} from '../stats-display/stats-display';
import {Gear} from './gear.model';
import {AttributesComponent} from '../attributes/attributes.component';
import {PrettyNumberPipe} from '../../common/pipes/prettynumber';
import {Rarity, GearRarity, DivisionItem, ItemType} from '../../common/models/common';
import {AttributeMeta} from '../attributes/attribute.component';
import {ItemsService, ItemDescriptor, isWeaponType} from '../../services/item.service';
import {NgFor} from '@angular/common';
import {EditorDirective} from '../../directives/editor';
import {AutoResizeInputComponent} from '../auto-resize-input/auto-resize-input.component';
import {ModSlotsComponent} from '../modslots/modslots.component';
import {TalentsComponent} from '../talents/talents.component';
import {InventoryItem, Weapon} from '../inventory/inventory.model';
import {WeaponStatsComponent} from '../weapon-stats/weapon-stats.component';
import * as _ from 'lodash/index';
export {Gear} from './gear.model';


@Component({
  selector: 'item-overview',
  pipes: [UcFirstPipe, PrettyNumberPipe],
  // Set moduleId to current module so that all loading is done
  // relative

  styles: [require('./item-overview.component.scss')],

  template: require('./item-overview.component.html'),
  directives: [StatsDisplay, AttributesComponent, NgFor,
    EditorDirective, AutoResizeInputComponent, ModSlotsComponent,
    TalentsComponent, WeaponStatsComponent]
})
export class ItemOverviewComponent implements OnInit {
  @Input() item: InventoryItem;

  descriptor: ItemDescriptor;

  weaponTypeNames: any;

  selectedItemType: ItemType;


  constructor(private _itemService: ItemsService) {

  }

  get rarities(): Rarity[] {
    return this._itemService.rarities;
  }

  ngOnInit() {

    this.selectedItemType = this.item.type;
    this._updateDescriptor();

    this._ensureWeaponBonus();
    this.weaponTypeNames = [];
    return _.forEach(this._itemService.weaponTypeNames, (v, k) =>
      this.weaponTypeNames.push({
        value: k,
        label: v
      }));
  }

  /**
   * Update the {@link ItemDescriptor} for a giving {@link ItemType}
   * @param itemType
   * @private
   */
  _updateDescriptor(itemType?: ItemType) {
    itemType = itemType || this.selectedItemType;
    this._itemService
      .getDescriptorFor(itemType)

      .subscribe(descriptor => this._commitChanges(descriptor, itemType));

  }

  /**
   * Finalize model changes, this is done so that we apply
   * the itemType change at its last possible state so that
   * all other values that are neede (name,rarity) have been
   * set correctly for other method usage
   * @param descriptor
   * @param itemType
   * @private
   */
  _commitChanges(descriptor: ItemDescriptor, itemType: ItemType) {


    this.descriptor = descriptor;
    if (this.item.type !== itemType) {
      let item = descriptor.items[this.item.rarity][0];
      if (!item) {
        this.item.rarity = GearRarity.SUPERIOR;
        item = descriptor.items[this.item.rarity][0];
      }
      this.item.name = item.name;
    }
    this.selectedItemType = this.item.type = itemType;
    this._ensureWeaponBonus();
  }

  /**
   * Checks or adds weapon bonus data
   * @private
   */
  _ensureWeaponBonus() {
    if (this.isWeapon) {
      let weapon = <Weapon>this.item;
      if (this.weaponHasBonus) {
        if (!weapon.stats.bonus) {
          weapon.stats.bonus = this._itemService
            .defaultWeaponBonusFor(weapon.type);
        }
      } else {
        weapon.stats.bonus = void 0;
      }

    }
  }

  get items(): DivisionItem[] {

    return this.descriptor ? this.descriptor.items[this.item.rarity] : [];

  }

  get talentChoices() {
    return this.descriptor ? this.descriptor.talents : [];
  }

  get talents() {
    return this.item.talents;

  }

  get isHighEnd() {
    return this.item.rarity === GearRarity.HIGH_END;
  }

  get isGear() {
    return this.item && !this.isWeapon;
  }

  get isWeapon() {
    return isWeaponType(this.item.type);
  }

  get talentsHaveImage() {
    return this.isWeapon;
  }

  onRarityChanged(rarity) {
    // reset gear info when rarity changes
    this.item.name = this.items[0].name;
    this.item.score = this._itemService.scores[rarity][0];
    if (this.isGear) {

      if (this.isHighEnd) {
        this.item.talents = [{id: this.talentChoices[0].id}];
      } else {
        this.item.talents = [];
      }
    }

  }


  onWeaponStatsChanged(statName, value) {
    (<Weapon>this.item).stats[statName] = value;
  }

  onWeaponBonusChanged(value) {
    (<Weapon>this.item).stats.bonus.value = value;
  }

  onWeaponTypeChanged(itemType: ItemType) {

    this._updateDescriptor(itemType);
  }


  get weaponHasBonus() {
    let type = this.item.type;
    return type === ItemType.SMG || type === ItemType.Sniper;
  }

  get weaponBonusText() {
    return this.item.type === ItemType.SMG
      ? 'Critical Hit Chance'
      : 'Headshot Damage';
  }

  get scores() {
    return this._itemService.scores[this.item.rarity];
  }

  onArmorValueChanged(value) {
    (<Gear>this.item).armor = value;
  }

  onGearScoreChanged(score) {

  }

  get metadata(): AttributeMeta {
    // weaponFamily: _.find(this.items, {name: this.item.name}).family
    return {
      level: this.item.score,
      rarity: this.item.rarity,
      belongsTo: this.item.type
    };
  }


}
