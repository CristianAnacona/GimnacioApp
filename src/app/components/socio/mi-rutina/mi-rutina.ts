import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from '../../../services/auth';
import { ToastService } from '../../../services/toast.service';
import { ProgresoService } from '../../../services/progreso.service';
import { UserStateService } from '../../../services/user-state.service';
import { DIAS_RUTINA } from '../../../../data/ejercicios-catalogo';
interface SetForm { peso: number | null; reps: number | null; }

@Component({
  selector: 'app-mi-rutina',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './mi-rutina.html',
  styleUrl: './mi-rutina.css',
})
export class MiRutina implements OnInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);
  private progresoService = inject(ProgresoService);
  private userState = inject(UserStateService);
  private toast = inject(ToastService);
  private destroy$ = new Subject<void>();

  rutinas: any[] = [];
  rutinaActual: any = null;
  username = '';
  diasRutina: string[] = Object.values(DIAS_RUTINA);
  diaActivo: string = this.diasRutina[0];

  formularioIdx: number | null = null;
  setsForm: SetForm[] = [];
  guardando = false;

  scrollToActiveDay() {
    setTimeout(() => {
      const activeBtn = document.getElementById('btn-' + this.diaActivo);
      if (activeBtn) activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }, 200);
  }

  private resetarSiEsDiaDistinto(usuarioId: string) {
    const hoy = new Date().toISOString().split('T')[0];
    const ultima = localStorage.getItem('ultimoResetRutina');
    if (ultima === hoy) return;
    this.authService.resetDiario(usuarioId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => localStorage.setItem('ultimoResetRutina', hoy),
        error: () => this.toast.error('Error al resetear la rutina diaria')
      });
  }

  ngOnInit() {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    this.diaActivo = diasSemana[new Date().getDay()];

    const usuario = this.userState.getCurrentUser();
    if (!usuario) return;
    this.username = usuario.nombre || 'Socio';

    this.resetarSiEsDiaDistinto(usuario._id);

    this.authService.obtenerRutina(usuario._id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.rutinas = Array.isArray(res) ? res : [res];
          this.buscarRutinaDelDia(this.diaActivo);
          this.cdr.detectChanges();
          this.scrollToActiveDay();
        },
        error: () => this.toast.error('No se pudo cargar tu rutina')
      });
  }

  buscarRutinaDelDia(dia: string) {
    if (this.rutinas?.length > 0) {
      this.rutinaActual = this.rutinas.find(r => r.dia.toLowerCase() === dia.toLowerCase()) ?? null;
    }
  }

  cambiarDia(dia: string) {
    this.diaActivo = dia;
    this.buscarRutinaDelDia(dia);
    this.formularioIdx = null;
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
        error: () => this.toast.error('No se pudo guardar el progreso.')
      });
  }

  abrirFormulario(ejer: any, index: number, event: MouseEvent) {
    event.stopPropagation();
    if (this.formularioIdx === index) {
      this.formularioIdx = null;
      return;
    }
    this.formularioIdx = index;
    const numSeries = Number(ejer.series) || 4;
    this.setsForm = Array.from({ length: numSeries }, () => ({ peso: null, reps: null }));
    this.cdr.detectChanges();

    setTimeout(() => {
      document.getElementById('progreso-panel')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }

  cerrarFormulario(event: MouseEvent) {
    event.stopPropagation();
    this.formularioIdx = null;
  }

  async guardarProgreso(ejer: any, event: MouseEvent) {
    event.stopPropagation();
    const usuario = this.userState.getCurrentUser();
    if (!usuario?._id) return;

    const setsConDatos = this.setsForm.filter(s => s.peso !== null || s.reps !== null);
    if (!setsConDatos.length) {
      this.toast.error('Ingresa al menos un dato en una serie');
      return;
    }

    this.guardando = true;
    let guardados = 0;

    for (const set of setsConDatos) {
      await new Promise<void>((resolve) => {
        this.progresoService.guardarRegistro({
          usuarioId: usuario._id,
          ejercicioNombre: ejer.nombre,
          pesoKg: set.peso ?? undefined,
          repeticiones: set.reps ?? undefined
        }).subscribe({ next: () => { guardados++; resolve(); }, error: () => resolve() });
      });
    }

    this.guardando = false;
    this.formularioIdx = null;
    this.toast.success(`✓ ${guardados} serie${guardados !== 1 ? 's' : ''} guardada${guardados !== 1 ? 's' : ''}`);
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
