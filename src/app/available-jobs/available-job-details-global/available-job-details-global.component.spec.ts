import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AvailableJobDetailsGlobalComponent } from './available-job-details-global.component';

describe('AvailableJobDetailsGlobalComponent', () => {
  let component: AvailableJobDetailsGlobalComponent;
  let fixture: ComponentFixture<AvailableJobDetailsGlobalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailableJobDetailsGlobalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AvailableJobDetailsGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
