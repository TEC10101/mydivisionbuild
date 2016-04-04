/**
 * Created by xastey on 4/3/2016.
 */


import {Component, Input} from "angular2/core";
import {Attributes, Attribute} from "./attributes.model";
import {AttributeComponent, AttributeMeta, AttributeRemoveEvent, AttributeAddEvent} from "./attribute.component";
import {NgFor} from "angular2/common";
import {without} from "../../common/utils";



@Component({

  selector: 'item-attributes',

  templateUrl: 'app/components/attributes/attributes.component.html',

  directives: [NgFor, AttributeComponent]
})
export class AttributesComponent {

  @Input("data") attributes:Attributes;
  @Input("gear-metadata") metadata:AttributeMeta;


  onRemoveAttribute(event:AttributeRemoveEvent) {
    console.log("Removing Event", event);
    without(this.attributes[event.attributeType],event.attribute);
  }

  onAddAttribute(event:AttributeAddEvent) {

    this.attributes[event.attributeType]
      .push(event.attribute);


  }

}
