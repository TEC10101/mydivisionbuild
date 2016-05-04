/**
 * Created by xastey on 5/3/2016.
 */
import {describe, it, expect, inject, beforeEach, beforeEachProviders} from "@angular/core/testing";
import {TestComponentBuilder} from "@angular/compiler/testing";
import {TalentComponent} from "./talents.component";
describe('TalentsComponent: component', () => {
  let tcb;
  let choices = [
    {
      id: 'reckless',
      template: 'Head %x Tail'
    },
    {
      id: 'vigirous',
      template: '%x middle %x'
    }
  ];

  let talent = {
    id: 'reckless',
    value: 0
  };
//setup
  beforeEachProviders(() => [
    TestComponentBuilder,
    TalentComponent
  ]);

  beforeEach(inject([TestComponentBuilder], _tcb => {
    tcb = _tcb;
  }));

  it('should render Talent', done => {
    tcb.createAsync(TalentComponent).then(fixture => {
        let component = <TalentComponent>fixture.componentInstance,
          element = fixture.nativeElement;

        component.talent = talent;
        component.choices = choices;
        fixture.detectChanges(); //trigger change detection
        expect(element.querySelector('label').innerText).toBe('Reckless');
        done();
      })
      .catch(e => done.fail(e));
  });


});
