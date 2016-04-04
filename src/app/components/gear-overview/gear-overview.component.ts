/**
 * Created by Keyston on 4/2/2016.
 */

import {Component, Input} from "angular2/core";
import {UcFirstPipe} from "../../common/pipes/ucfirst_pipe";
import {StatsDisplay} from "../stats-display/stats-display";
import {Gear} from "./gear.model";
import {AttributesComponent} from "../attributes/attributes.component";
import {PrettyNumberPipe} from "../../common/pipes/prettynumber";
import {Rarity, GearType} from "../../common/models/common";
import {AttributeMeta} from "../attributes/attribute.component";
export {Gear} from "./gear.model";


@Component({
  selector: 'gear-overview',
  pipes: [UcFirstPipe, PrettyNumberPipe],
  // Set moduleId to current module so that all loading is done
  // relative

  templateUrl: 'app/components/gear-overview/gear-overview.component.html',
  directives: [StatsDisplay, AttributesComponent]
})
export class GearOverviewComponent {
  @Input() gear:Gear;

  get metadata():AttributeMeta {
    return {
      level: this.gear.level,
      rarity: this.gear.rarity,
      belongsTo: this.gear.type

    }
  }


}
