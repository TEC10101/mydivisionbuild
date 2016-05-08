/**
 * Created by xastey on 4/3/2016.
 */

import {Component, Input, OnInit, Output, EventEmitter, OnDestroy} from '@angular/core';
import {NgFor, NgSwitch, NgSwitchWhen, NgSwitchDefault} from '@angular/common';
import {Attribute} from './attributes.model';
import {AttributePipe} from './attribute.pipe';
import {AttributesService, AttributeObservable} from '../../services/attributes.service';
import {
  ItemType, AttributeType, Rarity, ValueFormat, GearAttribute, DivisionAttribute
}
  from '../../common/models/common';
import {Subscription} from 'rxjs/Subscription';
import {AutoResizeInputComponent} from '../auto-resize-input/auto-resize-input.component';
import {EditorDirective} from '../../directives/editor';
import {AttributeRestrictPipe} from './attribute-restrict.pipe';
import {isNumber, isFunction} from '@angular/core/src/facade/lang';
import {numberRange} from '../../common/utils';
import {isWeaponType} from '../../services/item.service';


export interface AttributeMeta {
  level: number;
  rarity: Rarity;
  belongsTo: ItemType;
  weaponFamily: string;
}


export interface AttributeEvent {
  attribute: Attribute;
  attributeType: AttributeType;
}

type AttributesById = {[id: string]: DivisionAttribute}

@Component({
  selector: 'item-attribute',
  pipes: [AttributePipe, AttributeRestrictPipe],
  template: require('./attribute.component.html'),
  styles: [require('./attribute.component.scss')],
  directives: [NgFor, AutoResizeInputComponent, EditorDirective,
    NgSwitch, NgSwitchWhen, NgSwitchDefault]
})

export class AttributeComponent implements OnInit, OnDestroy {
  @Input() attribute: Attribute;
  @Input() metadata: AttributeMeta;
  @Input() restrict: Attribute[] = [];

  @Input('attribute-type') attributeType: AttributeType;

  @Input('maxlength') maxlength: any;

  @Output() added = new EventEmitter<AttributeEvent>();
  @Output() removed = new EventEmitter<AttributeEvent>();

  attributeFormat: ValueFormat;
  selectedAttribute: DivisionAttribute;
  attributes: DivisionAttribute[];
  attributeName: string = '';


  @Input('attributes-provider') attributesProvider: AttributeObservable;
  private _attributesById: AttributesById = {};

  private _subscription: Subscription;


  constructor(private _attributesService: AttributesService) {


  }

  get maxInputLength() {

    return (this.maxlength && isNumber(this.maxlength))
      ? this.maxlength : (isFunction(this.maxlength)) ? this.maxlength() : 4;
  }

  ngOnInit(): any {


    let meta = this.metadata;

    let provider = this.attributesProvider
      ? this.attributesProvider
      : this._attributesService.getFor(meta.belongsTo, this.attributeType);
    this._subscription = provider.subscribe(data => {
      this._attributesById = {};
      this.attributes = data;
      this.attribute.id = undefined;
      data.forEach((attr: DivisionAttribute) => this._attributesById[attr.id] = attr);
      if (data.length) {

        this.onAttributeChange();
      }

    });

  }

  get canAddOrRemove() {
    return !isWeaponType(this.metadata.belongsTo);
  }

  get attributeDef() {
    if (!this.attribute.id) {
      return void 0;
    }
    return this._attributesById[this.attribute.id];
  }


  get attributeValues() {
    if (!this.attribute.id) {
      return [];
    }
    let [low, high] = this.attributeDef.values[this.metadata.level];

    return numberRange(low, high);

  }


  onAttributeChange() {
    // ensure that we always select the first entry
    // when there is only one entry left no matter if we
    // switch from another attribute set
    if (!this.attribute.id || this.attributes.length === 1) {
      this.attribute.id = this.attributes[0].id;
    }
    this.selectedAttribute = this._attributesById[this.attribute.id];

    this.attributeName = this.selectedAttribute.name;

    this.attributeFormat = this.selectedAttribute.format || ValueFormat.PERCENT;
  }

  onAddAttribute() {
    this.added.emit({
      attributeType: this.attributeType,
      attribute: {
        id: this.attribute.id,
        value: this.attribute.value
      }
    });
  }

  onRemoveAttribute() {
    this.removed.emit({
      attribute: this.attribute,
      attributeType: this.attributeType
    });
  }

  get freeFormDisplay() {
    // this.attributeDef ? !this.attributeDef.values : true;
    return true;
  }

  onAttributeInputChanged(value) {
    this.attribute.value = value;
  }

  ngOnDestroy(): any {
    this._subscription.unsubscribe();
  }

  /*
   get attributes() {
   return this._attributesService.getDescriptorFor(this.belongsTo, this.attributeType)
   }   */
}
