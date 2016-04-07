/**
 * Created by xastey on 4/3/2016.
 */

import {Component, Input, OnInit, Output, EventEmitter, OnDestroy} from "angular2/core";
import {NgFor} from "angular2/common";
import {Attribute} from "./attributes.model";
import {AttributePipe} from "./attribute_pipe";
import {AttributesService} from "../../services/attributes.service";
import {GearType, AttributeType, Rarity, AttributeFormat, GearAttribute} from "../../common/models/common";
import {Subscription} from "rxjs/Subscription";
import {AutoResizeInputComponent} from "../auto-resize-input/auto-resize-input.component";


export interface AttributeMeta {

  level:number;
  rarity:Rarity;
  belongsTo:GearType;
}

export interface AttributeRemoveEvent {
  attribute:Attribute;
  attributeType:AttributeType
}
export interface AttributeAddEvent {
  attributeType:AttributeType;
  attribute:Attribute;
}
type AttributesById = {[id:string]:GearAttribute}

@Component({
  selector: 'item-attribute',
  pipes: [AttributePipe],
  templateUrl: 'app/components/attributes/attribute.component.html',
  styles: [require("./attribute.component.scss")],
  directives: [NgFor, AutoResizeInputComponent]
})

export class AttributeComponent implements OnInit, OnDestroy {
  @Input() attribute:Attribute;
  @Input() metadata:AttributeMeta;

  @Input("attribute-type") attributeType:AttributeType;

  @Output("add") add = new EventEmitter<AttributeAddEvent>();
  @Output("remove") remove = new EventEmitter<AttributeRemoveEvent>();

  attributeFormat:AttributeFormat;
  selectedAttribute:GearAttribute;
  private _attributesService:AttributesService;

  private _attributesById:AttributesById = {};

  attributes:GearAttribute[];

  private _subscription:Subscription;


  constructor(attributesService:AttributesService) {
    this._attributesService = attributesService;
  }

  ngOnInit():any {

    let meta = this.metadata;


    let attributesById = this._attributesById;
    this._subscription = this._attributesService.getFor(meta.belongsTo, this.attributeType)
      .subscribe(data=> {
        this.attributes = data;
        data.forEach((attr:GearAttribute)=> attributesById[attr.id] = attr);
        if (data.length)
          this.onAttributeChange();
      });

  }

  onAttributeChange() {
    this.selectedAttribute = this._attributesById[this.attribute.id];

    this.attributeFormat = this.selectedAttribute.format;
  }

  onAddAttribute() {
    this.add.emit({
      attributeType: this.attributeType,
      attribute: {
        id: this.attribute.id,
        value: this.attribute.value
      }
    })
  }

  onRemoveAttribute() {
    this.remove.emit({
      attribute: this.attribute,
      attributeType: this.attributeType
    });
  }

  onAttributeInputChanged(value) {
    this.attribute.value = value;
  }

  ngOnDestroy():any {
    this._subscription.unsubscribe();
  }

  /*
   get attributes() {
   return this._attributesService.getFor(this.belongsTo, this.attributeType)
   }   */
}
