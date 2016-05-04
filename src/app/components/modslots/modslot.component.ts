import {ModSlotType} from "./modslots.model";
import {Input, Component, OnInit, ElementRef} from "@angular/core";
import {GearModSlot} from "../gear-overview/gear.model";
import {ModSlotService, ModSlotAttributeSet} from "../../services/modslots.service";
import {EditorDirective} from "../../directives/editor";
import {AttributeObservable} from "../../services/attributes.service";
import {BehaviorSubject} from "rxjs/Rx";
import {GearAttribute} from "../../common/models/common";
import {asObservable} from "../../common/utils";
import {AttributeComponent, AttributeMeta} from "../attributes/attribute.component";
/**
 * Created by xastey on 4/10/2016.
 */


type SlotTypesById = {[id:string]:ModSlotType}
@Component({
  selector: "modslot",
  templateUrl: 'app/components/modslots/modslot.component.html',
  styles: [require('./modslot.component.scss')],
  directives: [EditorDirective, AttributeComponent]

})
export class ModSlotComponent implements OnInit {

  @Input() slot:GearModSlot;

  @Input("gear-metadata") metadata:AttributeMeta;
  slotTypes:ModSlotType[];

  private slotName:string;
  private _slotTypesById:SlotTypesById = {};
  private slotRarity:string;
  private _primaryAttributes = new BehaviorSubject<GearAttribute[]>([]);


  private _secondaryAttributes = new BehaviorSubject<GearAttribute[]>([]);
  private _selectedSlotType:ModSlotType;


  constructor(private _modSlotService:ModSlotService, private _el:ElementRef) {

    this.slotTypes = this._modSlotService.types;
    this.slotTypes.forEach(type=>this._slotTypesById[type.id] = type)
  }


  onSlotTypeChanged() {

    //Cast selected id to a number due to bug with angular2 and select
    //http://stackoverflow.com/questions/35491608/how-to-get-number-in-ngmodel-in-angular-2
    this.slot.id = +this.slot.id;

    this._selectedSlotType = this._slotTypesById[this.slot.id];
    this.slotName = this._selectedSlotType.name;
    this.slotRarity = this._selectedSlotType.rarity;

    this.refreshAttributeProviders();


  }


  private refreshAttributeProviders() {

    this._modSlotService.getAttributeSetFor(this._selectedSlotType).first().subscribe((attributeSet:ModSlotAttributeSet)=> {

      this._primaryAttributes.next(attributeSet.primary);
      this._secondaryAttributes.next(attributeSet.secondary);
    })
  }

  /**
   *  Function that returns an Observable that allows the @link AttributeComponent to
   *  fetch the correct set of attributes to display for both primary and secondary
   * @param primary
   * @returns {Observable<GearAttribute[]>|Observable<R>}
   */
  getAttributesProvider(primary:boolean):AttributeObservable {


    return asObservable(primary ? this._primaryAttributes : this._secondaryAttributes);
  }

  ngOnInit():any {
    this.onSlotTypeChanged();
  }


}
