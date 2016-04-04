/**
 * Created by xastey on 4/4/2016.
 */


import {Injectable} from "angular2/core";
import {Http} from "angular2/http";
import {BehaviorSubject} from "rxjs/Rx";
import {DivisionItem, GearType} from "../common/models/common";
import * as _ from "lodash";
import { dashCaseToCamelCase} from "angular2/src/compiler/util";
import {asObservable} from "../common/utils";
import {Observable} from "rxjs/Observable";

class ItemStore {
  private _items:BehaviorSubject<DivisionItem[]> = new BehaviorSubject<DivisionItem[]>([]);
}
@Injectable()
export class ItemsService {

  private _bodyArmor:BehaviorSubject<DivisionItem[]> = new BehaviorSubject<DivisionItem[]>([]);

  private _basePath = "app/assets/json/";


  constructor(http:Http) {

    this.init(http);
  }

  init(http:Http) {

    let self = this;

    _.forEach(GearType, (gearType:GearType, key:string)=> {
      let subjectName = dashCaseToCamelCase(gearType);

      let subject = self["_" + subjectName] as BehaviorSubject<DivisionItem[]>;
      let url = self._basePath + gearType + "/items.json";
      http.get(url)
        .map(res=><DivisionItem[]>res.json())
        .subscribe(
          items=>subject.next(items),
          error=>console.log("Error loading", url),
          ()=> console.log("Finished loading", url)
        )
    })
  }

  getFor(gearType:GearType):Observable<DivisionItem[]> {
    switch (gearType) {
      case GearType.BodyArmor:
        return asObservable(this._bodyArmor)
    }
  }
}
