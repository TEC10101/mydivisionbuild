import {Input, OnInit, Component, NgZone} from '@angular/core';
import {GEAR_MOD_SLOT_TYPES, ModSlotType} from './modslots.model';
import {ModSlotService, ModSlotAttributeSet} from '../../services/modslots.service';
import {AttributeMeta} from '../attributes/attribute.component';
import {ModSlotComponent} from './modslot.component';
import {ItemModSlot} from '../inventory/inventory.model';
import {EditorDirective} from '../../directives/editor';
import {isWeaponType} from '../../services/item.service';
import {GearRarity} from '../../common/models/common';
import * as _ from 'lodash';

/**
 * Created by xastey on 4/10/2016.
 */


type ModAttributeSetByType = {[id: number]: ModSlotAttributeSet}
@Component({
  selector: 'modslots',
  templateUrl: 'app/components/modslots/modslots.component.html',
  styles: [require('./modslots.component.scss')],
  directives: [ModSlotComponent, EditorDirective]

})
export class ModSlotsComponent implements OnInit {

  @Input() slots: ItemModSlot[];

  @Input('gear-metadata') metadata: AttributeMeta;

  private _hasNative: boolean;
  private _canHaveExtra: number;

  private _defaultModSlotAttributeSet: ModSlotAttributeSet;

  constructor(private _modSlotService: ModSlotService, private _ngZone: NgZone) {
  }

  ngOnInit(): any {
    let itemType = this.metadata.belongsTo;

    this._hasNative = ModSlotService.hasNative(itemType);

    let canAddSlots = (this._hasNative || isWeaponType(itemType)) && this.slots.length < 1;
    if (canAddSlots) {
      this.onAddSlot();
    }
    this._canHaveExtra = ModSlotService.canHaveExtra(itemType);
  }


  get canAddSlot() {
    return this.slots.length < this._canHaveExtra + (this._hasNative ? 1 : 0 );
  }

  get canRemoveSlot() {
    return !!this.slots.length;
  }

  get canDisplayControls() {
    return this._hasNative || this._canHaveExtra > 0;
  }

  onAddSlot() {

    isWeaponType(this.metadata.belongsTo) ? this.onAddWeaponModSlot() : this.onAddGearModSlot();

  }

  onAddWeaponModSlot() {
    // check to see which ModSlotType's are acceptable for this weapon


    let modSlotTypes = this._modSlotService.getTypes(this.metadata.belongsTo);
    // filter to avoid duplicates
    modSlotTypes = _.filter(modSlotTypes, {rarity: GearRarity.SUPERIOR});
    let tree = [];
    let self = this;
    _.forEach(modSlotTypes, (modSlotType: ModSlotType, id) => {
      this._modSlotService.getAttributeSetFor(modSlotType)
        .subscribe(attributeSet => {
          console.log('onAddWeaponModSlot', modSlotType, attributeSet);
          tree.push([modSlotType, attributeSet]);

          if (tree.length === modSlotTypes.length) {
            _.forEach(tree, (branch: any[]) => {
              modSlotType = branch[0];
              attributeSet = branch[1];
              self._addSlot(modSlotType, attributeSet);

            });
          }
        });
    });

  }

  weaponModItemChoices() {
    if (!isWeaponType(this.metadata.belongsTo)) return void 0;
    let choices = {};

    let modSlotTypes = this._modSlotService.getTypes(this.metadata.belongsTo);
    _.forEach(this.slots, (slot: ItemModSlot, _) => {
      let modSlotType = _.find(modSlotTypes, {id: slot.id});
      choices[slot.id] = this._modSlotService.weaponModItemsFor(modSlotType);
    });
    return choices;
  }

  onAddGearModSlot() {
    let defaultModSlotType = this._modSlotService.getTypes(this.metadata.belongsTo)[0];
    if (this.canAddSlot)


      if (this._defaultModSlotAttributeSet) {
        this._addSlot(defaultModSlotType, this._defaultModSlotAttributeSet);
      } else {


        this._modSlotService.getAttributeSetFor(defaultModSlotType)
          .subscribe(attributeSet => {
            this._defaultModSlotAttributeSet = attributeSet;
            this._addSlot(defaultModSlotType, attributeSet);
          });
      }
  }

  onRemoveSlot() {
    this.slots.pop();
  }

  private _addSlot(modSlotType: ModSlotType, attributeSet: ModSlotAttributeSet) {
    let primary = attributeSet.primary[0];
    let secondary = attributeSet.secondary[0];
    if (secondary.id === primary.id) {
      secondary = attributeSet.secondary[1];
    }
    let slot = {
      id: modSlotType.id,

      primary: {
        id: primary.id,
        value: 0
      },
      secondary: {
        id: secondary.id,
        value: 0
      }
    }
    this.slots.push(slot);
    return slot;
  }


}
