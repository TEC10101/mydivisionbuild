/**
 * Created by xastey on 4/2/2016.
 */

import {Component, Input, Output, EventEmitter} from "angular2/core";
import {StatType, GearStats} from "../../common/models/common";
import {NgClass} from "angular2/common";
import {AutoResizeInputComponent} from "../auto-resize-input/auto-resize-input.component";


interface StateValueChangeEvent {
  type:StatType
  value:number;
}

@Component({
  selector: 'single-stat-display',
  templateUrl: 'app/components/stats-display/single-stat-display.html',
  directives: [NgClass, AutoResizeInputComponent],
  styles: [require("./single-stat-display.scss")]

})
export class SingleStatDisplay {

  @Input() type:StatType;
  @Input() value:number;

  @Output() change = new EventEmitter<StateValueChangeEvent>();

  onStatValueChanged(value) {
    this.value = value;
    this.change.emit({
      type: this.type,
      value: this.value
    })
  }
}

@Component({
  selector: 'stats-display',
  templateUrl: 'app/components/stats-display/stats-display.html',
  directives: [SingleStatDisplay],
  styles: [`
    single-stat-display {
      width: calc(33.33333% - 3px);
    }
`]

})
export class StatsDisplay {

  @Input() stats:GearStats;

  onStateValueChanged(event:StateValueChangeEvent) {

    console.log("onStateValueChanged", event);
    this.stats[event.type] = event.value;
  }

}

