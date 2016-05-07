/**
 * Created by xastey on 4/4/2016.
 */


import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {BehaviorSubject} from 'rxjs/Rx';
import {
  DivisionItem, ItemType, GearRarity, Rarity, Gender, WEAPON_TYPES, GEAR_TYPES,
  ItemTalent, WeaponTalent
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

export type DivisionItems = DivisionCategories<DivisionItem[], DivisionItem[]>
export interface ItemDescriptor {

  items: DivisionItems;

  talents: ItemTalent[];
}

interface WeaponInfo extends DivisionItem {
  named: boolean;
  talents: WeaponTalent[];
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


  private _weaponTalents: BehaviorSubject<WeaponTalent[]> =
    new BehaviorSubject<WeaponTalent[]>(void 0);

  private _basePath = 'app/assets/json/';
  private _imagePath = 'app/assets/images/inventory/';


  constructor(private _http: Http) {
    this._loadItems(GEAR_TYPES);
    this._loadWeaponTalents();

    this._asObservable(this._weaponTalents)
      .subscribe(talents => this._loadWeapons(talents));


  }

  _loadWeapons(talents: WeaponTalent[]) {
    this._loadItems(WEAPON_TYPES, (weaponType: ItemType, weapons: WeaponInfo[]) => {
      let superior = _.filter(weapons, weapon => !weapon.named);

      let items = {};
      items[GearRarity.SUPERIOR] = superior;
      items[GearRarity.HIGH_END] = weapons;
      items[GearRarity.GEAR_SET] = [];


      let supportedTalents: WeaponTalent[] = _.filter(talents, {supports: [weaponType]});

      return <ItemDescriptor>{
        items: <DivisionItems>items,
        talents: supportedTalents
      };
    });
  }

  _loadWeaponTalents() {
    let url = this._basePath + 'weapon-talents.json';
    this._http.get(url)
      .map(res => <WeaponTalent[]>res.json())
      .subscribe(
        talents => this._weaponTalents.next(talents),
        error => console.log('Error loading', url, error),
        () => console.log('Finished loading', url)
      );
  }

  _loadItems(types: ItemType[],
             process: (type: ItemType, json: any) => ItemDescriptor
               = (type: ItemType, json: any) => <ItemDescriptor>json) {
    let self = this;
    _.forEach(types, (itemType: ItemType, key: string) => {
      console.log('ItemsService(', itemType, ')');
      let subjectName = dashCaseToCamelCase(itemType);

      let subject = self['_' + subjectName] as BehaviorSubject<any>;
      if (!subject) return;
      let url = self._basePath + itemType + '.json';
      this._http.get(url)
        .map(res => process(itemType, res.json()))
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
      return this._asObservable(obs);
    }

    console.dir(Observable.create());
    return Observable.create();
  }

  _asObservable<T>(obs: Observable<T>): Observable<T> {
    return asObservable(obs.first((x, idx, _) => !!x));
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

  _weaponImageResolve(descriptor: WeaponDescriptor, item: InventoryItem): ResolvedImage {
    let info = <DivisionItem>_.find(descriptor.items[item.rarity], {name: item.name});
    return {
      primary: info ? this._imageUrl(item.type, info.icon) : '',
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
        ? this._weaponImageResolve(<WeaponDescriptor>descriptor, item)
        : this._gearImageResolve(<GearDescriptor>descriptor, item);
    });
  }

  talentImageResolve(id): ResolvedImage {
    return {
      primary: this._imageUrl('talents', id + '.png'),
      secondary: ''
    };
  }
}
export function isWeaponType(itemType: ItemType): boolean {


  return _.includes(WEAPON_TYPES, itemType);

}
