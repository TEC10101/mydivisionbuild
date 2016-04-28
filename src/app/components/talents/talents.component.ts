/**
 * Created by xastey on 4/26/2016.
 */
import {Component, Input} from "angular2/core";
import {UcFirstPipe} from "../../common/pipes/ucfirst_pipe";
import {Talent} from "./talent.model";
import {GearTalent} from "../../services/item.service";
import * as _ from "lodash";
import {EditorDirective} from "../../directives/editor";

@Component({
  selector: 'talent',
  styles: [require('./talent.component.scss')],
  template: require('./talent.component.html'),
  pipes: [UcFirstPipe],
  directives: [EditorDirective]
})
export class TalentComponent {

  @Input() talent:Talent;
  @Input() choices:GearTalent[];


  get text() {

    return _.find(this.choices, {id: this.talent.id}).template;
  }

}

@Component({
  selector: 'talents',
  styles: [` 
  .talents-wrapper {
    padding: 1px;
  }
`],
  template: require('./talents.component.html'),
  directives: [TalentComponent]
})
export class TalentsComponent {

  @Input() talents:Talent[];
  @Input() choices:GearTalent[];
}


