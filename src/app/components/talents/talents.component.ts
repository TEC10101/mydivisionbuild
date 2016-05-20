/**
 * Created by Keyston on 4/26/2016.
 */
import {
  Component,
  Input,
  DynamicComponentLoader,
  ElementRef,
  OnInit,
  ComponentRef,
  ViewChild,
  ViewContainerRef,
  AfterViewInit
} from '@angular/core';
import {UcFirstPipe} from '../../common/pipes/ucfirst_pipe';
import {Talent} from './talent.model';
import * as _ from 'lodash/index';
import {EditorDirective} from '../../directives/editor';
import {AutoResizeInputComponent} from '../auto-resize-input/auto-resize-input.component';
import {ValueFormat, ItemTalent} from '../../common/models/common';
import {BooleanConverter, InputConverter} from '../../common/converters';
import {ItemsService} from '../../services/item.service';
import {AttributeMeta} from '../attributes/attribute.component';
import {BuildStatsService, InventoryCalculator} from '../../services/build-stats.service';


const TEMPLATE_INPUT_PERCENT_MARKER = 'x%';
const TEMPLATE_INPUT_NUMBER_MARKER = '#';
const TEMPLATE_INPUT_MARKER_REXP =
  new RegExp(`(${TEMPLATE_INPUT_PERCENT_MARKER}|${TEMPLATE_INPUT_NUMBER_MARKER})`);

const INPUT_FORMAT_MARKER = '%format%';

const TALENT_INPUT_FORMAT = (function () {

  let o = {};
  o[TEMPLATE_INPUT_PERCENT_MARKER] = ValueFormat.PERCENT;
  o[TEMPLATE_INPUT_NUMBER_MARKER] = ValueFormat.NUMBER;
  return o;
})();


const TALENT_INPUT_TEMPLATE = ` <auto-resize-input [length]='2' 
                            inputType='number' [format]='%format%'
                            (input)="onTalentValueChanged($event)"
                           [(ngModel)]='talent.value'
        ></auto-resize-input>`;

interface TalentRequirement {
  id: string;
  value: number;

}
@Component({
  selector: 'talent',
  styles: [require('./talent.component.scss')],
  template: require('./talent.component.html'),
  pipes: [UcFirstPipe],
  directives: [EditorDirective, AutoResizeInputComponent]
})
export class TalentComponent implements OnInit, AfterViewInit {


  @Input() talent: Talent;
  @Input() choices: ItemTalent[];
  @Input('has-image')
  @InputConverter(BooleanConverter)
  hasImage: boolean;

  _previousTalentId: string;
  _componentRef: ComponentRef<any>;
  _metadata: AttributeMeta;

  @ViewChild('description', {read: ViewContainerRef})
  _descriptionContainerRef: ViewContainerRef;

  _selectedChoice: ItemTalent;

  _calc: InventoryCalculator;
  _lastScore: number;


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
      talent;

      constructor() {
        this.talent = talent;
      }

      onTalentValueChanged(value) {
        this.talent.value = value;
      }


    }
    return TalentTemplateComponent;
  }

  constructor(private _loader: DynamicComponentLoader,
              private _elementRef: ElementRef,
              private _itemsService: ItemsService,
              private buildStatsService: BuildStatsService) {

    this._calc = buildStatsService.instance;
  }


  ngOnInit(): any {
    // ensure that there is a value for the talent even if its 0

    if (!this.talent.id) {
      this.talent.id = this.choices[0].id;
    }

    if (!this.talent.value && this._metadata)
      this._updateTalentDefaultValue();


  }

  get requirements() {
    let selectedChoices = _.find(this.choices, {id: this.talent.id});

    if (selectedChoices && selectedChoices.requirements) {
      let requirementsByScore = selectedChoices
          .requirements[this._metadata.score] || void 0;
      return requirementsByScore
        ? _.reduce(['firearms', 'stamina', 'electronics'],
        (o, stat) => {
          if (requirementsByScore[stat]) {
            let value = requirementsByScore[stat];
            let statValue = this._calc[stat];
            o.push({
              id: stat,
              value: value,
              active: statValue >= value
            });
          }
          return o;
        }, []) : [];
    }
    return [];
  }

  @Input()
  set metadata(value) {
    let updateDefaultValue = !this._metadata || (value && value.score !== this._metadata.score);
    this._metadata = value;
    if (updateDefaultValue) {
      this._updateTalentDefaultValue();
    }
  }

  get metadata() {
    return this._metadata;
  }

  _updateTalentDefaultValue() {

    let talent = this._selectedChoice = _.find(this.choices, {id: this.talent.id});

    let defaultValue = talent.defaultValues
      ? talent.defaultValues[this.metadata.score] : 0;
    this.talent.value = defaultValue || 0;

  }

  ngAfterViewInit() {
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
  renderDescription(id: string) {


    if (this._previousTalentId === id) return;
    this._previousTalentId = id;
    if (this._componentRef) this._componentRef.destroy();

    let text = _.find(this.choices, {id: id}).template;
    let template = text.split(TEMPLATE_INPUT_MARKER_REXP)
      .map((part: string) => {
        if (!part) return '';
        let matches = part.match(TEMPLATE_INPUT_MARKER_REXP);
        let format = matches ? TALENT_INPUT_FORMAT[matches.pop()] : false;
        return format ? TALENT_INPUT_TEMPLATE.replace(INPUT_FORMAT_MARKER, format) : part;
      }).join('');

    this._loader.loadNextToLocation(
      TalentComponent.toComponent(template, this.talent),
      this._descriptionContainerRef
    ).then(ref => this._componentRef = ref);
  }


  onTalentChanged(id) {
    this.renderDescription(id);
  }

  onTalentUnlockedChanged(unlocked) {
    this.talent.unlocked = unlocked;
  }

  get talentImage() {
    return this._itemsService
      .talentImageResolve(this.talent.id).primary;
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

  @Input() talents: Talent[];
  @Input() choices: ItemTalent[];
  @Input() metadata: AttributeMeta;

  @Input('has-image')
  @InputConverter(BooleanConverter) hasImage: boolean;
}






