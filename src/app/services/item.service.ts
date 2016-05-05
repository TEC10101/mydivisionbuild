/**
 * Created by xastey on 4/4/2016.
 */


import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {BehaviorSubject} from 'rxjs/Rx';
import {
  DivisionItem, ItemType, GearRarity, Rarity, Gender, WEAPON_TYPES, GEAR_TYPES
}
  from '../common/models/common';
import * as _ from 'lodash';
import {dashCaseToCamelCase} from '@angular/compiler/src/util';
import {asObservable} from '../common/utils';
import {Observable} from 'rxjs/Observable';
import {Gear, GEAR_SCORES} from '../components/gear-overview/gear.model';
import {InventoryService} from './inventory.service';
import {InventoryItem} from '../components/inventory/inventory.model';


class ItemStore {
  private _items: BehaviorSubject<DivisionItem[]> = new BehaviorSubject<DivisionItem[]>([]);
}

export interface GearTalent {
  id: string;
  template: string;
}
interface GearIconSet {
  // superior lvl30
  131?: string;
  // superior lvl31
  147?: string;
  // high-end lvl 30
  163?: string;
  // high-end lvl 31
  182?: string;

}

interface GearSetIconSet {
  striker: string;
  juggernaut: string;
  sentry: string;
  nomad: string;
  tactician: string;
}
interface GearIcons {
  superior: GearIconSet;
  'high-end': GearIconSet;
  'gear-set': GearSetIconSet;
}

interface ResolvedImage {
  primary: string;
  secondary: string;
}

interface DivisionCategories<T, G> {
  superior: T;
  'high-end': T;
  'gear-set': G;
}

export interface ItemDescriptor {

  items: DivisionCategories<DivisionItem[], DivisionItem[]>;

  talents: GearTalent[];
}

interface WeaponInfo extends DivisionItem {
  named: boolean;
  talents: any[];
}
export interface GearDescriptor extends ItemDescriptor {
  icons: DivisionCategories<GearIconSet, GearIconSet>;
}

export interface WeaponDescriptor extends ItemDescriptor {

}


@Injectable()
export class ItemsService {

  // gear
  private _bodyArmor: BehaviorSubject<GearDescriptor> = new BehaviorSubject<GearDescriptor>(void 0);
  private _mask: BehaviorSubject<GearDescriptor> = new BehaviorSubject<GearDescriptor>(void 0);
  private _backPack: BehaviorSubject<GearDescriptor> = new BehaviorSubject<GearDescriptor>(void 0);
  private _gloves: BehaviorSubject<GearDescriptor> = new BehaviorSubject<GearDescriptor>(void 0);
  private _kneePads: BehaviorSubject<GearDescriptor> = new BehaviorSubject<GearDescriptor>(void 0);
  private _holster: BehaviorSubject<GearDescriptor> = new BehaviorSubject<GearDescriptor>(void 0);

  // weapons

  private _assaultRifle: BehaviorSubject<WeaponDescriptor> =
    new BehaviorSubject<WeaponDescriptor>(void 0);

  private _basePath = 'app/assets/json/';
  private _imagePath = 'app/assets/images/inventory/';


  constructor(private _http: Http, private _inventoryService: InventoryService) {
    this._loadItems(GEAR_TYPES);
    this._loadItems(WEAPON_TYPES, (weapons: WeaponInfo[]) => {
      let superior = _.filter(weapons, weapon => !weapon.named);

      let items = {};
      items[GearRarity.SUPERIOR] = superior;
      items[GearRarity.HIGH_END] = weapons;

      return {
        items: items,
        talents: []
      };
    });

  }


  _loadItems<T>(types: ItemType[], process: (item: T) => T = (item: T) => item) {
    let self = this;
    _.forEach(types, (gearType: ItemType, key: string) => {
      console.log('ItemsService(', gearType, ')');
      let subjectName = dashCaseToCamelCase(gearType);

      let subject = self['_' + subjectName] as BehaviorSubject<any>;
      if (!subject) return;
      let url = self._basePath + gearType + '.json';
      this._http.get(url)
        .map(res => process(<T>res.json()))
        .subscribe(
          descriptor => subject.next(descriptor),
          error => console.log('Error loading', url, error),
          () => console.log('Finished loading', url)
        );
    });
  }

  get scores() {
    return GEAR_SCORES;
  }

  // @TODO : add GEAR_SET images
  get rarities(): Rarity[] {
    return [GearRarity.SUPERIOR, GearRarity.HIGH_END, GearRarity.GEAR_SET];
  }


  /**
   * Returns a descriptor for the choosen gear type
   * @param itemType
   * @returns {Observable<ItemDescriptor>}
   */
  getDescriptorFor(itemType: ItemType): Observable<ItemDescriptor> {
    let obs = <Observable<ItemDescriptor>>this['_' + dashCaseToCamelCase(itemType || '')];
    if (obs) {
      return asObservable(obs.first((x, idx, _) => !!x));
    }

    console.dir(Observable.create());
    return Observable.create();
  }


  _imageUrl(type: string, icon: string): string {
    return icon ? this._imagePath + type + '/' + icon : '';
  }

  _gearImageResolve(descriptor: GearDescriptor, item: InventoryItem): ResolvedImage {

    let icons = descriptor.icons[item.rarity];


    let isGearSet = item.rarity === GearRarity.GEAR_SET;
    let gearSetName = void 0;
    if (isGearSet) {
      // find item information to resolve gear name
      let divisionItem = <DivisionItem>_.find(
        descriptor.items[GearRarity.GEAR_SET],
        {name: item.name}
      );
      gearSetName = divisionItem.belongsTo;

    }


    let icon = icons[gearSetName || item.score];

    if (icon.hasOwnProperty(Gender.MALE)) {

      icon = icon[Gender.MALE];
    } else if (icon.hasOwnProperty(Gender.FEMALE)) {
      icon = icon[Gender.FEMALE];
    }

    let isObject = _.isObject(icon);

    return {
      primary: this._imageUrl(item.type, isObject ? icon.primary : icon),
      secondary: gearSetName ?
        this._imageUrl('sets', gearSetName + '.png')
        : this._imageUrl(item.type, isObject ? icon.secondary : icon)
    };

  }

  _weaponImageResolve(descriptor: GearDescriptor, item: InventoryItem): ResolvedImage {
    return {
      primary: '',
      secondary: ''
    };
  }

  /**
   * Resolves the correct gear image
   * @param item
   * @returns {Observable<string>}
   */
  imageResolve(item: InventoryItem): Observable<ResolvedImage> {

    return this.getDescriptorFor(item.type).map(descriptor => {
      return isWeaponType(item.type)
        ? this._weaponImageResolve(descriptor, item)
        : this._gearImageResolve(<GearDescriptor>descriptor, item);
    });
  }
}
export function isWeaponType(itemType: ItemType): boolean {


  return _.includes(WEAPON_TYPES, itemType);

}
