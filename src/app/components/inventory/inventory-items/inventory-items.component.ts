/**
 * Created by Keyston on 4/26/2016.
 */


import {Component} from '@angular/core';
import {InventoryItemRowComponent} from '../inventory-item-row/inventory-item-row.component';
import {ItemOverviewComponent} from '../../item-overview/item-overview.component.ts';
import {RouteParams, Router} from '@angular/router-deprecated';
import {InventoryService} from '../../../services/inventory.service';
import {ItemType} from '../../../common/models/common';

@Component({
  selector: 'inventory-items',
  styles: [require('./inventory-items.component.scss')],
  template: require('./inventory-items.component.html'),
  directives: [InventoryItemRowComponent, ItemOverviewComponent]

})
export class InventoryItemsComponent {


  _itemType: ItemType;


  constructor(private _routeParams: RouteParams,
              private _inventoryService: InventoryService,
              private _router: Router) {

    this._itemType = <ItemType>_routeParams.get('itemType');

  }


  back() {
    this._router.navigate(['Inventory']);
  }

  get items() {

    let item = this._inventoryService.retrieve(this._itemType);


    return item ? [item] : [];
  }

  get activeItem() {

    let items = this.items;

    return items.length ? items[0] : void 0;
  }

  onModSlotChanged() {

  }
}
