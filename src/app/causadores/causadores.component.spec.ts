import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CausadoresComponent } from './causadores.component';

describe('CausadoresComponent', () => {
  let component: CausadoresComponent;
  let fixture: ComponentFixture<CausadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CausadoresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CausadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
