import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Teso1117Component } from './teso1117.component';

describe('Teso1117Component', () => {
  let component: Teso1117Component;
  let fixture: ComponentFixture<Teso1117Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Teso1117Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Teso1117Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
