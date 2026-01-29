
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router'; // Inyectamos Router
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
  private router = inject(Router); // Para navegar después de guardar
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  // Datos del catálogo y paginación
  categorias = CATEGORIAS_UNICAS;
  categoriaActiva = 'Pecho';
  ejerciciosDeCategoria: any[] = []; 
  ejerciciosVisibles: any[] = [];    
  limiteActual = 20;

  // Datos de la rutina
  usuarioId = '';
  nombreRutina = '';
  dia = '';
  enfoque = '';

  rutinaParaSocio: any[] = []; 
  listaSocios: any[] = []; 
  
  // MODO EDICIÓN
  editandoModo = false;
  idRutinaParaEditar = '';
  rutinasExistentesDelSocio: any[] = [];

  

  ngOnInit() {
    this.filtrarPorCategoria('Pecho');

    // 1. Capturamos el ID del socio desde la URL
    const idSocio = this.route.snapshot.paramMap.get('id');
    // 2. Capturamos el ID de la rutina si venimos desde el botón Editar (queryParams)
    const idRutina = this.route.snapshot.queryParamMap.get('rutinaId');

    if (idSocio) {
      this.usuarioId = idSocio;
      this.cargarRutinasDelSocio(idSocio, idRutina); 
    }

    // Cargar lista de socios para el selector
    this.authService.getUsuarios().subscribe({
      next: (res: any) => {
        this.listaSocios = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar socios', err)
    });
  }

  onSocioChange() {
    if (this.usuarioId) {
      this.cargarRutinasDelSocio(this.usuarioId);
    }
  }

 cargarRutinasDelSocio(idSocio: string, idRutinaABuscar: string | null = null) {
  // ESCUDO: Si no hay ID, limpiamos la lista local y salimos sin hacer la petición
  if (!idSocio || idSocio.trim() === '') {
    this.rutinasExistentesDelSocio = [];
    return;
  }

  this.authService.obtenerRutina(idSocio).subscribe({
    next: (res: any) => {
      this.rutinasExistentesDelSocio = Array.isArray(res) ? res : [res];
      
      // Si venimos en modo edición, buscamos la rutina específica
      if (idRutinaABuscar) {
        const encontrada = this.rutinasExistentesDelSocio.find(r => r._id === idRutinaABuscar);
        if (encontrada) {
          this.editandoModo = true;
          this.idRutinaParaEditar = encontrada._id;
          this.nombreRutina = encontrada.nombre;
          this.dia = encontrada.dia;
          this.enfoque = encontrada.enfoque;
          this.rutinaParaSocio = [...encontrada.ejercicios];
          this.cdr.detectChanges();
        }
      }
      // Importante: Refrescar siempre que los datos lleguen
      this.cdr.detectChanges();
    },
    error: (err) => {
      // Si el error es 404 porque el socio simplemente no tiene rutinas aún, 
      // no lo tratamos como un error crítico, solo vaciamos la lista.
      if (err.status === 404) {
        this.rutinasExistentesDelSocio = [];
      } else {
        console.error('Error al obtener rutinas del socio', err);
      }
    }
  });
}

  filtrarPorCategoria(cat: string) {
    this.categoriaActiva = cat;
    this.limiteActual = 20; 
    this.ejerciciosDeCategoria = CATALOGO_EJERCICIOS.filter(e => e.categoria === cat);
    this.actualizarVista();
  }

  actualizarVista() {
    this.ejerciciosVisibles = this.ejerciciosDeCategoria.slice(0, this.limiteActual);
  }

  cargarMas() {
    this.limiteActual += 20;
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
  if (!this.dia) return alert('Selecciona un día de la semana');
  if (!this.enfoque) return alert('Indica el enfoque (ej: Pecho y Tríceps)');
  if (this.rutinaParaSocio.length === 0) return alert('La rutina no tiene ejercicios');

  const data = {
    usuarioId: this.usuarioId,
    nombre: this.nombreRutina,
    dia: this.dia,
    enfoque: this.enfoque,
    ejercicios: this.rutinaParaSocio
  };

  const rutinaExistenteEnEseDia = this.rutinasExistentesDelSocio.find(r => 
    r.dia === this.dia && r.enfoque === this.enfoque
  );

  if (this.editandoModo || rutinaExistenteEnEseDia) {
    const idParaActualizar = this.editandoModo ? this.idRutinaParaEditar : (rutinaExistenteEnEseDia?._id || '');
    
    if (confirm(`¿Deseas guardar los cambios en la rutina "${this.nombreRutina}"?`)) {
      this.authService.actualizarRutina(idParaActualizar, data).subscribe({
        next: () => {
          alert('¡Rutina actualizada correctamente!');
          this.finalizarProceso(this.editandoModo); 
        },
        error: (err) => alert('Error al actualizar: ' + err.message)
      });
    }
  } else {
    this.authService.asignarRutina(data).subscribe({
      next: () => {
        alert('¡Nueva rutina creada con éxito!');
        this.finalizarProceso(false); // <--- FALSE para quedarse y ver el cambio
      },
      error: (err) => alert('Error al guardar: ' + err.message)
    });
  }
}

// Corregido para limpiar la pantalla TOTALMENTE antes de cualquier otra acción
finalizarProceso(volverALista: boolean) {
  // 1. IMPORTANTE: NO reseteamos this.usuarioId para que el select no se vacíe
  
  // 2. Limpiamos los datos de la rutina de trabajo
  this.usuarioId = '';          // Reiniciamos el select del socio
  this.rutinaParaSocio = [];      // Borra los ejercicios de la derecha
  this.dia = ''; 
  this.enfoque = '';                // Borra el input "Lunes, Martes..."
  this.editandoModo = false;      // Quitamos el modo edición
  this.idRutinaParaEditar = '';   // Borramos el ID técnico de la rutina

  // 3. Limpiamos el catálogo de la izquierda (Buscador)
  this.categoriaActiva = 'Pecho'; 
  this.limiteActual = 12;
  this.filtrarPorCategoria(this.categoriaActiva); 

  // 4. Forzamos a Angular a que pinte los cambios (el borrado)
  this.cdr.detectChanges();

  if (volverALista) {
    // Si veníamos de edición, regresamos a la pantalla celeste
    this.router.navigate(['/admin/rutinas', this.usuarioId]);
  } else {
    // Si agregamos una nueva, refrescamos la lista interna de validación 
    // para que el sistema sepa qué rutinas nuevas tiene el socio ahora
    this.cargarRutinasDelSocio(this.usuarioId);
    
    // Un pequeño delay para asegurar que el select mantenga el foco visual
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 100);
  }
}

// Asegúrate de que limpiarFormulario sea así de radical:
limpiarFormulario() {
  this.rutinaParaSocio = [];
  this.nombreRutina = '';
  this.editandoModo = false;
  this.idRutinaParaEditar = '';
  this.cdr.detectChanges(); // <--- Agregado aquí también por seguridad
}
}