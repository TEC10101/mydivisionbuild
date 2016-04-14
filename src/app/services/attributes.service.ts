import {Injectable} from "angular2/core";
import {GearType, AttributeType, GearAttribute} from "../common/models/common";
import {Http} from "angular2/http";
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
/*

 type AttributeObserver=Observer<IAttribute[]>;

 interface RawAttribute {
 name:string;
 id:number;
 format:ValueFormat;
 support:GearSupport[];
 }

 class AttributeStore {


 private _major:BehaviorSubject<IAttribute[]> = new BehaviorSubject<IAttribute[]>([]);


 private _minor:BehaviorSubject<IAttribute[]> = new BehaviorSubject<IAttribute[]>([]);

 private _http:Http;
 private _basePath:string;
 private _gearType:GearType;

 private static convertToMajor(raw:RawAttribute):IAttribute {
 return new MajorAttribute(raw.id, raw.name, raw.format, raw.support)
 }

 private static convertToMinor(raw:RawAttribute):IAttribute {
 return new MinorAttribute(raw.id, raw.name, raw.format, raw.support)
 }

 constructor(gearType:GearType, http:Http) {
 this._basePath = "app/assets/json/";
 this._http = http;
 this._gearType = gearType;

 this.init();

 }

 init() {
 let attributeTypes = [AttributeType.MAJOR];

 attributeTypes.forEach(attributeType=> {


 let url = this._generateUrl(attributeType);

 let subject = this["_" + attributeType] as BehaviorSubject<IAttribute[]>;


 let self = this;
 let callback = attributeType == AttributeType.MAJOR ? AttributeStore.convertToMajor : AttributeStore.convertToMinor;
 let subscription = this._fetch(url, callback).subscribe(
 data => {


 subject.next(data);
 subscription.unsubscribe();
 },
 err=> console.error(err),
 () => console.log("Finished loading (", this._gearType, ":", attributeType, ")")
 );
 });

 }

 fetch(attributeType:AttributeType):AttributeObservable {
 let subject = attributeType == AttributeType.MAJOR ? this._major : this._minor;
 return new Observable(fn=> subject.subscribe(fn))
 }

 private _generateUrl(attributeType:AttributeType) {
 return this._basePath + this._gearType + "/" + attributeType + ".json";
 }

 private _fetch(url, callback:(raw:RawAttribute)=>IAttribute):AttributeObservable {
 return this._http.get(url)
 .map(res=><RawAttribute[]>res.json())
 .map(res=>res.map(callback))
 }
 }

 */
@Injectable()
export class AttributesService {


  private _http:Http;

  private _attributes = new BehaviorSubject<GearAttribute[]>([]);

  constructor(http:Http) {
    this._http = http;
    let basePath = "app/assets/json/attributes.json";

    http.get(basePath)
      .map(res=><GearAttribute[]>res.json())
      .subscribe(
        attributes =>this._attributes.next(attributes),
        err=> console.error(err),
        () => console.log("Finished loading attributes")
      );

    // this._bodyArmor = new AttributeStore(GearType.BodyArmor, this._http);


  }

  get attributes() {
    return asObservable(this._attributes.first((attrs, idx, obs)=> !!attrs.length));
  }


  private static defaultFilterProvider(gearType:GearType, attributeType:AttributeType) {
    return {type: attributeType, supports: [gearType]}
  }

  private static skillFilterProvider(gearType:GearType) {
    return {type: AttributeType.SKILL, skill: true, supports: [gearType]}
  }

  getFor(gearType:GearType, attributeType:AttributeType):AttributeObservable {

    let providerName = attributeType + "FilterProvider";
    let filterProvider = AttributesService[providerName] ? AttributesService[providerName] : AttributesService.defaultFilterProvider;
    return asObservable(this._attributes.map(attrs=> {
      return _.filter(attrs, filterProvider(gearType, attributeType))
    }))
  }


}
