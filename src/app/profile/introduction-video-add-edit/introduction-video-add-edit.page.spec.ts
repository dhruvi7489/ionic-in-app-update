import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IntroductionVideoAddEditPage } from './introduction-video-add-edit.page';

describe('IntroductionVideoAddEditPage', () => {
  let component: IntroductionVideoAddEditPage;
  let fixture: ComponentFixture<IntroductionVideoAddEditPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IntroductionVideoAddEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IntroductionVideoAddEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
