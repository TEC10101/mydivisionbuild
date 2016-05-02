/**
 * Created by xastey on 4/26/2016.
 */


import {Component, Input} from "angular2/core";
import {Gear, DUMMY_GEAR} from "../../gear-overview/gear.model";
import {InventoryGearItemRowComponent} from "../gear-item-row/inventory-gear-item-row.component";
import {GearOverviewComponent} from "../../gear-overview/gear-overview.component";
@Component({
  selector: 'inventory-gear-items',
  styles: [require('./inventory-gear-items.component.scss')],
  template: require('./inventory-gear-items.component.html'),
  directives: [InventoryGearItemRowComponent, GearOverviewComponent]

})
export class InventoryGearItemsComponent {

  @Input() items:Gear[];

  constructor() {
    this.items = [DUMMY_GEAR];
  }

  get activeItem() {
    return this.items[0];
  }

  onModSlotChanged() {
    console.log("modSlotChanged");
  }
}