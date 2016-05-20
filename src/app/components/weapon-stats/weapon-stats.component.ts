import {Component, Input, OnInit} from '@angular/core';
import {Weapon} from '../inventory/inventory.model';
import {AutoResizeInputComponent} from '../auto-resize-input/auto-resize-input.component';
import {EditorService} from '../../services/editor-service';
import {BuildStatsService, WeaponStatsCalculator} from '../../services/build-stats.service';


@Component({
  selector: 'weapon-stats',
  styles: [require('./weapon-stats.component.scss')],
  template: require('./weapon-stats.component.html'),
  directives: [AutoResizeInputComponent]

})
export class WeaponStatsComponent implements OnInit {

  @Input() weapon: Weapon;
  _calc: WeaponStatsCalculator;


  constructor(private _editorService: EditorService,
              private _buildStatsService: BuildStatsService) {


  }


  
  ngOnInit(): any {
    this._calc = this._buildStatsService
      .createForWeapon(this.weapon);
  }

  get _editing() {
    return this._editorService.state;
  }

  get damage() {
    return this._editing ? this.weapon.stats.damage
      : this._calc.damage;
  }

  get rpm() {
    return this._calc.rpm;

  }

  get magazine() {
    return this._calc.magazineSize;

  }
}
