import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Teso13editarComponent } from './teso13editar.component';

describe('Teso13editarComponent', () => {
  let component: Teso13editarComponent;
  let fixture: ComponentFixture<Teso13editarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Teso13editarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Teso13editarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
