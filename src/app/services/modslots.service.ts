import {Injectable} from "angular2/core";
import {AttributesService} from "./attributes.service";
import {GearType, GearAttribute, AttributeType} from "../common/models/common";
import {ModSlotType, MOD_SLOT_TYPES} from "../components/modslots/modslots.model";
import {asObservable} from "../common/utils";
import * as _ from "lodash";
import {Observable} from "rxjs/Observable";
/**
 * Created by xastey on 4/10/2016.
 */


export class ModSlotAttributeSet {
  primary:GearAttribute[];
  secondary:GearAttribute[];
}

@Injectable()
export class ModSlotService {




  constructor(private _attributeService:AttributesService) {


  }

  get types() {
    return MOD_SLOT_TYPES;
  }


  getAttributeSetFor(slotType:ModSlotType):Observable<ModSlotAttributeSet> {


    return asObservable(this._attributeService.attributes.map((attrs:GearAttribute[])=> {
      let secondary = _.filter(attrs, (attr)=> attr.mod && attr.type != AttributeType.MAIN);
      let primary = slotType.isPerformance ? secondary : _.filter(attrs, {mod: true, type: AttributeType.MAIN});
      return {
        primary: primary,
        secondary: secondary
      }
    }))
  }

  static hasNative(gearType:GearType):boolean {
    switch (gearType) {
      case GearType.Mask:
      case GearType.Backpack:
        return true;
    }
    return false;
  }

  // TODO: allow to pass rarity and level to restrict more
  static canHaveExtra(gearType:GearType):number {
    switch (gearType) {
      case GearType.Mask:
      case GearType.KneePads:
      case GearType.Holster:
        return 2;

      case GearType.BodyArmor:
        return 3;
    }
    return 0;
  }


}

