/**
 * Created by xastey on 5/12/2016.
 */
import {Component, OnInit} from '@angular/core';
import {BuildStatsService, InventoryCalculator} from '../../services/build-stats.service';
import {InventoryService} from '../../services/inventory.service';
import {PrettyNumberPipe} from '../../common/pipes/prettynumber';


@Component({
  selector: 'build-stats-banner',
  template: require('./build-stats-banner.component.html'),
  styles: [require('./build-stats-banner.component.scss')],
  pipes: [PrettyNumberPipe]
})
export class BuildStatsBannerComponent implements OnInit {

  private _calc: InventoryCalculator;

  constructor(private _buildStatsService: BuildStatsService,
              private _inventoryService: InventoryService) {

  }

  ngOnInit(): any {
    this._calc = this._buildStatsService.create(
      this._inventoryService.inventory
    );
  }

  get dps() {
    return 0;
  }

  get firearms() {
    return this._calc.firearms;
  }

  get health() {
    return this._calc.health;
  }

  get stamina() {
    return this._calc.stamina;
  }

  get skillpower() {
    return this._calc.skillpower;
  }

  get electronics() {
    return this._calc.electronics;
  }
}
