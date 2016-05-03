/**
 * Created by xastey on 4/26/2016.
 */
import {Component, Input, DynamicComponentLoader, ElementRef, OnInit, ComponentRef} from "angular2/core";
import {UcFirstPipe} from "../../common/pipes/ucfirst_pipe";
import {Talent} from "./talent.model";
import {GearTalent} from "../../services/item.service";
import * as _ from "lodash";
import {EditorDirective} from "../../directives/editor";
import {AutoResizeInputComponent} from "../auto-resize-input/auto-resize-input.component";

const TEMPLATE_INPUT_MARKER = "x%";
const TEMPLATE_INPUT_MARKER_REXP = new RegExp('(' + TEMPLATE_INPUT_MARKER + ')');
const TALENT_INPUT_TEMPLATE = ` <auto-resize-input [length]="2" inputType="number" [format]="percent"
                           [(ngModel)]="talent.value"
        ></auto-resize-input>`;
@Component({
  selector: 'talent',
  styles: [require('./talent.component.scss')],
  template: require('./talent.component.html'),
  pipes: [UcFirstPipe],
  directives: [EditorDirective, AutoResizeInputComponent]
})

export class TalentComponent implements OnInit {

  @Input() talent:Talent;
  @Input() choices:GearTalent[];

  _previousTalentId:string;
  _componentRef:ComponentRef;


  constructor(private _loader:DynamicComponentLoader, private _elementRef:ElementRef) {
  }


  ngOnInit():any {
    // ensure that there is a value for the talent even if its 0
    if (!this.talent.value) this.talent.value = 0;
    if (!this.talent.id) {
      this.talent.id = this.choices[0].id;
    }
    this.renderDescription(this.talent.id);
  }

  /**
   * This method was created to add the ability of dynamicallyy generating the correct
   * template for the talent description. Angular2 doesn't allow passing a function to say
   *  Component.template so the use of  DynamicComponentLoader is needed.
   *  Also using a ngFor with children set to display based off an ngIf statement will cause
   *  elements to not float correct due to angular having to wrap each directive in a shadow
   *  div/template. Using DynamicComponentLoader allows us to inline our input component
   *  right with text and display it as if it was one string of text
   *
   *  for 2.0.0-beta.16+ refer to this commit :
   *  https://github.com/angular/angular/commit/efbd446d18e6e0380beafcad6e94a7751d788623
   * @param id
   */
  renderDescription(id:string) {

    if (this._previousTalentId == id) return;
    this._previousTalentId = id;
    if (this._componentRef) this._componentRef.dispose();

    let text = _.find(this.choices, {id: id}).template;
    let template = text.split(TEMPLATE_INPUT_MARKER_REXP)
      .map(part=> part == TEMPLATE_INPUT_MARKER ? TALENT_INPUT_TEMPLATE : part).join('');

    this._loader.loadIntoLocation(
      TalentComponent.toComponent(template, this.talent),
      this._elementRef,
      'description'
    ).then(ref => this._componentRef = ref)
  }


  static toComponent(template, talent) {
    let directives = [AutoResizeInputComponent];
    @Component({
      selector: 'talent-template',
      template: template,
      styles: [
        `:host auto-resize-input{
        display:inline-block;
        }
        :host label{
          margin-right:0px;
        }
        :host input{
        color:#fff;
        font-weight: normal;
        }`
      ],
      directives: directives
    })
    class TalentTemplateComponent {
      @Input() talent;

      constructor() {
        this.talent = talent;
      }
    }
    return TalentTemplateComponent;
  }

  onTalentChanged(id) {
    this.renderDescription(id);
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






