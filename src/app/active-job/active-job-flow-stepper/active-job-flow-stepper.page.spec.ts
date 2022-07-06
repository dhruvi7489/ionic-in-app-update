import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ActiveJobFlowStepperPage } from './active-job-flow-stepper.page';

describe('ActiveJobFlowStepperPage', () => {
  let component: ActiveJobFlowStepperPage;
  let fixture: ComponentFixture<ActiveJobFlowStepperPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveJobFlowStepperPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ActiveJobFlowStepperPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
