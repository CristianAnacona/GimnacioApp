import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { CATALOGO_EJERCICIOS, CATEGORIAS_UNICAS } from '../../../../data/ejercicios-catalogo';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-rutinas',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, RouterModule],
  templateUrl: './rutinas.html',
  styleUrls: ['./rutinas.css']
})
export class Rutinas implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  // Datos del catálogo y paginación
  categorias = CATEGORIAS_UNICAS;
  categoriaActiva = 'Pecho';
  ejerciciosDeCategoria: any[] = []; // Base de datos filtrada
  ejerciciosVisibles: any[] = [];    // Lo que el usuario ve realmente
  limiteActual = 12;

  // Datos de la rutina
  usuarioId = '';
  nombreRutina = '';
  rutinaParaSocio: any[] = []; 
  listaSocios: any[] = []; 

  ngOnInit() {
    this.filtrarPorCategoria('Pecho');

    const idUrl = this.route.snapshot.paramMap.get('id');
    if (idUrl) this.usuarioId = idUrl;

    // Carga de socios con desbloqueo de interfaz
    this.authService.getUsuarios().subscribe({
      next: (res: any) => {
        this.listaSocios = res;
        this.cdr.detectChanges(); // Desbloquea el select al recibir los datos
      },
      error: (err) => console.error('Error al cargar socios', err)
    });
  }

  filtrarPorCategoria(cat: string) {
    this.categoriaActiva = cat;
    this.limiteActual = 12; 
    this.ejerciciosDeCategoria = CATALOGO_EJERCICIOS.filter(e => e.categoria === cat);
    this.actualizarVista();
  }

  actualizarVista() {
    this.ejerciciosVisibles = this.ejerciciosDeCategoria.slice(0, this.limiteActual);
  }

  cargarMas() {
    this.limiteActual += 12;
    this.actualizarVista();
  }

  agregarA_Rutina(ej: any) {
    this.rutinaParaSocio.push({
      ...ej,
      series: 4,
      repeticiones: '12',
      completado: false
    });
  }

  quitarDeRutina(index: number) {
    this.rutinaParaSocio.splice(index, 1);
  }

  guardarRutina() {
    if (!this.usuarioId) return alert('Por favor, selecciona un socio');
    if (!this.nombreRutina) return alert('Dale un nombre a la rutina');
    
    const data = {
      usuarioId: this.usuarioId,
      nombre: this.nombreRutina,
      ejercicios: this.rutinaParaSocio
    };

    this.authService.asignarRutina(data).subscribe({
      next: () => {
        alert('¡Rutina enviada con éxito!');
        this.rutinaParaSocio = [];
        this.nombreRutina = '';
      },
      error: (err) => alert('Error al guardar: ' + err.message)
    });
  }
}