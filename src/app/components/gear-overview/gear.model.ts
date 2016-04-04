/**
 * Created by xastey on 4/3/2016.
 */
import {Stats} from "../stats-display/stats-display";
import {Rarity, GearType} from "../../common/models/common";
import {Attributes} from "../attributes/attributes.model";


export class Gear {
  rarity:Rarity;
  type:GearType;
  title:string;
  
  level:number;
  stats:Stats;
  armor:number;
  attributes:Attributes;
  modslots:Array<any>;
}
