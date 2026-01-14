import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mi-rutina',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mi-rutina.html',
  styleUrl: './mi-rutina.css',
})

export class MiRutina implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);
  // Asegúrate de que NO tenga 'private' adelante
  rutinas: any[] = [];
  username = '';

  ngOnInit() {
    const data = localStorage.getItem('usuario');
    if (data) {
      const usuario = JSON.parse(data);
      const idSocio = usuario._id || usuario.id;
      this.username = usuario.nombre || 'Socio';

      if (idSocio) {
        this.authService.obtenerRutina(idSocio).subscribe({
          next: (res: any) => {
            console.log('Datos recibidos del server:', res);
            // Asignamos directamente a la variable de la clase
            if (Array.isArray(res) && res.length > 0) {
              this.rutinas = res;
            } else {
              this.rutinas = [res];
            }
            this.cdr.detectChanges();
            console.log('Variable this.rutinas ahora tiene:', this.rutinas);
          },
          error: (err) => console.error(err)
        });
      }
    }
  }
}
