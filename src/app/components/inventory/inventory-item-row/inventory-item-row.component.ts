import {Component, Input} from '@angular/core';
import {Gear} from '../../gear-overview/gear.model';
import {PrettyNumberPipe} from '../../../common/pipes/prettynumber';
import {InventoryItemImageComponent} from '../inventory-item-image/inventory-item-image.component';
import {BuildCalculatorService} from '../../../services/build-calculator.service';
import {isWeaponType} from '../../../services/item.service';
import {InventoryItem, Weapon} from '../inventory.model';
import {InventoryService} from '../../../services/inventory.service';

@Component({
  selector: 'inventory-item-row',
  styles: [require('./inventory-item-row.component.scss')],
  template: require('./inventory-item-row.component.html'),
  pipes: [PrettyNumberPipe],
  directives: [InventoryItemImageComponent]

})
export class InventoryItemRowComponent {

  @Input() item: InventoryItem;

  constructor(private _buildCalculatorService: BuildCalculatorService,
              private _inventoryService: InventoryService) {

  }

  get weaponDps() {
    return this
      ._buildCalculatorService
      .caculateDps(<Weapon>this.item, this._inventoryService.inventory.gear);
  }

  get isGear() {
    return !this.isWeapon;
  }

  get isWeapon() {
    return isWeaponType(this.item.type);
  }

}
