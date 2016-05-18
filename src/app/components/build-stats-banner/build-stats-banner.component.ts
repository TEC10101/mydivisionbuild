/**
 * Created by Keyston on 5/12/2016.
 */
import {Component, OnInit} from '@angular/core';
import {BuildStatsService, InventoryCalculator} from '../../services/build-stats.service';
import {InventoryService} from '../../services/inventory.service';
import {PrettyNumberPipe} from '../../common/pipes/prettynumber';
import {Weapon} from '../inventory/inventory.model';
import {EditorService} from '../../services/editor-service';
import {AutoResizeInputComponent} from '../auto-resize-input/auto-resize-input.component';
import {EditorDirective} from '../../directives/editor';


@Component({
  selector: 'build-stats-banner',
  template: require('./build-stats-banner.component.html'),
  styles: [require('./build-stats-banner.component.scss')],
  pipes: [PrettyNumberPipe],
  directives: [AutoResizeInputComponent, EditorDirective]
})
export class BuildStatsBannerComponent {

  private _calc: InventoryCalculator;
  private _selectedWeapon: Weapon;

  constructor(private _editorService: EditorService,
              private _buildStatsService: BuildStatsService,
              private _inventoryService: InventoryService) {

    this._inventoryService.weaponSelected
      .subscribe(weapon => this._onWeaponSelected(weapon));
  }


  get dps() {
    return this._selectedWeapon
      ? this._calc.caculateDps(this._selectedWeapon)
      : 0;
  }

  get firearms() {
    return this._calc ? this._calc.firearms : 0;
  }

  get health() {
    return this._calc ? this._calc.health : 0;
  }

  get stamina() {
    return this._calc ? this._calc.stamina : 0;
  }

  get skillpower() {
    return this._calc ? this._calc.skillpower : 0;
  }

  get electronics() {
    return this._calc ? this._calc.electronics : 0;
  }

  _onWeaponSelected(weapon?: Weapon) {
    this._calc = this._buildStatsService
      .create(this._inventoryService.inventory);
    this._selectedWeapon = weapon;

  }

  save() {
    this._inventoryService.save();
  }

  reset() {
    this._inventoryService.reset();
  }

  get ownsInventory() {
    return this._inventoryService.owns();
  }

  get currentEditorState() {
    return this._editorService.state ? 'Editor On' : 'Editor Off';
  }

  onBuildNameChanged(name) {
    this.inventory.name = name;
  }

  onToggleEditor() {
    this._editorService.toggle();
  }

  get inventory() {
    return this._inventoryService.inventory;
  }

}
