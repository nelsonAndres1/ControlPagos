import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Teso116Component } from './teso116.component';

describe('Teso116Component', () => {
  let component: Teso116Component;
  let fixture: ComponentFixture<Teso116Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Teso116Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Teso116Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
