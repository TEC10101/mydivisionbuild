/**
 * Created by xastey on 4/6/2016.
 */

// http://jsfiddle.net/ARTsinn/QJSfa/
import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnInit,
  Directive,
  HostListener,
  ElementRef,
  ViewChild,
  NgZone,
  OnDestroy
} from '@angular/core';
import {ControlValueAccessor, NgControl, FORM_DIRECTIVES} from '@angular/common';
import * as _ from 'lodash/index';
import {ValueFormat} from '../../common/models/common';
import {AttributePipe} from '../attributes/attribute.pipe';
import {EditorService} from '../../services/editor-service';
import {Subscription} from 'rxjs/Subscription';
import {InputConverter, NumberConverter} from '../../common/converters';


// http://jbavari.github.io/blog/2015/10/21/angular-2-and-ng-model/
// https://github.com/driftyco/ionic/blob/2.0/ionic/components/searchbar/searchbar.ts
@Directive({
  selector: '.auto-resize-input'

})
export class AutoResizeInput {
  @HostListener('input', ['$event'])
  @HostListener('change', ['$event'])
  nativeElement: any;


  constructor(elementRef: ElementRef) {

    this.nativeElement = elementRef.nativeElement;
  }

  /**
   * @private
   * Don't send the input's input event
   */
  private stopInput(ev) {
    ev.preventDefault();
    ev.stopPropagation();
  }


}

@Component({
  selector: 'auto-resize-input',
  template: `<div [ngClass]="{'edit-mode':allowEditing}" class='clearfix'>
        <label  [ngClass]='{hidden:editing}' (click)='onClicked()'>
          {{prepend}}{{value|attribute:format}}
        </label>
        <input [ngClass]='{hidden:!editing}' autofocus type='number'
         min="0" max="9999"
         [attr.step]="numberStep" [attr.size]='length' [value]='value' 
         (input)='onInputChanged($event)'  (focus)='onInputFocused()' 
         class='auto-resize-input' (blur)='onInputBlurred()'/>
    </div>
     `,
  pipes: [AttributePipe],
  directives: [FORM_DIRECTIVES, AutoResizeInput],
  styles: [require('./auto-resize-input.component.scss')]
})
export class AutoResizeInputComponent implements ControlValueAccessor, OnInit, OnDestroy {


  @ViewChild(AutoResizeInput) autoResizeInput: AutoResizeInput;
  @Input() ngModel: string;

  @Input('resize-increment')
  @InputConverter(NumberConverter) resizeIncrement: number = 10;
  @Input() length: number = 4;
  @Input() inputType: string;
  @Input() format: ValueFormat;
  @Input() prepend: string = '+';
  value: string;

  elementRef: ElementRef;
  placeholderContentName: string;
  editing: boolean = false;
  @Output() input = new EventEmitter<string>();
  ngZone: NgZone;
  allowEditing: boolean;

  private _editorSubscription: Subscription;

  constructor(elementRef: ElementRef, ngControl: NgControl, ngZone: NgZone,
              private _editorService: EditorService) {
    ngControl.valueAccessor = this;
    this.elementRef = elementRef;
    this.ngZone = ngZone;
    this._editorSubscription = this._editorService.subscribe((value) => this.allowEditing = value);

  }

  get numberStep() {
    return this.format === ValueFormat.PERCENT ? '0.5' : '1';
  }

  ngOnInit(): any {

    this.value = this.ngModel;
    this.onChange(this.value);
    let attributes = this.elementRef.nativeElement.attributes;
    let nodeName = _.find(attributes, (attr: any) => attr.nodeName.indexOf('_nghost-') !== -1).nodeName;

    this.placeholderContentName = nodeName.replace('_nghost-', '_ngcontent-');

    // _nghost-juu-

  }


  ngOnDestroy(): any {
    this._editorSubscription.unsubscribe();
  }

  /**
   * @private
   * Write a new value to the element.
   */
  writeValue(value: any) {
    this.value = value;
  }

  /**
   * @private
   */
  onChange = (_: any) => {
  };

  /**
   * @private
   */
  onTouched = () => {
  };

  /**
   * @private
   * Set the function to be called when the control receives a change event.
   */
  registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  /**
   * @private
   * Set the function to be called when the control receives a touch event.
   */
  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }


  onClicked() {

    if (this._editorService.state) {


      this.editing = true;

      let inputElement = this.autoResizeInput.nativeElement;
      let self = this;
      this.ngZone.run(() => {
        inputElement.focus();
        inputElement.select();
        self.resize();

      });
    }

  }

  onInputChanged(event) {
    let value = event.target.value;
    if (value.length > this.length) {
      value = value.substr(0, this.length);
    }
    if (this.value !== value) {
      this.value = value;
      this.input.emit(this.value);
      this.resize();

    }


  }

  onInputFocused() {

  }

  onInputBlurred() {
    this.resize();
    this.editing = false;
  }

  onInputKeydown(event) {
    if (event.target.value.length > this.length) {
      event.target.value = event.target.value.substr(0, this.length);
    }
    // this.resize(this.resizeIncrement);
  }

  private getElementWidth(nativeElement: any): number {

    return nativeElement.offsetWidth;
  }

  private setElementWidth(nativeElement: any, width: number) {
    nativeElement.style.width = width + 15 + 'px';
  }


  private resize() {
    /* pad = (this.value.length >= this.length) ? 0 : pad;

     let div = document.createElement('div');
     div.className = 'placeholder';
     div.innerHTML = this.value;
     div.setAttribute(this.placeholderContentName, '');
     let parentNode = this.elementRef.nativeElement;
     parentNode.appendChild(div);
     */

    // convert to string
    let value = this.value + '';
    this.setElementWidth(this.autoResizeInput.nativeElement,
      ((value.length + 1) * this.resizeIncrement) + 2);
    // parentNode.removeChild(div);

  }


}

