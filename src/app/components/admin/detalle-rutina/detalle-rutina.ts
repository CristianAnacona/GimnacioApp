import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalle-rutina',
  imports: [CommonModule],
  templateUrl: './detalle-rutina.html',
  styleUrl: './detalle-rutina.css',
})
export class DetalleRutina implements OnInit {

private cdr = inject(ChangeDetectorRef);

private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  usuarioId = '';
  rutinas: any[] = [];

  ngOnInit() {
    this.usuarioId = this.route.snapshot.paramMap.get('id') || '';
    this.cargarRutinas();
  }

 cargarRutinas() {
  this.authService.obtenerRutina(this.usuarioId).subscribe({
    next: (res: any) => {
      console.log('Respuesta del servidor para este socio:', res);
      this.rutinas = res;
      this.cdr.detectChanges();
    },
    error: (err) => console.error('Error en la petición:', err)
  });
}
  // Al dar click en editar, lo mandamos al formulario de creación 
  // que ya teníamos, pasando los datos necesarios
 editarRutina(rutina: any) {
  // Pasamos el ID del socio y el ID de la rutina específica
  this.router.navigate(['/admin/rutinas', this.usuarioId], { 
    queryParams: { rutinaId: rutina._id } 
  });
}

 borrarRutina(idRutina: string) {
  if (confirm('¿Estás seguro de eliminar esta rutina?')) {
    this.authService.eliminarRutina(idRutina).subscribe({
      next: () => {
        alert('Rutina eliminada correctamente');
        this.cargarRutinas(); // 👈 Esto recargará la lista automáticamente
      },
      error: (err) => {
        console.error('Error al borrar:', err);
        alert('No se pudo eliminar la rutina. Revisa la consola.');
      }
    });
  }
}
}
