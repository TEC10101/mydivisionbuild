import {Injectable} from '@angular/core';
import {
  ItemType, AttributeType, GearAttribute, WeaponAttribute, DivisionAttribute
}
  from '../common/models/common';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/startWith';
import {BehaviorSubject} from 'rxjs/Rx';
import {asObservable} from '../common/utils';
import * as _ from 'lodash/index';
import {isWeaponType} from './item.service';
/**
 * Created by xastey on 4/3/2016.
 */
export type AttributeObservable = Observable<DivisionAttribute[]>

@Injectable()
export class AttributesService {


  private _gearAttributes = new BehaviorSubject<GearAttribute[]>([]);

  private _weaponAttributes = new BehaviorSubject<WeaponAttribute[]>([]);

  private static defaultFilterProvider(gearType: ItemType, attributeType: AttributeType) {
    return {type: attributeType, supports: [gearType]};
  }

  private static skillFilterProvider(gearType: ItemType) {
    return {type: AttributeType.SKILL, skill: true, supports: [gearType]};
  }

  constructor(private _http: Http) {


    this._loadGearAttributes();
    this._loadWeaponAttributes();

    // this._bodyArmor = new AttributeStore(ItemType.BodyArmor, this._http);


  }


  _loadWeaponAttributes() {
    let basePath = 'app/assets/json/weapon-attributes.json';
    this._http.get(basePath)
      .map(res => <WeaponAttribute[]>res.json())
      .subscribe(
        attributes => this._weaponAttributes.next(attributes),
        err => console.error(err),
        () => console.log('Finished loading attributes')
      );
  }

  _loadGearAttributes() {
    let basePath = 'app/assets/json/gear-attributes.json';
    this._http.get(basePath)
      .map(res => <GearAttribute[]>res.json())
      .subscribe(
        attributes => this._gearAttributes.next(attributes),
        err => console.error(err),
        () => console.log('Finished loading attributes')
      );
  }


  get weaponAttributes() {
    return asObservable(this._weaponAttributes, true);
  }

  get gearAttributes() {
    return asObservable(this._gearAttributes.first((attrs, idx, obs) => !!attrs.length));
  }


  getFor(itemType: ItemType, attributeType: AttributeType): AttributeObservable {
    return isWeaponType(itemType)
      ? this._weaponAttributesFor(itemType, attributeType)
      : this._gearAttributesFor(itemType, attributeType);

  }

  _weaponAttributesFor(itemType: ItemType, attributeType: AttributeType): AttributeObservable {
    return this.weaponAttributes;
  }

  _gearAttributesFor(itemType: ItemType, attributeType: AttributeType): AttributeObservable {
    let providerName = attributeType + 'FilterProvider';
    let filterProvider = AttributesService[providerName]
      ? AttributesService[providerName] : AttributesService.defaultFilterProvider;
    return asObservable(this._gearAttributes.map(attrs => {
      return _.filter(attrs, filterProvider(itemType, attributeType));
    }));
  }


}
