/**
 * Created by xastey on 4/4/2016.
 */


import {Injectable} from "angular2/core";
import {Http} from "angular2/http";
import {BehaviorSubject} from "rxjs/Rx";
import {DivisionItem, GearType, GearRarity, Rarity} from "../common/models/common";
import * as _ from "lodash";
import {dashCaseToCamelCase} from "angular2/src/compiler/util";
import {asObservable} from "../common/utils";
import {Observable} from "rxjs/Observable";
import {Gear, GEAR_SCORES} from "../components/gear-overview/gear.model";
import {InventoryService} from "./inventory.service";

class ItemStore {
  private _items:BehaviorSubject<DivisionItem[]> = new BehaviorSubject<DivisionItem[]>([]);
}

export interface GearTalent {
  id:string;
  template:string;
}
interface GearIconSet {
  // superior lvl30
  131?:string;
  //superior lvl31
  147?:string;
  // high-end lvl 30
  163?:string;
  //high-end lvl 31
  182?:string;
}
interface GearIcons {
  superior:GearIconSet;
  "high-end":GearIconSet;
}

export interface GearDescriptor {

  items:DivisionItem[];
  icons:GearIcons;
  talents:GearTalent[];
}
@Injectable()
export class ItemsService {

  private _bodyArmor:BehaviorSubject<GearDescriptor> = new BehaviorSubject<GearDescriptor>(null);

  private _basePath = "app/assets/json/";
  private _imagePath = "app/assets/images/inventory/";


  constructor(http:Http, private _inventoryService:InventoryService) {

    this.init(http);
  }

  init(http:Http) {

    let self = this;

    _.forEach(GearType, (gearType:GearType, key:string)=> {
      let subjectName = dashCaseToCamelCase(gearType);

      let subject = self["_" + subjectName] as BehaviorSubject<GearDescriptor>;
      if (!subject) return;
      let url = self._basePath + gearType + ".json";
      http.get(url)
        .map(res=><GearDescriptor>res.json())
        .subscribe(
          descriptor=>subject.next(descriptor),
          error=>console.log("Error loading", url, error),
          ()=> console.log("Finished loading", url)
        )
    })
  }

  get scores() {
    return GEAR_SCORES;
  }

  get rarities():Rarity[] {
    return [GearRarity.SUPERIOR, GearRarity.HIGH_END, GearRarity.GEAR_SET]
  }

  /**
   * Returns a descriptor for the choosen gear type
   * @param gearType
   * @returns {Observable<GearDescriptor>}
   */
  getItemsFor(gearType:GearType):Observable<GearDescriptor> {
    switch (gearType) {
      case GearType.BodyArmor:
        return asObservable(this._bodyArmor.first((x, idx, obs)=> !!x))
    }
  }

  /**
   * Resolves the correct gear image
   * @param item
   * @returns {Observable<string>}
   */
  imageResolve(item:Gear):Observable<string> {

    return this.getItemsFor(item.type).map(descriptor=> {

      let icons = descriptor.icons[item.rarity];

      let gender = this._inventoryService.inventory.gender;
      let icon = icons[item.score][gender];

      return icon ? this._imagePath + item.type + "/" + icon : "";

    })
  }
}
