/**
 * Created by Keyston on 5/20/2016.
 */
import {
  Component

} from '@angular/core';
import {
  BuildStatsService, CharacterSheet,
  StatBreakdown, WeaponStatsCalculator
} from '../../../services/build-stats.service';
import {BLUEPRINT} from './blueprint';
import {ItemType, ValueFormat} from '../../../common/models/common';
import {isWeaponType, ItemsService} from '../../../services/item.service';
import {Affects} from '../../../common/models/affects';
import {Weapon} from '../inventory.model';
import * as _ from 'lodash/index';


interface SheetLine {
  title: string;
  format: ValueFormat;
  breakdown: StatBreakdown;
}
interface SheetLayout {
  header: string;
  lines: SheetLine[];
}

@Component({
  selector: 'inventory-details',
  template: require('./inventory-details.component.html'),
  styles: [require('./inventory-details.component.scss')]


})
export class InventoryDetailsComponent {

  sheet: CharacterSheet;

  _layouts: SheetLayout[];

  selectedWeapon: string = 'primary';

  constructor(private _buildStatsService: BuildStatsService,
              private _itemsService: ItemsService) {


  }

  get layouts() {
    return this._layouts ? this._layouts : this.computeLayouts();
  }

  computeLayouts() {
    let hasNoFormat = _.reduce([
      Affects.ASSAULT_RIFLE_DAMAGE,
      Affects.LMG_DAMAGE,
      Affects.MARKSMAN_RIFLE_DAMAGE,
      Affects.PISTOL_DAMAGE,
      Affects.SHOTGUN_DAMAGE,
      Affects.SMG_DAMAGE,
      Affects.HEALTH,
      Affects.STAMINA,
      Affects.ARMOR,
      Affects.SKILL_POWER,
      Affects.ELECTRONICS
    ], (acc, affects) => {
      acc[affects] = true;
      return acc;
    }, {});
    this._layouts = [];
    let sheet = this._buildStatsService.computeSheet();
    _.forEach(BLUEPRINT, (blueprint) => {

      this._layouts.push({
        header: blueprint.title,
        lines: _.map(blueprint.affects, (affects) => {
          return {
            title: Affects.toLabel(affects),
            format: hasNoFormat[affects] ? ValueFormat.NUMBER : ValueFormat.PERCENT,
            breakdown: sheet.retrieve(affects)
          };
        })
      });
    });
    return this._layouts;
  }

  get selectedWeaponIcon() {
    let weaponCalc = <WeaponStatsCalculator>this._buildStatsService
      .instance[this.selectedWeapon];
    let weapon = weaponCalc.weapon;
    return this.itemTypeIcon(weapon.type, weapon);
  }

  columns(breakdown: StatBreakdown) {
    let columns = [
      'primary',
      'mask',
      'bodyArmor',
      'kneePads',
      'backPack',
      'gloves',
      'holster'
    ];
    return _.map(columns, (column) => breakdown[column]);
  }

  itemTypeIcon(itemType: ItemType, weapon?: Weapon) {

    return this._itemsService
      .defaultItemTypeImage(itemType, weapon);
  }


}
