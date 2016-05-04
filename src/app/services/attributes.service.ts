import {Injectable} from "@angular/core";
import {GearType, AttributeType, GearAttribute} from "../common/models/common";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/share";
import "rxjs/add/operator/startWith";
import {BehaviorSubject} from "rxjs/Rx";
import {asObservable} from "../common/utils";
import * as _ from "lodash";
/**
 * Created by xastey on 4/3/2016.
 */
export type AttributeObservable = Observable<GearAttribute[]>

@Injectable()
export class AttributesService {


  private _http: Http;

  private _attributes = new BehaviorSubject<GearAttribute[]>([]);

  private static defaultFilterProvider(gearType: GearType, attributeType: AttributeType) {
    return {type: attributeType, supports: [gearType]};
  }

  private static skillFilterProvider(gearType: GearType) {
    return {type: AttributeType.SKILL, skill: true, supports: [gearType]};
  }

  constructor(http: Http) {
    this._http = http;
    let basePath = 'app/assets/json/attributes.json';

    http.get(basePath)
      .map(res => <GearAttribute[]>res.json())
      .subscribe(
        attributes => this._attributes.next(attributes),
        err => console.error(err),
        () => console.log('Finished loading attributes')
      );

    // this._bodyArmor = new AttributeStore(GearType.BodyArmor, this._http);


  }

  get attributes() {
    return asObservable(this._attributes.first((attrs, idx, obs) => !!attrs.length));
  }


  getFor(gearType: GearType, attributeType: AttributeType): AttributeObservable {

    let providerName = attributeType + 'FilterProvider';
    let filterProvider = AttributesService[providerName]
      ? AttributesService[providerName] : AttributesService.defaultFilterProvider;
    return asObservable(this._attributes.map(attrs => {
      return _.filter(attrs, filterProvider(gearType, attributeType));
    }));
  }


}
