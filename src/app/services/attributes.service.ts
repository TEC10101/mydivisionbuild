import {Injectable, OnInit} from "angular2/core";
import {
  GearType, AttributeType, MajorAttribute, GearSupport, IAttribute,
  MinorAttribute
} from "../common/models/common";
import {Http} from "angular2/http";
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/startWith';
/**
 * Created by xastey on 4/3/2016.
 */


type AttributeObservable = Observable<IAttribute[]>
type AttributeObserver=Observer<IAttribute[]>;

interface RawAttribute {
  name:string;
  support:GearSupport[];
}

class AttributeStore {

  major$:AttributeObservable;
  minor$:AttributeObservable;
  private _major:Observer<IAttribute[]>;

  private _minor:Observer<IAttribute[]>;
  private _http:Http;
  private _basePath:string;
  private _gearType:GearType;

  private static convertToMajor(raw:RawAttribute):IAttribute {
    return new MajorAttribute(raw.name, raw.support)
  }

  private static convertToMinor(raw:RawAttribute):IAttribute {
    return new MinorAttribute(raw.name, raw.support)
  }

  constructor(gearType:GearType, http:Http) {
    this._basePath = "app/assets/json/";
    this._http = http;
    this._gearType = gearType;

    this.major$ = new Observable(observer=>this._major = observer)
      .startWith([]).share();

    this.minor$ = new Observable(observer =>this._minor = observer)
      .startWith([]).share();
    this.init();

  }

  init() {
    let attributeTypes = [AttributeType.MAJOR];

    attributeTypes.forEach(attributeType=> {


      let url = this._generateUrl(attributeType);
      this[attributeType + '$'].subscribe(()=> {
      });
      let observer = this["_" + attributeType] as AttributeObserver;
      console.log(observer);

      let self = this;
      let callback = attributeType == AttributeType.MAJOR ? AttributeStore.convertToMajor : AttributeStore.convertToMinor;
      this._fetch(url, callback).subscribe(
        data => {


          observer.next(data);
        },
        err=> console.error(err),
        () => console.log("Finished loading (", this._gearType, ":", attributeType, ")")
      );
    });

  }

  fetch(attributeType:AttributeType):AttributeObservable {
    return attributeType == AttributeType.MAJOR ? this.major$ : this.minor$;
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

@Injectable()
export class AttributesService {


  private _bodyArmor:AttributeStore;
  private _http:Http;

  constructor(http:Http) {
    this._http = http;
    this._bodyArmor = new AttributeStore(GearType.BodyArmor, this._http);


  }


  getFor(gearType:GearType, attributeType:AttributeType):AttributeObservable {
    switch (gearType) {
      case GearType.BodyArmor:
        return this._bodyArmor.fetch(attributeType)
    }
  }


}
