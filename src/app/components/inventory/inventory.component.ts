/**
 * Created by xastey on 4/22/2016.
 */
import {Component, Input} from "angular2/core";
import {Gear, DUMMY_GEAR} from "../gear-overview/gear.model";
import {ModSlotService} from "../../services/modslots.service";
import * as _ from "lodash";

@Component({

  selector: 'inventory',
  styles: [require('./inventory.component.scss')],
  templateUrl: 'app/components/inventory/inventory.component.html'
})
export class InventoryComponent {

  @Input() gear:Gear;

  constructor(private _modSlotService:ModSlotService) {
    this.gear = DUMMY_GEAR;
  }

  get slotRarities() {
    let slotTypes = this._modSlotService.types;
    let mods = [];//this.gear.mods;
    mods = [{
      id: 1
    }, {
      id: 5
    }];
    return mods.map(m=> _.find(slotTypes, {id: m.id}).rarity)
  }

  hasStat(name) {
    return this.gear.stats[name] > 0;
  }

  get statNames() {
    return ["firearms", "stamina", "electronics"];
  }
}
