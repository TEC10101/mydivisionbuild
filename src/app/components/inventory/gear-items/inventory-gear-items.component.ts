/**
 * Created by xastey on 4/26/2016.
 */


import {Component} from '@angular/core';
import {InventoryGearItemRowComponent} from '../gear-item-row/inventory-gear-item-row.component';
import {GearOverviewComponent} from '../../gear-overview/gear-overview.component';
import {RouteParams} from '@angular/router-deprecated';
import {InventoryService} from '../../../services/inventory.service';
import {GearType} from '../../../common/models/common';
@Component({
  selector: 'inventory-gear-items',
  styles: [require('./inventory-gear-items.component.scss')],
  template: require('./inventory-gear-items.component.html'),
  directives: [InventoryGearItemRowComponent, GearOverviewComponent]

})
export class InventoryGearItemsComponent {


  _gearType: GearType;


  constructor(private _routeParams: RouteParams,
              private _inventoryService: InventoryService) {

    this._gearType = <GearType>_routeParams.get('gearType');

  }

  get items() {

    let item = this._inventoryService.retrieve(this._gearType);
    console.log(this._gearType, item);

    return item ? [item] : [];
  }

  get activeItem() {

    let items = this.items;

    return items.length ? items[0] : void 0;
  }

  onModSlotChanged() {

  }
}
