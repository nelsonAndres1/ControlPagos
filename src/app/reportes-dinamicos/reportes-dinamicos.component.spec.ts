import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesDinamicosComponent } from './reportes-dinamicos.component';

describe('ReportesDinamicosComponent', () => {
  let component: ReportesDinamicosComponent;
  let fixture: ComponentFixture<ReportesDinamicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesDinamicosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportesDinamicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
