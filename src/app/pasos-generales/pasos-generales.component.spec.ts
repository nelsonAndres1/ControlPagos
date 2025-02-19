import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasosGeneralesComponent } from './pasos-generales.component';

describe('PasosGeneralesComponent', () => {
  let component: PasosGeneralesComponent;
  let fixture: ComponentFixture<PasosGeneralesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasosGeneralesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasosGeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
