/**
 * Created by xastey on 4/4/2016.
 */


import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {BehaviorSubject, Subject, Observable} from 'rxjs';
import {
  DivisionItem, ItemType, GearRarity, Rarity, Gender, WEAPON_TYPES, GEAR_TYPES,
  ItemTalent, WeaponTalent, GearAttribute, WeaponAttribute
}
  from '../common/models/common';
import * as _ from 'lodash';
import {dashCaseToCamelCase} from '@angular/compiler/src/util';
import {asObservable} from '../common/utils';

import {Gear, GEAR_SCORES} from '../components/gear-overview/gear.model';
import {InventoryService} from './inventory.service';
import {InventoryItem} from '../components/inventory/inventory.model';
import {WeaponModType} from '../components/modslots/modslots.model';
import {AttributesService} from './attributes.service';


class ItemStore {
  private _items: BehaviorSubject<DivisionItem[]> = new BehaviorSubject<DivisionItem[]>([]);
}


let defaultDescriptorProcessor = (type: ItemType, json: any) => <ItemDescriptor>json;
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

interface WeaponModCompatibility {
  magazine: boolean;
  muzzle: WeaponModType[];
  optics: WeaponModType[];
  underbarrel: WeaponModType[];
}

type WeaponModCompatibilityByType = {[id: string]: WeaponModCompatibility}
type  WeaponBaseStatsByFamily = {[id: string]: WeaponBaseStats}

interface WeaponManifest {
  weapons: WeaponInfo[];
  compatibility: WeaponModCompatibilityByType;
}
export interface WeaponInfo extends DivisionItem {
  named: boolean;
  talents: WeaponTalent[];
  family: string;
}
export interface GearDescriptor extends ItemDescriptor {
  icons: DivisionCategories<GearIconSet, GearIconSet>;
}


export interface WeaponBaseStats {
  rpm: number;
  damage: number;
  reloadEmpty: number;
  reloadBulletsLeft: number;
  scaling: number;
}


export interface WeaponDescriptor extends ItemDescriptor {
  compatibility: WeaponModCompatibilityByType;
  stats: WeaponBaseStatsByFamily;
}

abstract class DescriptorCollection<T> {

  forType(itemType: ItemType): T {
    let name = dashCaseToCamelCase(itemType);
    return this.hasOwnProperty(name) ? this[name] : void 0;
  }
}
export class GearDescriptorCollection extends DescriptorCollection<GearDescriptor> {
  bodyArmor: GearDescriptor;
  mask: GearDescriptor;
  backPack: GearDescriptor;
  gloves: GearDescriptor;
  kneePads: GearDescriptor;
  holster: GearDescriptor;

  attributes: GearAttribute[];
  


}

export class WeaponDescriptorCollection extends DescriptorCollection<WeaponDescriptor> {
  assaultRifle: WeaponDescriptor;
  attributes: WeaponAttribute[];

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

  private _weaponDescriptorCollection: WeaponDescriptorCollection
    = new WeaponDescriptorCollection();
  private _gearDescriptorCollection: GearDescriptorCollection
    = new GearDescriptorCollection();

  private _assaultRifle: BehaviorSubject<WeaponDescriptor> =
    new BehaviorSubject<WeaponDescriptor>(void 0);


  private _weaponTalents: BehaviorSubject<WeaponTalent[]> =
    new BehaviorSubject<WeaponTalent[]>(void 0);

  private _basePath = 'app/assets/json/';
  private _imagePath = 'app/assets/images/inventory/';


  constructor(private _http: Http, private _attributesService: AttributesService) {
    this._loadItems(GEAR_TYPES, this._gearDescriptorCollection);
    this._loadWeaponTalents();

    asObservable(this._weaponTalents, true)
      .subscribe(talents => this._loadWeapons(talents));
    _attributesService.weaponAttributes
      .subscribe(attributes => this._weaponDescriptorCollection.attributes = attributes);

    _attributesService.gearAttributes
      .subscribe(attributes => this._gearDescriptorCollection.attributes = attributes);


  }

  _collectDescriptors<T>(metadata: T, types: ItemType[]) {
    types = types.slice(0);

    let obs = types.map(type => this['_' + dashCaseToCamelCase(type)]);
    let all = new Subject<T>();
    Observable.merge(...obs).take(obs.length).subscribe(
      descriptor => {
        let itemType = types.shift();
        let name = dashCaseToCamelCase(itemType);
        metadata[name] = descriptor;
      },
      error => console.log(error),
      () => all.next(metadata)
    );

    return all;
  }

  get _gearDescriptors(): GearDescriptorCollection {
    return this._gearDescriptorCollection;

  }

  get _weaponDescriptors(): WeaponDescriptorCollection {
    return this._weaponDescriptorCollection;
  }

  _loadWeapons(talents: WeaponTalent[]) {
    this._loadItems(WEAPON_TYPES, this._weaponDescriptorCollection,
      (weaponType: ItemType, manifest: WeaponManifest) => {
        let weapons = manifest.weapons;
        let superior = _.filter(weapons, weapon => !weapon.named);

        let items = {};
        items[GearRarity.SUPERIOR] = superior;
        items[GearRarity.HIGH_END] = weapons;
        items[GearRarity.GEAR_SET] = [];


        let supportedTalents: WeaponTalent[] = _.filter(talents, {supports: [weaponType]});

        return <WeaponDescriptor>{
          items: <DivisionItems>items,
          talents: supportedTalents,
          compatibility: manifest.compatibility
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

  _loadItems(types: ItemType[], collection: DescriptorCollection<ItemDescriptor>,
             process: (type: ItemType, json: any) => ItemDescriptor
               = defaultDescriptorProcessor) {

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
          descriptor => {
            subject.next(descriptor);
            collection[subjectName] = descriptor;
          },
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
      return asObservable(obs, true);
    }
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
