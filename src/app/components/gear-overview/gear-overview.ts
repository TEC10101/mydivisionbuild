/**
 * Created by Keyston on 4/2/2016.
 */

import {Component, Input} from "angular2/core"

import {UcFirstPipe} from "../../common/pipes/ucfirst_pipe";
import {StatsDisplay, Stats} from "../stats-display/stats-display";

import {Rarity} from "../../common/models/common";


export class Gear {
  rarity:Rarity;
  title:string;
  level:number;
  stats:Stats;
}


@Component({
  selector: 'gear-overview',
  pipes: [UcFirstPipe],
  // Set moduleId to current module so that all loading is done
  // relative

  templateUrl: 'app/components/gear-overview/gear-overview.html',
  directives: [StatsDisplay]
})
export class GearOverview {
  @Input() gear:Gear;

}
