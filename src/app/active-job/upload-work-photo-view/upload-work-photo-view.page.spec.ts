import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UploadWorkPhotoViewPage } from './upload-work-photo-view.page';

describe('UploadWorkPhotoViewPage', () => {
  let component: UploadWorkPhotoViewPage;
  let fixture: ComponentFixture<UploadWorkPhotoViewPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadWorkPhotoViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UploadWorkPhotoViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
