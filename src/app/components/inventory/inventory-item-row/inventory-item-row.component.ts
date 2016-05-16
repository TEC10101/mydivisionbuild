import {Component, Input, OnInit} from '@angular/core';
import {Gear} from '../../item-overview/gear.model';
import {PrettyNumberPipe} from '../../../common/pipes/prettynumber';
import {InventoryItemImageComponent} from '../inventory-item-image/inventory-item-image.component';

import {isWeaponType} from '../../../services/item.service';
import {InventoryItem, Weapon} from '../inventory.model';
import {InventoryService} from '../../../services/inventory.service';
import {BuildStatsService, WeaponStatsCalculator} from '../../../services/build-stats.service';

@Component({
  selector: 'inventory-item-row',
  styles: [require('./inventory-item-row.component.scss')],
  template: require('./inventory-item-row.component.html'),
  pipes: [PrettyNumberPipe],
  directives: [InventoryItemImageComponent]

})
export class InventoryItemRowComponent implements OnInit {

  @Input() item: InventoryItem;
  _calc: WeaponStatsCalculator;

  constructor(private _buildStatsService: BuildStatsService,
              private _inventoryService: InventoryService) {

  }


  ngOnInit(): any {
    this._calc = this._buildStatsService
      .createForWeapon(<Weapon>this.item);
  }

  get weaponDps() {
    return this._calc.dps;
  }

  get isGear() {
    return !this.isWeapon;
  }

  get isWeapon() {
    return isWeaponType(this.item.type);
  }

}
