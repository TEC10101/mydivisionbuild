/**
 * Created by xastey on 4/3/2016.
 */

import {Component, Input, OnInit, Output, EventEmitter, OnDestroy} from "angular2/core";
import {NgFor, NgSwitch, NgSwitchWhen, NgSwitchDefault} from "angular2/common";
import {Attribute} from "./attributes.model";
import {AttributePipe} from "./attribute_pipe";
import {AttributesService, AttributeObservable} from "../../services/attributes.service";
import {GearType, AttributeType, Rarity, ValueFormat, GearAttribute} from "../../common/models/common";
import {Subscription} from "rxjs/Subscription";
import {AutoResizeInputComponent} from "../auto-resize-input/auto-resize-input.component";
import {EditorDirective} from "../../directives/editor";
import {AttributeRestrictPipe} from "./attribute-restrict.pipe";
import {isNumber, isFunction} from "angular2/src/facade/lang";
import {numberRange} from "../../common/utils";


export interface AttributeMeta {
  level:number;
  rarity:Rarity;
  belongsTo:GearType;
}


export interface AttributeEvent {
  attribute:Attribute;
  attributeType:AttributeType
}

type AttributesById = {[id:string]:GearAttribute}

@Component({
  selector: 'item-attribute',
  pipes: [AttributePipe, AttributeRestrictPipe],
  template: require('./attribute.component.html'),
  styles: [require("./attribute.component.scss")],
  directives: [NgFor, AutoResizeInputComponent, EditorDirective,
    NgSwitch, NgSwitchWhen, NgSwitchDefault]
})

export class AttributeComponent implements OnInit, OnDestroy {
  @Input() attribute:Attribute;
  @Input() metadata:AttributeMeta;
  @Input() restrict:Attribute[] = [];

  @Input("attribute-type") attributeType:AttributeType;

  @Input("maxlength") maxlength:any;

  @Output() added = new EventEmitter<AttributeEvent>();
  @Output() removed = new EventEmitter<AttributeEvent>();

  attributeFormat:ValueFormat;
  selectedAttribute:GearAttribute;


  private _attributesById:AttributesById = {};

  attributes:GearAttribute[];

  private _subscription:Subscription;
  attributeName:string = "";

  /**
   *
   */
  @Input("attributes-provider") attributesProvider:AttributeObservable;


  constructor(private _attributesService:AttributesService) {


  }

  get maxInputLength() {

    return (this.maxlength && isNumber(this.maxlength))
      ? this.maxlength : (isFunction(this.maxlength)) ? this.maxlength() : 4;
  }

  ngOnInit():any {


    let meta = this.metadata;

    let provider = this.attributesProvider
      ? this.attributesProvider : this._attributesService.getFor(meta.belongsTo, this.attributeType);
    this._subscription = provider.subscribe(data=> {
      this._attributesById = {};
      this.attributes = data;
      this.attribute.id = null;
      data.forEach((attr:GearAttribute)=> this._attributesById[attr.id] = attr);
      if (data.length) {

        this.onAttributeChange();
      }

    });

  }

  get attributeDef() {
    if (!this.attribute.id) {
      return null;
    }
    return this._attributesById[this.attribute.id];
  }


  get attributeValues() {
    if (!this.attribute.id) {
      return [];
    }
    let [low,high] = this.attributeDef.values[this.metadata.level];

    return numberRange(low, high);

  }


  onAttributeChange() {
    // ensure that we always select the first entry
    // when there is only one entry left no matter if we
    // switch from another attribute set
    if (!this.attribute.id || this.attributes.length == 1) {
      this.attribute.id = this.attributes[0].id
    }
    this.selectedAttribute = this._attributesById[this.attribute.id];

    this.attributeName = this.selectedAttribute.name;

    this.attributeFormat = this.selectedAttribute.format;
  }

  onAddAttribute() {
    this.added.emit({
      attributeType: this.attributeType,
      attribute: {
        id: this.attribute.id,
        value: this.attribute.value
      }
    })
  }

  onRemoveAttribute() {
    this.removed.emit({
      attribute: this.attribute,
      attributeType: this.attributeType
    });
  }

  get freeFormDisplay() {
    return true; //this.attributeDef ? !this.attributeDef.values : true;
  }

  onAttributeInputChanged(value) {
    this.attribute.value = value;
  }

  ngOnDestroy():any {
    this._subscription.unsubscribe();
  }

  /*
   get attributes() {
   return this._attributesService.getItemsFor(this.belongsTo, this.attributeType)
   }   */
}
