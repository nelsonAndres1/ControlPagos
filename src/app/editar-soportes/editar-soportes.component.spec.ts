import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarSoportesComponent } from './editar-soportes.component';

describe('EditarSoportesComponent', () => {
  let component: EditarSoportesComponent;
  let fixture: ComponentFixture<EditarSoportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarSoportesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarSoportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
