import {Component, Input} from "@angular/core";
import {Gear} from "../../gear-overview/gear.model";
import {PrettyNumberPipe} from "../../../common/pipes/prettynumber";
import {InventoryGearItemImageComponent} from "../gear-item-image/inventory-gear-item-image.component";

@Component({
  selector: 'inventory-gear-item-row',
  styles: [require('./inventory-gear-item-row.component.scss')],
  template: require('./inventory-gear-item-row.component.html'),
  pipes: [PrettyNumberPipe],
  directives: [InventoryGearItemImageComponent]

})
export class InventoryGearItemRowComponent {

  @Input() item:Gear;

}
