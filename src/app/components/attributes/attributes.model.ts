import {AttributeType} from "../../common/models/common";
/**
 * Created by xastey on 4/3/2016.
 */


export class Attributes {
  major:Attribute[];
  minor:Attribute[];
  skill:Attribute[];
}

export type AttributeFormat = "percent" | "number";
export const AttributeFormat = {
  PERCENT: "percent" as AttributeFormat,
  NUMBER: "number" as AttributeFormat
};
export class Attribute {
  title:string;
  value:number;

  format:AttributeFormat;
}
