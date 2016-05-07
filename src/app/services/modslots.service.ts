import {Injectable} from '@angular/core';
import {AttributesService} from './attributes.service';
import {ItemType, GearAttribute, AttributeType} from '../common/models/common';
import {ModSlotType, GEAR_MOD_SLOT_TYPES, WEAPON_MOD_SLOT_TYPES} from '../components/modslots/modslots.model';
import {asObservable} from '../common/utils';
import * as _ from 'lodash';
import {Observable} from 'rxjs/Observable';
import {isWeaponType} from './item.service';
/**
 * Created by xastey on 4/10/2016.
 */


export class ModSlotAttributeSet {
  primary: GearAttribute[];
  secondary: GearAttribute[];
}

@Injectable()
export class ModSlotService {


  static hasNative(gearType: ItemType): boolean {
    switch (gearType) {
      case ItemType.Mask:
      case ItemType.BackPack:
        return true;
      default:
        return false;
    }

  }

  // TODO: allow to pass rarity and score to restrict more
  static canHaveExtra(gearType: ItemType): number {
    switch (gearType) {
      case ItemType.Mask:
      case ItemType.KneePads:
      case ItemType.Holster:
        return 2;

      case ItemType.BodyArmor:
        return 3;
      default:
        return 0;
    }

  }

  constructor(private _attributeService: AttributesService) {


  }

  getTypes(itemType: ItemType) {
    return isWeaponType(itemType) ? WEAPON_MOD_SLOT_TYPES : GEAR_MOD_SLOT_TYPES;
  }


  getAttributeSetFor(slotType: ModSlotType): Observable<ModSlotAttributeSet> {


    return slotType.belongsToWeapon
      ? this.getWeaponAttributeSetFor(slotType)
      : this.getGearAttributeSetFor(slotType);


  }

  getWeaponAttributeSetFor(slotType: ModSlotType): Observable<ModSlotAttributeSet> {
    return void 0;
  }

  getGearAttributeSetFor(slotType: ModSlotType): Observable<ModSlotAttributeSet> {
    return asObservable(this._attributeService
      .gearAttributes.map((attrs: GearAttribute[]) => {
        let primary, secondary;
        if (slotType.isPerformance) {

          primary = secondary = _.filter(attrs,
            (attr) => attr.mod && attr.type === AttributeType.SKILL);


        } else {

          primary = [slotType
            .resolveMainAttribute(
              _.filter(attrs, {mod: true, type: AttributeType.MAIN}))
          ];
          secondary = _.filter(attrs,
            (attr) => attr.mod &&
            attr.type !== AttributeType.MAIN
            && attr.type !== AttributeType.SKILL);

        }


        return {
          primary: primary,
          secondary: secondary
        };
      })).first((x, idx, _) => !!x);
  }

}

