import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableroTeso13Component } from './tablero-teso13.component';

describe('TableroTeso13Component', () => {
  let component: TableroTeso13Component;
  let fixture: ComponentFixture<TableroTeso13Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableroTeso13Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableroTeso13Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
