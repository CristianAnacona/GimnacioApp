import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CATALOGO_EJERCICIOS } from '../../../../data/ejercicios-catalogo';

@Component({
  selector: 'app-ejercicio-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ejercicio-detalle.html',
  styleUrl: './ejercicio-detalle.css',
})
export class EjercicioDetalle implements OnInit {
  private route = inject(ActivatedRoute);
  ejercicio: any = null;

  ngOnInit() {
    // Capturamos el nombre desde la URL
    const nombreEj = this.route.snapshot.paramMap.get('nombre');
    
    if (nombreEj) {
      // Buscamos el objeto completo en el catálogo
      this.ejercicio = CATALOGO_EJERCICIOS.find(
        e => e.nombre.toLowerCase() === nombreEj.toLowerCase()
      );
    }
  }
}
