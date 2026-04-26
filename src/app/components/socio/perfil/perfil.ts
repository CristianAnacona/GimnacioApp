import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from '../../../services/auth';
import { UserStateService } from '../../../services/user-state.service';
import { ToastService } from '../../../services/toast.service';
import { GymService } from '../../../services/gym.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Perfil implements OnInit, OnDestroy {
  perfil: any = null;
  diasRestantes = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private userStateService: UserStateService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
    public gymService: GymService
  ) {}

  ngOnInit() {
    const usuario = this.userStateService.getCurrentUser();
    if (usuario?._id) this.cargarPerfil(usuario._id);
  }

  cargarPerfil(id: string) {
    this.authService.getPerfilSocio(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.perfil = data;
          this.diasRestantes = data.cards?.vencimiento || 0;
          this.cdr.markForCheck();
        },
        error: () => this.toast.error('Error al cargar el perfil')
      });
  }

  actualizarFotoPerfil(nuevaFotoUrl: string) {
    if (!this.perfil) return;

    this.authService.actualizarPerfil(this.perfil._id, { fotoUrl: nuevaFotoUrl })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.perfil = res;
          this.userStateService.updateUser({ fotoUrl: res.fotoUrl });
          this.cdr.markForCheck();
          this.toast.success('¡Foto actualizada correctamente!');
        },
        error: (err) => {
          if (err.status === 413) {
            this.toast.error('La imagen es demasiado pesada para el servidor.');
          } else {
            this.toast.error('Error al actualizar la foto.');
          }
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
