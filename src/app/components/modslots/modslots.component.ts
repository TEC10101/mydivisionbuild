import {Input, OnInit, Component} from "angular2/core";
import {MOD_SLOT_TYPES, ModSlotType} from "./modslots.model";
import {ModSlotService, ModSlotAttributeSet} from "../../services/modslots.service";
import {AttributeMeta} from "../attributes/attribute.component";
import {ModSlotComponent} from "./modslot.component";
import {GearModSlot} from "../gear-overview/gear.model";
import {EditorDirective} from "../../directives/editor";

/**
 * Created by xastey on 4/10/2016.
 */


type ModAttributeSetByType = {[id:number]:ModSlotAttributeSet}
@Component({
  selector: "modslots",
  templateUrl: 'app/components/modslots/modslots.component.html',
  styles: [require('./modslots.component.scss')],
  directives: [ModSlotComponent, EditorDirective]

})
export class ModSlotsComponent implements OnInit {

  @Input() slots:GearModSlot[];

  @Input("gear-metadata") metadata:AttributeMeta;

  private _hasNative:boolean;
  private _canHaveExtra:number;

  private _defaultModSlotAttributeSet:ModSlotAttributeSet;

  constructor(private _modSlotService:ModSlotService) {
  }

  ngOnInit():any {
    let gearType = this.metadata.belongsTo;
    this._hasNative = ModSlotService.hasNative(gearType);

    if (this._hasNative && this.slots.length < 1) {
      this.onAddSlot();
    }
    this._canHaveExtra = ModSlotService.canHaveExtra(gearType)

  }

  get canAddSlot() {
    return this.slots.length < this._canHaveExtra + (this._hasNative ? 1 : 0 );
  }

  get canRemoveSlot() {
    return !!this.slots.length;
  }

  get canDisplayControls() {
    return this._hasNative || this._canHaveExtra > 0;
  }

  onAddSlot() {


    let defaultModSlotType = MOD_SLOT_TYPES[0];
    if (this.canAddSlot)


      if (this._defaultModSlotAttributeSet) {
        this._addSlot(defaultModSlotType, this._defaultModSlotAttributeSet);
      } else {


        this._modSlotService.getAttributeSetFor(defaultModSlotType)
          .subscribe(attributeSet=> {
            this._defaultModSlotAttributeSet = attributeSet;
            this._addSlot(defaultModSlotType, attributeSet);
          })
      }

  }

  private _addSlot(modSlotType:ModSlotType, attributeSet:ModSlotAttributeSet) {
    let primary = attributeSet.primary[0];
    let secondary = attributeSet.secondary[0];
    this.slots.push({
      id: modSlotType.id,
      primary: {
        id: primary.id,
        value: 0
      },
      secondary: {
        id: secondary.id,
        value: 0
      }
    });
  }


  onRemoveSlot() {
    this.slots.pop();
  }

}
