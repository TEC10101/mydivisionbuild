import {ModSlotType} from './modslots.model';
import {Input, Component, OnInit, ElementRef} from '@angular/core';

import {ModSlotService, ModSlotAttributeSet, WeaponModItem} from '../../services/modslots.service';
import {EditorDirective} from '../../directives/editor';
import {AttributeObservable} from '../../services/attributes.service';
import {BehaviorSubject} from 'rxjs/Rx';
import {GearAttribute, DivisionAttribute} from '../../common/models/common';
import {asObservable} from '../../common/utils';
import {AttributeComponent, AttributeMeta} from '../attributes/attribute.component';
import {ItemModSlot} from '../inventory/inventory.model';
import {isWeaponType} from '../../services/item.service';
import * as _ from 'lodash/index';
/**
 * Created by Keyston on 4/10/2016.
 */


type SlotTypesById = {[id: string]: ModSlotType}
@Component({
  selector: 'modslot',
  templateUrl: 'app/components/modslots/modslot.component.html',
  styles: [require('./modslot.component.scss')],
  directives: [EditorDirective, AttributeComponent]

})
export class ModSlotComponent implements OnInit {

  @Input() slot: ItemModSlot;

  @Input('gear-metadata') metadata: AttributeMeta;
  slotTypes: ModSlotType[];


  weaponModItems: WeaponModItem[] = [];
  weaponModItemName: string;
  inheritPrimaryAttributeId: number = 0;
  private slotName: string;
  private _slotTypesById: SlotTypesById = {};
  private slotRarity: string;
  private _primaryAttributes = new BehaviorSubject<DivisionAttribute[]>([]);


  private _secondaryAttributes = new BehaviorSubject<DivisionAttribute[]>([]);
  private _selectedSlotType: ModSlotType;


  constructor(private _modSlotService: ModSlotService, private _el: ElementRef) {


  }


  get isWeapon() {
    return isWeaponType(this.metadata.belongsTo);
  }

  get isGear() {
    return !this.isWeapon;
  }


  onSlotTypeChanged() {

    // Cast selected id to a number due to bug with angular2 and select
    // http://stackoverflow.com/questions/35491608/how-to-get-number-in-ngmodel-in-angular-2
    this.slot.id = +this.slot.id;

    this._selectedSlotType = this._slotTypesById[this.slot.id];
    this.slotName = this._selectedSlotType.name;
    this.slotRarity = this._selectedSlotType.rarity;


    if (this.isWeapon)
      this._modSlotService
        .weaponModItemsFor(this._selectedSlotType).subscribe(weaponModItems => {
        this.weaponModItems = weaponModItems;
        if (!this.slot.itemId) this.slot.itemId = this.weaponModItems[0].id;
        this.onWeaponSlotItemChanged(this.slot.itemId);


      });

    this.refreshAttributeProviders();


  }


  get weaponSlotImage() {
    return this._selectedSlotType
      ? this._modSlotService.imageFor(this._selectedSlotType)
      : '';
  }

  onWeaponSlotItemChanged(itemId) {
    let weaponModItem = _.find(this.weaponModItems, {id: +itemId});
    this.weaponModItemName = weaponModItem.name;
    this.inheritPrimaryAttributeId = weaponModItem.inheritAttribute || 0;
  }


  /**
   *  Function that returns an Observable that allows the @link AttributeComponent to
   *  fetch the correct set of attributes to display for both primary and secondary
   * @param primary
   * @returns {Observable<GearAttribute[]>|Observable<R>}
   */
  getAttributesProvider(primary: boolean): AttributeObservable {


    return asObservable(primary ? this._primaryAttributes : this._secondaryAttributes);
  }

  ngOnInit(): any {


    this.slotTypes = this._modSlotService.getTypes(this.metadata.belongsTo);

    this.slotTypes.forEach(type => this._slotTypesById[type.id] = type);


    this.onSlotTypeChanged();
    // allow selecting of weapon mod rarity
    if (this.isWeapon) {
      let slotTypeId = this.slot.id;
      this.slotTypes = _.filter(this.slotTypes, {kind: this._selectedSlotType.kind});
    }
  }

  private refreshAttributeProviders() {

    this._modSlotService
      .getAttributeSetFor(this._selectedSlotType)
      .subscribe((attributeSet: ModSlotAttributeSet) => {

        this._primaryAttributes.next(attributeSet.primary);
        this._secondaryAttributes.next(attributeSet.secondary);
      });
  }


}
