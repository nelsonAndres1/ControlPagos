import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Teso112Component } from './teso112.component';

describe('Teso112Component', () => {
  let component: Teso112Component;
  let fixture: ComponentFixture<Teso112Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Teso112Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Teso112Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
