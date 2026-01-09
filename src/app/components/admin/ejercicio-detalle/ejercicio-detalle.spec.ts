import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjercicioDetalle } from './ejercicio-detalle';

describe('EjercicioDetalle', () => {
  let component: EjercicioDetalle;
  let fixture: ComponentFixture<EjercicioDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EjercicioDetalle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EjercicioDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
