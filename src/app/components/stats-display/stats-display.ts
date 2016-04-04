/**
 * Created by xastey on 4/2/2016.
 */

import {Component, Input} from 'angular2/core';
import {StatType} from "../../common/models/common";
import {NgClass} from "angular2/common";


export class Stats {
  firearms:number;
  stamina:number;
  electronics:number;
}

@Component({
  selector: 'single-stat-display',
  templateUrl: 'app/components/stats-display/single-stat-display.html',
  directives: [NgClass],
})
export class SingleStatDisplay {

  @Input() type:StatType;
  @Input() value:number;
}

@Component({
  selector: 'stats-display',
  templateUrl: 'app/components/stats-display/stats-display.html',
  directives: [SingleStatDisplay]
})
export class StatsDisplay {

  @Input() stats:Stats;

}

