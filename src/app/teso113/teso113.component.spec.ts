import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Teso113Component } from './teso113.component';

describe('Teso113Component', () => {
  let component: Teso113Component;
  let fixture: ComponentFixture<Teso113Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Teso113Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Teso113Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
