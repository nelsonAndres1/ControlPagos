import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisoresAutorizacionComponent } from './revisores-autorizacion.component';

describe('RevisoresAutorizacionComponent', () => {
  let component: RevisoresAutorizacionComponent;
  let fixture: ComponentFixture<RevisoresAutorizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevisoresAutorizacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevisoresAutorizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
