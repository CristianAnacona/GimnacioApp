
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../services/auth';
import { CommonModule } from '@angular/common';

import { DIAS_RUTINA } from '../../../../data/ejercicios-catalogo';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mi-rutina',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mi-rutina.html',
  styleUrl: './mi-rutina.css',
})

export class MiRutina implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);
  // Asegúrate de que NO tenga 'private' adelante
  rutinas: any[] = [];
  username = '';
hasDay = (r: any) => r.dia === this.diaActivo;
  diasRutina:string[]= Object.values(DIAS_RUTINA);
 diaActivo: string = this.diasRutina[0];

  ngOnInit() {
    // Definimos el día activo como el día real de la semana
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    this.diaActivo = diasSemana[new Date().getDay()];

    const data = localStorage.getItem('usuario');
    if (data) {
      const usuario = JSON.parse(data);
      const idSocio = usuario._id || usuario.id;
      this.username = usuario.nombre || 'Socio';

      if (idSocio) {
        this.authService.obtenerRutina(idSocio).subscribe({
          next: (res: any) => {
            // Asignamos directamente a la variable de la clase
            if (Array.isArray(res) && res.length > 0) {
              this.rutinas = res;
            } else {
              this.rutinas = [res];
            }
            this.cdr.detectChanges();
          },
          error: (err) => console.error(err)
        });
      }
    }
  }

  // Función para cambiar el día al hacer clic
  cambiarDia(dia: string) {
    this.diaActivo = dia;
    this.cdr.detectChanges();
  }

  // Getter para obtener solo la rutina del día seleccionado
  get rutinaActual() {
    return this.rutinas.find(r => r.dia === this.diaActivo);
  }
}
