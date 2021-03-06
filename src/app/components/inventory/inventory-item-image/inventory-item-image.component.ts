/**
 * Created by Keyston on 4/26/2016.
 */
import {Component, Input} from '@angular/core';
import {Gear} from '../../item-overview/gear.model';
import {ModSlotService} from '../../../services/modslots.service';
import * as _ from 'lodash/index';
import {ItemsService} from '../../../services/item.service';
import {GearRarity} from '../../../common/models/common';

@Component({
  selector: 'inventory-item-image',
  styles: [require('./inventory-item-image.component.scss')],
  template: require('./inventory-item-image.component.html')

})
export class InventoryItemImageComponent {
  @Input() item: Gear;

  constructor(private _modSlotService: ModSlotService, private _itemService: ItemsService) {
  }

  get icon() {


    let style = {};
    return !this.item ? style :
      this._itemService
        .imageResolve(this.item).map(icon => {
        style['-webkit-mask-image'] = `url('${icon.primary}')`;
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
        style['-webkit-mask-image'] = `url('${icon.secondary}')`;
        return style;
      });


  }

  get modSlotsRarities() {
    let slotTypes = this._modSlotService.getTypes(this.item.type);
    return (!this.item || !this.item.mods)
      ? [] :
      this.item.mods.map(m => _.find(slotTypes, {id: m.id}).rarity);
  }
}
