/**
 * Created by Keyston on 4/2/2016.
 */

import {Component, Input, OnInit} from "@angular/core";
import {UcFirstPipe} from "../../common/pipes/ucfirst_pipe";
import {StatsDisplay} from "../stats-display/stats-display";
import {Gear} from "./gear.model";
import {AttributesComponent} from "../attributes/attributes.component";
import {PrettyNumberPipe} from "../../common/pipes/prettynumber";
import {Rarity, GearRarity} from "../../common/models/common";
import {AttributeMeta} from "../attributes/attribute.component";
import {ItemsService, GearDescriptor} from "../../services/item.service";
import {NgFor} from "@angular/common";
import {EditorDirective} from "../../directives/editor";
import {AutoResizeInputComponent} from "../auto-resize-input/auto-resize-input.component";
import {ModSlotsComponent} from "../modslots/modslots.component";
import {TalentsComponent} from "../talents/talents.component";
export {Gear} from "./gear.model";


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
  @Input() gear:Gear;

  descriptor:GearDescriptor;


  constructor(private _itemService:ItemsService) {

  }

  get rarities():Rarity[] {
    return this._itemService.rarities;
  }

  ngOnInit() {
    this._itemService.getDescriptorFor(this.gear.type).subscribe(descriptor=> this.descriptor = descriptor)
  }

  get items() {

    return this.descriptor ? this.descriptor.items[this.gear.rarity] : [];

  }

  get talentChoices() {
    return this.descriptor ? this.descriptor.talents : [];
  }

  get talents() {

    return [this.gear.talent = !this.gear.talent ? {id: this.talentChoices[0].id} : this.gear.talent];
  }

  get isHighEnd() {
    return this.gear.rarity == GearRarity.HIGH_END;
  }

  onRarityChanged(rarity) {
    // reset gear info when rarity changes
    this.gear.name = this.items[0].name;
    this.gear.score = this._itemService.scores[rarity][0];
  }


  get scores() {
    return this._itemService.scores[this.gear.rarity];
  }

  onArmorValueChanged(value) {
    this.gear.armor = value;
  }
  onGearScoreChanged(score){

  }

  get metadata():AttributeMeta {
    return {
      level: this.gear.score,
      rarity: this.gear.rarity,
      belongsTo: this.gear.type

    }
  }


}
