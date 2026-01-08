import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth';
// Importamos los datos que creaste en el paso anterior
import { CATALOGO_EJERCICIOS, CATEGORIAS_UNICAS } from '../../../../data/ejercicios-catalogo';
// Importamos la herramienta para arrastrar y soltar
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-rutinas',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule], // DragDropModule es clave
  templateUrl: './rutinas.html',
  styleUrls: ['./rutinas.css']
})
export class Rutinas implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  // Datos del catálogo
  categorias = CATEGORIAS_UNICAS;
  ejerciciosVisibles = CATALOGO_EJERCICIOS;
  categoriaActiva = 'Pecho';

  // Datos de la rutina que estamos armando
  usuarioId = '';
  nombreRutina = '';
  rutinaParaSocio: any[] = []; // Aquí caerán los ejercicios seleccionados
  listaSocios: any[] = []; // Aquí caerán los socios
 ngOnInit() {
  // 1. Intentar capturar el ID de la URL si viene de la lista
  const idUrl = this.route.snapshot.paramMap.get('id');
  if (idUrl) {
    this.usuarioId = idUrl;
  }

  // 2. Cargar todos los socios para el buscador/desplegable
  this.authService.getUsuarios().subscribe((res:any) => {
    this.listaSocios = res;
  });
}

  filtrarPorCategoria(cat: string) {
    this.categoriaActiva = cat;
    this.ejerciciosVisibles = CATALOGO_EJERCICIOS.filter(e => e.categoria === cat);
  }

  // Función para cuando haces clic en el "+" de la carta
  agregarA_Rutina(ej: any) {
    // Creamos una copia para que cada ejercicio tenga sus propias series/reps
    const nuevoEjercicio = {
      ...ej,
      series: 4,
      repeticiones: '12',
      completado: false
    };
    this.rutinaParaSocio.push(nuevoEjercicio);
  }

  quitarDeRutina(index: number) {
    this.rutinaParaSocio.splice(index, 1);
  }

  guardarRutina() {
    if (!this.nombreRutina) return alert('Ponle un nombre a la rutina');
    
    const data = {
      usuarioId: this.usuarioId,
      nombre: this.nombreRutina,
      ejercicios: this.rutinaParaSocio
    };

    this.authService.asignarRutina(data).subscribe({
      next: () => alert('¡Rutina enviada con éxito!'),
      error: (err) => alert('Error: ' + err.message)
    });
  }
}