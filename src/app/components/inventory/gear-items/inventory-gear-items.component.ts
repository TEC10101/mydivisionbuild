/**
 * Created by xastey on 4/26/2016.
 */


import {Component, Input} from "angular2/core";
import {Gear} from "../../gear-overview/gear.model";
@Component({
  selector: 'inventory-gear-items',
  styles: [require('./inventory-gear-items.component.scss')],
  template: '<div>Inventory gear items component</div>'

})
export class InventoryGearItemsComponent {

  @Input() items:Gear[];
}
