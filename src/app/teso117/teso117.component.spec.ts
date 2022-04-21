import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Teso117Component } from './teso117.component';

describe('Teso117Component', () => {
  let component: Teso117Component;
  let fixture: ComponentFixture<Teso117Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Teso117Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Teso117Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
