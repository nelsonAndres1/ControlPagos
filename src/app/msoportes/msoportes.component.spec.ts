import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsoportesComponent } from './msoportes.component';

describe('MsoportesComponent', () => {
  let component: MsoportesComponent;
  let fixture: ComponentFixture<MsoportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsoportesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsoportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
