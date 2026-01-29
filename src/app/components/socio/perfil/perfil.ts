import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Importa tus servicios
import { AuthService } from '../../../services/auth';
import { UserStateService } from '../../../services/user-state.service';

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
  diasRestantes: number = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService, 
    private userStateService: UserStateService, // Inyectamos el servicio de estado
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const usuarioString = localStorage.getItem('usuario');
    if (usuarioString) {
      const usuarioObj = JSON.parse(usuarioString);
      this.cargarPerfil(usuarioObj._id);
    }
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
        error: (err) => console.error('Error al traer el perfil', err)
      });
  }

  
  actualizarFotoPerfil(nuevaFotoUrl: string) {
    if (!this.perfil) return;

    this.authService.actualizarPerfil(this.perfil._id, { fotoUrl: nuevaFotoUrl })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.perfil = res;
          
          // 🔥 LA CLAVE: Usamos el servicio de estado global
          // Esto actualiza el localStorage y avisa al Navbar al instante
          this.userStateService.updateUser({
            fotoUrl: res.fotoUrl
          });

          this.cdr.markForCheck();
          alert('¡Foto actualizada correctamente!');
        },
        error: (err) => {
          if (err.status === 413) {
            alert('Error: La imagen es demasiado pesada para el servidor.');
          } else {
            alert('Error al actualizar la foto.');
          }
          console.error('❌ Error al actualizar', err);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}