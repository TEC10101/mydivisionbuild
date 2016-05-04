/**
 * Created by xastey on 4/26/2016.
 */
import {Component, Input} from '@angular/core';
import {Gear} from '../../gear-overview/gear.model';
import {ModSlotService} from '../../../services/modslots.service';
import * as _ from 'lodash';
import {ItemsService} from '../../../services/item.service';
import {GearRarity} from '../../../common/models/common';

@Component({
  selector: 'inventory-gear-item-image',
  styles: [require('./inventory-gear-item-image.component.scss')],
  template: require('./inventory-gear-item-image.component.html')

})
export class InventoryGearItemImageComponent {
  @Input() item: Gear;

  constructor(private _modSlotService: ModSlotService, private _itemService: ItemsService) {
  }

  get icon() {


    let style = {};
    return !this.item ? style :
      this._itemService
        .imageResolve(this.item).map(icon => {
        style['-webkit-mask-image'] = 'url('' + icon.primary + '')';
        return style;
      });


  }

  get belongsToSet() {
    return this.item && this.item.rarity === GearRarity.GEAR_SET;
  }

  get gearSetIcon() {


    let style = {};
    return !this.item ? style :
      this._itemService
        .imageResolve(this.item).map(icon => {
        style['-webkit-mask-image'] = 'url('' + icon.secondary + '')';
        return style;
      });


  }

  get slotRarities() {
    let slotTypes = this._modSlotService.types;
    return (!this.item || !this.item.mods)
      ? [] :
      this.item.mods.map(m => _.find(slotTypes, {id: m.id}).rarity);
  }
}
