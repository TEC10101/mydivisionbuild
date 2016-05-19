/**
 * Created by Keyston on 4/2/2016.
 */

import {Component, Input, Output, EventEmitter} from '@angular/core';
import {StatType, GearStats} from '../../common/models/common';
import {NgClass} from '@angular/common';
import {AutoResizeInputComponent} from '../auto-resize-input/auto-resize-input.component';
import {BuildStatsService, InventoryCalculator} from '../../services/build-stats.service';
import {AttributeMeta} from '../attributes/attribute.component';
import {EditorService} from '../../services/editor-service';


interface StateValueChangeEvent {
  type: StatType;
  value: number;
}

@Component({
  selector: 'single-stat-display',
  templateUrl: 'app/components/stats-display/single-stat-display.html',
  directives: [NgClass, AutoResizeInputComponent],
  styles: [require('./single-stat-display.scss')]

})
export class SingleStatDisplay {

  @Input() type: StatType;
  @Input() value: number;

  @Output() change = new EventEmitter<StateValueChangeEvent>();

  onStatValueChanged(value) {
    this.value = value;
    this.change.emit({
      type: this.type,
      value: this.value
    });
  }
}

@Component({
  selector: 'stats-display',
  templateUrl: 'app/components/stats-display/stats-display.html',
  directives: [SingleStatDisplay],
  styles: [require('./stats-display.component.scss')]

})
export class StatsDisplay {

  @Input() stats: GearStats;
  @Input('gear-metadata') metadata: AttributeMeta;
  _calc: InventoryCalculator;

  constructor(private _buildStatsService: BuildStatsService,
              private _editorService: EditorService) {

    this._calc = this._buildStatsService.create();
  }


  stat(name) {
    let editing = this._editorService.state;
    let stats = !editing ? this._calc.statsForGear(this.metadata.belongsTo) : this.stats;
    return !stats ? 0 : stats[name];
  }

  onStateValueChanged(event: StateValueChangeEvent) {
    this.stats[event.type] = event.value;
  }

}

