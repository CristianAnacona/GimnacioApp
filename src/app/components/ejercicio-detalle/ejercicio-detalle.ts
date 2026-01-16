import { AuthService } from '../../services/auth';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CATALOGO_EJERCICIOS } from '../../../data/ejercicios-catalogo';

@Component({
  selector: 'app-ejercicio-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ejercicio-detalle.html',
  styleUrl: './ejercicio-detalle.css',
})
export class EjercicioDetalle implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public AuthService = inject(AuthService);
  ejercicio: any = null;
  role: string = '';

  ngOnInit() {
    const storedRole = localStorage.getItem('role');
    this.role = storedRole ? storedRole.toLowerCase().trim() : 'socio';
    // Capturamos el nombre desde la URL
    const nombreEj = this.route.snapshot.paramMap.get('nombre');

    
    if (nombreEj) {
      // Buscamos el objeto completo en el catálogo
      this.ejercicio = CATALOGO_EJERCICIOS.find(
        e => e.nombre.toLowerCase() === nombreEj.toLowerCase()
      );
    }
  }
  volver(){
    
    if (this.role === 'admin') {
      this.router.navigate(['/admin/rutinas']); 
    } else {
      this.router.navigate(['/socio/mi-rutina']); 
    }
  }
}
