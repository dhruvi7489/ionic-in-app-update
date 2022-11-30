import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ActiveJobMarkAttendancePage } from './active-job-mark-attendance.page';

describe('ActiveJobMarkAttendancePage', () => {
  let component: ActiveJobMarkAttendancePage;
  let fixture: ComponentFixture<ActiveJobMarkAttendancePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveJobMarkAttendancePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ActiveJobMarkAttendancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
