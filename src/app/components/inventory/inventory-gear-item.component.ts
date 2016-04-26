/**
 * Created by xastey on 4/26/2016.
 */
import {Component, Input} from "angular2/core";
import {Gear} from "../gear-overview/gear.model";
import {ModSlotService} from "../../services/modslots.service";
import * as _ from "lodash";


@Component({
  selector: 'inventory-gear-item',
  styles: [require('./inventory-gear-item.component.scss')],
  templateUrl: 'app/components/inventory/inventory-gear-item.component.html'

})
export class InventoryGearItemComponent {


  @Input() item:Gear;

  constructor(private _modSlotService:ModSlotService) {

  }

  get slotRarities() {
    let slotTypes = this._modSlotService.types;

    return this.item.mods.map(m=> _.find(slotTypes, {id: m.id}).rarity)
  }

  hasStat(name) {
    return this.item.stats[name] > 0;
  }

  get statNames() {
    return ["firearms", "stamina", "electronics"];
  }
}
