/**
 * Created by xastey on 4/26/2016.
 */
import {Component, Input} from "angular2/core";
import {Gear} from "../../gear-overview/gear.model";
import {InventoryGearItemImageComponent} from "../gear-item-image/inventory-gear-item-image.component";


@Component({
  selector: 'inventory-gear-item',
  styles: [require('./inventory-gear-item.component.scss')],
  template: require('./inventory-gear-item.component.html'),
  directives: [InventoryGearItemImageComponent]

})
export class InventoryGearItemComponent {


  @Input() item:Gear;


  hasStat(name) {
    return this.item.stats[name] > 0;
  }

  get statNames() {
    return ["firearms", "stamina", "electronics"];
  }
}
