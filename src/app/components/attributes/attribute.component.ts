/**
 * Created by xastey on 4/3/2016.
 */

import {Component, Input, OnInit} from 'angular2/core';
import {NgFor} from "angular2/common";
import {Attribute} from "./attributes.model";
import {AttributePipe} from "./attribute_pipe";
import {AttributesService} from "../../services/attributes.service";
import {GearType, AttributeType} from "../../common/models/common";


@Component({
  selector: 'item-attribute',
  pipes: [AttributePipe],
  templateUrl: 'app/components/attributes/attribute.component.html',
  directives: [NgFor]
})
export class AttributeComponent implements OnInit {
  @Input() attribute:Attribute;
  @Input("belongs-to") belongsTo:GearType;
  @Input("attribute-type") attributeType:AttributeType;
  private _attributesService:AttributesService;


  constructor(attributesService:AttributesService) {
    this._attributesService = attributesService;
  }

  ngOnInit():any {

    console.log("belongsTo",this.belongsTo,"attributeType",this.attributeType);
    this._attributesService.getFor(this.belongsTo, this.attributeType).subscribe(data=> {
      console.log("Data", data)
    });
    return null;
  }

  /*
   get attributes() {
   return this._attributesService.getFor(this.belongsTo, this.attributeType)
   }   */
}
