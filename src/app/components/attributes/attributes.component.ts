/**
 * Created by xastey on 4/3/2016.
 */


import {Component, Input} from 'angular2/core';
import {Attributes} from "./attributes.model";
import {AttributeComponent} from "./attribute.component";
import {NgFor} from "angular2/common";
import {GearType} from "../../common/models/common";



@Component({

  selector: 'item-attributes',

  templateUrl: 'app/components/attributes/attributes.component.html',

  directives: [NgFor,AttributeComponent]
})
export class AttributesComponent {

 @Input("data") attributes:Attributes;
 @Input("gear-type") gearType:GearType;
}
