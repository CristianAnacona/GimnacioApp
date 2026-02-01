

import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../services/auth';
import { CommonModule } from '@angular/common';

import { DIAS_RUTINA } from '../../../../data/ejercicios-catalogo';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

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
  rutinaActual: any = null;
  username = '';
  hasDay = (r: any) => r.dia === this.diaActivo;
  diasRutina: string[] = Object.values(DIAS_RUTINA);
  diaActivo: string = this.diasRutina[0];
  rutina: any;


  constructor(private http: HttpClient) { }


  scrollToActiveDay() {
    setTimeout(() => {
      const activeBtn = document.getElementById('btn-' + this.diaActivo);
      if (activeBtn) {
        activeBtn.scrollIntoView({
          behavior: 'smooth', // Hace que el movimiento sea suave y no brusco
          block: 'nearest',
          inline: 'center'    // ¡Esta es la clave para centrarlo!
        });
      }
    }, 200); // Pequeño retraso para asegurar que el HTML ya cargó
  }

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
            this.rutinas = Array.isArray(res) ? res : [res];
            this.buscarRutinaDelDia(this.diaActivo);
            this.cdr.detectChanges();
            this.scrollToActiveDay();
          },
          error: (err) => console.error(err)
        });
      }
    }
  }
  buscarRutinaDelDia(dia: string) {
    if (this.rutinas && this.rutinas.length > 0) {
      // Usamos .toLowerCase() en ambos lados para que coincidan siempre
      this.rutinaActual = this.rutinas.find(r =>
        r.dia.toLowerCase() === dia.toLowerCase()
      );
    }
  }
  // Función para cambiar el día al hacer clic
  cambiarDia(dia: string) {
    this.diaActivo = dia;
    this.buscarRutinaDelDia(dia); // 🔥 Usamos la función de búsqueda
    this.cdr.detectChanges();
  }
  // Función para alternar el estado de completado de un ejercicio
  toggleEjercicio(ejer: any, index: number) {
    const rutinaDelDia = this.rutinaActual;
    if (!rutinaDelDia?._id) return;

    const url = `${environment.apiUrl}/api/rutinas/${rutinaDelDia._id}/ejercicio/${index}`;
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    // Primero enviamos al servidor, y LUEGO pintamos de verde
    this.http.patch(url, { completado: !ejer.completado }, { headers }).subscribe({
      next: () => {
        ejer.completado = !ejer.completado; // Solo cambia si el servidor dijo que sí
        console.log('✅ Confirmado por el servidor');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ El servidor no respondió:', err);
        alert('No se pudo guardar el progreso. Intenta de nuevo.');
      }
    });
  }



}
