import {Component, Input} from '@angular/core';
import {Weapon} from '../inventory/inventory.model';
import {AutoResizeInputComponent} from '../auto-resize-input/auto-resize-input.component';
import {EditorService} from '../../services/editor-service';
import {BuildCalculatorService} from '../../services/build-calculator.service';


@Component({
  selector: 'weapon-stats',
  styles: [require('./weapon-stats.component.scss')],
  template: require('./weapon-stats.component.html'),
  directives: [AutoResizeInputComponent]

})
export class WeaponStatsComponent {

  @Input() weapon: Weapon;

  constructor(private _editorService: EditorService,
              private _buildCalculatorService: BuildCalculatorService) {
  }

  get _editing() {
    return this._editorService.state;
  }

  get damage() {
    return this._editing ? this.weapon.stats.damage
      : this._buildCalculatorService.caculateWeaponDamage(this.weapon);
  }

  get rpm() {
    return this._editing ? this.weapon.stats.rpm :
      this._buildCalculatorService.caculateWeaponRPM(this.weapon);

  }

  get magazine() {
    return this._editing ? this.weapon.stats.magazine :
      this._buildCalculatorService.caculateWeaponMagazine(this.weapon);

  }
}
