import {Injectable} from '@angular/core';
import {AttributesService} from './attributes.service';
import {ItemType, GearAttribute, AttributeType} from '../common/models/common';
import {
  ModSlotType, GEAR_MOD_SLOT_TYPES, WEAPON_MOD_SLOT_TYPES, WeaponModType, ModSlotKind
}
  from '../components/modslots/modslots.model';
import {asObservable} from '../common/utils';
import * as _ from 'lodash';
import {Observable} from 'rxjs/Observable';
import {isWeaponType} from './item.service';
import {Http} from '@angular/http';
import {BehaviorSubject} from 'rxjs/Rx';
/**
 * Created by xastey on 4/10/2016.
 */


export class ModSlotAttributeSet {
  primary: GearAttribute[];
  secondary: GearAttribute[];
}

interface WeaponModItem {
  name: string;
  inheritAttribute?: number;
}
export interface WeaponModItems {
  muzzle: WeaponModItem[];
  underbarrel: WeaponModItem[];
  optics: WeaponModItems[];
  magazine: WeaponModItem[];
}

@Injectable()
export class ModSlotService {

  private _weaponModItems: BehaviorSubject<WeaponModItems>
    = new BehaviorSubject<WeaponModItems>(void 0);

  private _basePath = 'app/assets/json/';

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

  constructor(private _attributeService: AttributesService, private _http: Http) {

    this._loadWeaponMods();

  }

  _loadWeaponMods() {
    let url = this._basePath + 'weapon-mods.json';
    this._http.get(url)
      .map(res => <WeaponModItems>res.json())
      .subscribe(
        items => this._weaponModItems.next(items),
        error => console.log('Error loading', url, error),
        () => console.log('Finished loading', url)
      );
  }

  getTypes(itemType: ItemType) {
    return isWeaponType(itemType) ? WEAPON_MOD_SLOT_TYPES : GEAR_MOD_SLOT_TYPES;
  }

  weaponItemsFor(slotType: ModSlotKind): Observable<WeaponModItem[]> {
    return asObservable(this._weaponModItems, true).map(items => {
      return items[slotType];
    });
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

