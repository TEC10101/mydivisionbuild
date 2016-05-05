/**
 * Created by Keyston on 4/2/2016.
 */

import {Component, Input, OnInit} from '@angular/core';
import {UcFirstPipe} from '../../common/pipes/ucfirst_pipe';
import {StatsDisplay} from '../stats-display/stats-display';
import {Gear} from './gear.model';
import {AttributesComponent} from '../attributes/attributes.component';
import {PrettyNumberPipe} from '../../common/pipes/prettynumber';
import {Rarity, GearRarity} from '../../common/models/common';
import {AttributeMeta} from '../attributes/attribute.component';
import {ItemsService, GearDescriptor, isWeaponType} from '../../services/item.service';
import {NgFor} from '@angular/common';
import {EditorDirective} from '../../directives/editor';
import {AutoResizeInputComponent} from '../auto-resize-input/auto-resize-input.component';
import {ModSlotsComponent} from '../modslots/modslots.component';
import {TalentsComponent} from '../talents/talents.component';
import {InventoryItem} from '../inventory/inventory.model';
export {Gear} from './gear.model';


@Component({
  selector: 'gear-overview',
  pipes: [UcFirstPipe, PrettyNumberPipe],
  // Set moduleId to current module so that all loading is done
  // relative

  styles: [require('./gear-overview.component.scss')],

  template: require('./gear-overview.component.html'),
  directives: [StatsDisplay, AttributesComponent, NgFor,
    EditorDirective, AutoResizeInputComponent, ModSlotsComponent, TalentsComponent]
})
export class GearOverviewComponent implements OnInit {
  @Input() item: InventoryItem;

  descriptor: GearDescriptor;


  constructor(private _itemService: ItemsService) {

  }

  get rarities(): Rarity[] {
    return this._itemService.rarities;
  }

  ngOnInit() {
    this._itemService
      .getDescriptorFor(this.item.type)
      .subscribe(descriptor => this.descriptor = descriptor);
  }

  get items() {

    return this.descriptor ? this.descriptor.items[this.item.rarity] : [];

  }

  get talentChoices() {
    return this.descriptor ? this.descriptor.talents : [];
  }

  get talents() {
    return this.item.talents;

  }

  get isHighEnd() {
    return this.item.rarity === GearRarity.HIGH_END;
  }

  get isGear() {
    return !this.isWeapon;
  }

  get isWeapon() {
    return isWeaponType(this.item.type);
  }

  onRarityChanged(rarity) {
    // reset gear info when rarity changes
    this.item.name = this.items[0].name;
    this.item.score = this._itemService.scores[rarity][0];
    if (this.isGear) {

      if (this.isHighEnd) {
        this.item.talents = [{id: this.talentChoices[0].id}];
      } else {
        this.item.talents = [];
      }
    }

  }


  get scores() {
    return this._itemService.scores[this.item.rarity];
  }

  onArmorValueChanged(value) {
    (<Gear>this.item).armor = value;
  }

  onGearScoreChanged(score) {

  }

  get metadata(): AttributeMeta {
    return {
      level: this.item.score,
      rarity: this.item.rarity,
      belongsTo: this.item.type

    };
  }


}
