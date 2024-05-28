import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Teso21hijoComponent } from './teso21hijo.component';

describe('Teso21hijoComponent', () => {
  let component: Teso21hijoComponent;
  let fixture: ComponentFixture<Teso21hijoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Teso21hijoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Teso21hijoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
