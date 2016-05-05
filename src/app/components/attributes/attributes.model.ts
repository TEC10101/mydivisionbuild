/**
 * Created by xastey on 4/3/2016.
 */


export interface Attributes {
  major?: Attribute[];
  minor?: Attribute[];
  skill?: Attribute[];
}


export class Attribute {
  id: number;
  value: number;

}
