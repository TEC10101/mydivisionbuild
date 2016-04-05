/**
 * Created by Keyston on 4/2/2016.
 */

import {Component, Input, OnInit} from "angular2/core";
import {UcFirstPipe} from "../../common/pipes/ucfirst_pipe";
import {StatsDisplay} from "../stats-display/stats-display";
import {Gear} from "./gear.model";
import {AttributesComponent} from "../attributes/attributes.component";
import {PrettyNumberPipe} from "../../common/pipes/prettynumber";
import {Rarity, DivisionItem, GearRarity} from "../../common/models/common";
import {AttributeMeta} from "../attributes/attribute.component";
import {ItemsService} from "../../services/item.service";
import {NgFor} from "angular2/common";
export {Gear} from "./gear.model";


@Component({
  selector: 'gear-overview',
  pipes: [UcFirstPipe, PrettyNumberPipe],
  // Set moduleId to current module so that all loading is done
  // relative

  styles: [require('./gear-overview.component.scss')],

  templateUrl: 'app/components/gear-overview/gear-overview.component.html',
  directives: [StatsDisplay, AttributesComponent, NgFor]
})
export class GearOverviewComponent implements OnInit {
  @Input() gear:Gear;
  private _itemService:ItemsService;

  items:DivisionItem[] = [];


  constructor(itemService:ItemsService) {
    this._itemService = itemService;
  }

  get rarities():Rarity[] {
    return [GearRarity.HIGH_END, GearRarity.SUPERIOR, GearRarity.SPECIALIZED];
  }

  ngOnInit() {
    this._itemService.getFor(this.gear.type).subscribe(data=> this.items = data)
  }

  get metadata():AttributeMeta {
    return {
      level: this.gear.level,
      rarity: this.gear.rarity,
      belongsTo: this.gear.type

    }
  }


}
