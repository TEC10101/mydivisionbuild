/**
 * Created by xastey on 4/6/2016.
 */

//http://jsfiddle.net/ARTsinn/QJSfa/
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
  NgZone
} from "angular2/core";
import {ControlValueAccessor, NgControl, FORM_DIRECTIVES} from "angular2/common";
import * as _ from "lodash";
import {AttributeFormat} from "../../common/models/common";
import {AttributePipe} from "../attributes/attribute_pipe";


//http://jbavari.github.io/blog/2015/10/21/angular-2-and-ng-model/
//https://github.com/driftyco/ionic/blob/2.0/ionic/components/searchbar/searchbar.ts
@Directive({
  selector: '.auto-resize-input'

})
export class AutoResizeInput {
  @HostListener('input', ['$event'])
  /**
   * @private
   * Don't send the input's input event
   */
  private stopInput(ev) {
    ev.preventDefault();
    ev.stopPropagation();
  }

  nativeElement:any;

  constructor(elementRef:ElementRef) {

    this.nativeElement = elementRef.nativeElement;
  }


}

@Component({
  selector: 'auto-resize-input',
  template: `<div>
        <label  [ngClass]="{hidden:editing}" (click)="onClicked()">+{{value|attribute:format}}</label>
        <input [ngClass]="{hidden:!editing}" autofocus type="text"  pattern="\d*" maxlength="4" [value]="value" (input)="onInputChanged($event)"  (focus)="onInputFocused()" class="auto-resize-input" (blur)="onInputBlurred()"/>
    </div>
     `,
  pipes: [AttributePipe],
  directives: [FORM_DIRECTIVES, AutoResizeInput],
  styles: [require('./auto-resize-input.component.scss')]
})
export class AutoResizeInputComponent implements ControlValueAccessor,OnInit {


  @ViewChild(AutoResizeInput) autoResizeInput:AutoResizeInput;
  @Input() ngModel:string;
  @Input() defaultWidth:number = 12;
  @Input() resizeIncrement:number = 10;
  @Input() length:number;
  @Input() inputType:string;
  @Input() format:AttributeFormat;
  value:string;

  elementRef:ElementRef;
  placeholderContentName:string;
  editing:boolean = false;
  @Output() input = new EventEmitter<string>();
  ngZone:NgZone;


  constructor(elementRef:ElementRef, ngControl:NgControl, ngZone:NgZone) {
    ngControl.valueAccessor = this;
    this.elementRef = elementRef;
    this.ngZone = ngZone;

  }

  private getElementWidth(nativeElement:any):number {

    return nativeElement.offsetWidth;
  }

  private setElementWidth(nativeElement:any, width:number) {
    nativeElement.style.width = width + "px";
  }

  onClicked() {


    this.editing = true;

    let inputElement = this.autoResizeInput.nativeElement;
    this.ngZone.run(()=> {
      inputElement.focus();
      inputElement.select();

    })

  }

  onInputChanged(event) {
    let value = event.target.value;
    if (value.length > this.length) {
      value = value.substr(0, this.length);
    }
    if (this.value != value) {
      this.value = value;
      this.input.emit(this.value);
      this.resize(this.resizeIncrement);

    }


  }

  onInputFocused() {
    let inputElement = this.autoResizeInput.nativeElement;
    /*if (this.getElementWidth(inputElement) < this.defaultWidth) {
     this.setElementWidth(inputElement, this.defaultWidth);
     } */
  }

  onInputBlurred() {
    this.resize(this.resizeIncrement);
    this.editing = false;
  }

  onInputKeydown(event) {
    if (event.target.value.length > this.length) {
      event.target.value = event.target.value.substr(0, this.length);
    }
    // this.resize(this.resizeIncrement);
  }


  private resize(pad) {
    //pad = (this.value.length >= this.length) ? 0 : pad;

    let div = document.createElement("div");
    div.className = "placeholder";
    div.innerHTML = this.value;
    div.setAttribute(this.placeholderContentName, '');
    let parentNode = this.elementRef.nativeElement;
    parentNode.appendChild(div);


    this.setElementWidth(this.autoResizeInput.nativeElement,
      ((this.value.length + 1) * pad) + 2);
    parentNode.removeChild(div);

  }


  ngOnInit():any {

    this.value = this.ngModel;
    this.onChange(this.value);
    let attributes = this.elementRef.nativeElement.attributes;
    let attr = _.find(attributes, (attr:any)=>attr.nodeName.indexOf("_nghost-") != -1);

    this.placeholderContentName = attr.nodeName.replace('_nghost-', '_ngcontent-');

    //_nghost-juu-

  }

  /**
   * @private
   * Write a new value to the element.
   */
  writeValue(value:any) {
    this.value = value;
  }

  /**
   * @private
   */
  onChange = (_:any) => {
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
  registerOnChange(fn:(_:any) => {}):void {
    this.onChange = fn;
  }

  /**
   * @private
   * Set the function to be called when the control receives a touch event.
   */
  registerOnTouched(fn:() => {}):void {
    this.onTouched = fn;
  }
}

