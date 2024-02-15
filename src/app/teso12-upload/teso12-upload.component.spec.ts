import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Teso12UploadComponent } from './teso12-upload.component';

describe('Teso12UploadComponent', () => {
  let component: Teso12UploadComponent;
  let fixture: ComponentFixture<Teso12UploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Teso12UploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Teso12UploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
