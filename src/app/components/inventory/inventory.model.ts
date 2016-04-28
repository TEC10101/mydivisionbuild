/**
 * Created by xastey on 4/22/2016.
 */

import {Gear} from "../gear-overview/gear.model";
import {GenderType} from "../../common/models/common";
export class Inventory {


  gender:GenderType;
  primary:any;
  secondary:any;
  sidearm:any;

  bodyArmor:Gear;
  mask:Gear;
  kneePads:Gear;
  backPack:Gear;
  gloves:Gear;
  holster:Gear;
}
