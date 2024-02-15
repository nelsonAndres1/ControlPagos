import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Teso13modalComponent } from './teso13modal.component';

describe('Teso13modalComponent', () => {
  let component: Teso13modalComponent;
  let fixture: ComponentFixture<Teso13modalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Teso13modalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Teso13modalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
