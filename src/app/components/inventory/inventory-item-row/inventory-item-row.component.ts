import {Component, Input} from '@angular/core';
import {Gear} from '../../gear-overview/gear.model';
import {PrettyNumberPipe} from '../../../common/pipes/prettynumber';
import {InventoryItemImageComponent} from '../inventory-item-image/inventory-item-image.component';

@Component({
  selector: 'inventory-item-row',
  styles: [require('./inventory-item-row.component.scss')],
  template: require('./inventory-item-row.component.html'),
  pipes: [PrettyNumberPipe],
  directives: [InventoryItemImageComponent]

})
export class InventoryItemRowComponent {

  @Input() item: Gear;

}
