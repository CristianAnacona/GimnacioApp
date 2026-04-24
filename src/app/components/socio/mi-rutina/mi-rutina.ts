import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from '../../../services/auth';
import { ToastService } from '../../../services/toast.service';
import { DIAS_RUTINA } from '../../../../data/ejercicios-catalogo';

@Component({
  selector: 'app-mi-rutina',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mi-rutina.html',
  styleUrl: './mi-rutina.css',
})
export class MiRutina implements OnInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  private destroy$ = new Subject<void>();

  rutinas: any[] = [];
  rutinaActual: any = null;
  username = '';
  diasRutina: string[] = Object.values(DIAS_RUTINA);
  diaActivo: string = this.diasRutina[0];

  scrollToActiveDay() {
    setTimeout(() => {
      const activeBtn = document.getElementById('btn-' + this.diaActivo);
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }, 200);
  }

  ngOnInit() {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    this.diaActivo = diasSemana[new Date().getDay()];

    const data = localStorage.getItem('usuario');
    if (!data) return;

    const usuario = JSON.parse(data);
    const idSocio = usuario._id || usuario.id;
    this.username = usuario.nombre || 'Socio';

    if (idSocio) {
      this.authService.obtenerRutina(idSocio)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
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

  buscarRutinaDelDia(dia: string) {
    if (this.rutinas?.length > 0) {
      this.rutinaActual = this.rutinas.find(r => r.dia.toLowerCase() === dia.toLowerCase()) ?? null;
    }
  }

  cambiarDia(dia: string) {
    this.diaActivo = dia;
    this.buscarRutinaDelDia(dia);
    this.cdr.detectChanges();
  }

  toggleEjercicio(ejer: any, index: number) {
    const rutinaDelDia = this.rutinaActual;
    if (!rutinaDelDia?._id) return;

    this.authService.toggleEjercicioCompletado(rutinaDelDia._id, index, !ejer.completado)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          ejer.completado = !ejer.completado;
          this.cdr.detectChanges();
        },
        error: () => this.toast.error('No se pudo guardar el progreso. Intenta de nuevo.')
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
