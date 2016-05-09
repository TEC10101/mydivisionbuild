import {Component, Input} from '@angular/core';
import {Weapon} from '../inventory/inventory.model';
import {AutoResizeInputComponent} from '../auto-resize-input/auto-resize-input.component';
import {EditorService} from '../../services/editor-service';


@Component({
  selector: 'weapon-stats',
  styles: [require('./weapon-stats.component.scss')],
  template: require('./weapon-stats.component.html'),
  directives: [AutoResizeInputComponent]

})
export class WeaponStatsComponent {

  @Input() weapon: Weapon;

  constructor(private _editorService: EditorService) {
  }

  get _editing() {
    return this._editorService.state;
  }

  get damage() {
    return this._editing ? this.weapon.stats.damage
      : 0;
  }

  get rpm() {
    return this._editing ? this.weapon.stats.rpm :
      0;

  }

  get magazine() {
    return this._editing ? this.weapon.stats.magazine :
      0;

  }
}
