
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
  const idSocioActual = this.usuarioId; 
  if (!this.nombreRutina) {
    this.nombreRutina = `${this.enfoque} - ${this.dia}`;
  }
  
  // Validaciones básicas de campos vacíos
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

  // 🔥 CAMBIO CLAVE: Solo buscamos por día. Si el día ya existe, lo atrapamos.
  const rutinaExistenteEnEseDia = this.rutinasExistentesDelSocio.find(r => 
    r.dia.toLowerCase() === this.dia.toLowerCase()
  );

  if (this.editandoModo || rutinaExistenteEnEseDia) {
    // Si estamos editando o si encontramos que el día ya está ocupado
    const idParaActualizar = this.editandoModo ? this.idRutinaParaEditar : (rutinaExistenteEnEseDia?._id || '');
    
    // Cambiamos el mensaje para que sea más claro
    const mensajeConfirm = this.editandoModo 
      ? `¿Deseas guardar los cambios en la rutina "${this.nombreRutina}"?`
      : `El día ${this.dia} ya tiene una rutina (${rutinaExistenteEnEseDia?.enfoque}). ¿Deseas SOBRESCRIBIRLA con esta nueva información?`;

    if (confirm(mensajeConfirm)) {
      this.authService.actualizarRutina(idParaActualizar, data).subscribe({
        next: () => {
          alert('¡Rutina actualizada correctamente!');
          this.finalizarProceso(this.editandoModo); 
        },
        error: (err) => alert('Error al actualizar: ' + (err.error?.mensaje || err.message))
      });
    }
  } else {
    // Si el día está libre, creamos una nueva
    this.authService.asignarRutina(data).subscribe({
      next: () => {
        alert('¡Nueva rutina creada con éxito!');
        this.finalizarProceso(false); 
      },
      error: (err) => {
        // Leemos el mensaje de error del Backend que configuramos antes
        const mensajeError = err.error?.mensaje || 'Error al guardar';
        alert('⚠️ ' + mensajeError);
      }
    });
  }
}

// Corregido para limpiar la pantalla TOTALMENTE antes de cualquier otra acción
finalizarProceso(volverALista: boolean) {
  const idTemporal = this.usuarioId; // Guardamos el ID un momento

  // Limpiamos solo el formulario, NO el socio
  this.rutinaParaSocio = [];
  this.dia = ''; 
  this.enfoque = '';
  this.editandoModo = false;
  this.idRutinaParaEditar = '';

  this.cdr.detectChanges();

  if (volverALista) {
    this.router.navigate(['/admin/rutinas', idTemporal]);
  } else {
    // Usamos el ID guardado para refrescar la lista de Celeste
    this.cargarRutinasDelSocio(idTemporal);
  }
}
// Añade esto a tu archivo rutinas.ts


// Asegúrate de que limpiarFormulario sea así de radical:
limpiarFormulario() {
  this.rutinaParaSocio = [];
  this.nombreRutina = '';
  this.editandoModo = false;
  this.idRutinaParaEditar = '';
  this.cdr.detectChanges(); // <--- Agregado aquí también por seguridad
}
}