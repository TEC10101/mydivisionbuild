/**
 * Created by xastey on 4/3/2016.
 */


import {Component, Input, ElementRef} from "angular2/core";
import {Attributes} from "./attributes.model";
import {AttributeComponent, AttributeMeta, AttributeEvent} from "./attribute.component";
import {NgFor} from "angular2/common";
import {without} from "../../common/utils";
import {AttributeType} from "../../common/models/common";
import {EditorDirective} from "../../directives/editor";


@Component({

  selector: 'item-attributes',

  templateUrl: 'app/components/attributes/attributes.component.html',

  styles: [require('./attributes.component.scss')],
  directives: [NgFor, AttributeComponent, EditorDirective]
})
export class AttributesComponent {

  @Input("data") attributes:Attributes;
  @Input("gear-metadata") metadata:AttributeMeta;

  constructor(private _elementRef:ElementRef) {

  }


  private _dispatchEvent(type:string, event:AttributeEvent) {
    this._elementRef.nativeElement.dispatchEvent(new CustomEvent(type, {

      detail: {
        attribute: event.attribute,
        attributeType: event.attributeType
      }
    }))
  }

  onRemoveAttribute(event:AttributeEvent) {

    without(this.attributes[event.attributeType], event.attribute);
    this._dispatchEvent("attributeRemoved", event)
  }

  onAddAttribute(event:AttributeEvent) {

    this.attributes[event.attributeType]
      .push(event.attribute);
    this._dispatchEvent("attributeAdded", event)

  }

  onAddAttributeType(attributeType:AttributeType) {
    this.attributes[attributeType].push({
      value: 0
    })
  }

}
