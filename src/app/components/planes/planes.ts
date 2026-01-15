import { PlanesService } from './../../services/planes.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-planes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // IMPORTANTE: Agregados para que funcione ngModel y directivas
  templateUrl: './planes.html',
  styleUrl: './planes.css',
})
export class Planes implements OnInit {
  role: string = 'socio';
  listaPlanes: any[] = [];
  mostrarFormulario: boolean = false;
  esEdicion: boolean = false;

  // Modelo del formulario ajustado a tu Backend
  formulario: any = {
    nombre: '',
    descripcion: '',
    precio: '',
    caracteristicas: '' // Se capturan como texto separado por comas
  };

  constructor(private planesService: PlanesService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role')?.toLowerCase().trim() || 'socio';
    this.obtenerPlanes();
  }

  obtenerPlanes() {
    this.planesService.obtenerPlanes().subscribe({
      next: (data: any) => {
        this.listaPlanes = data;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('❌ Error al cargar planes:', error),
    });
  }

  guardarPlan() {
    // Procesar características: de string a array
    const datosEnviar = {
      ...this.formulario,
      caracteristicas: typeof this.formulario.caracteristicas === 'string' 
        ? this.formulario.caracteristicas.split(',').map((c: string) => c.trim())
        : this.formulario.caracteristicas
    };

    if (this.esEdicion) {
      this.planesService.actualizarPlan(this.formulario._id, datosEnviar).subscribe({
        next: () => {
          this.obtenerPlanes();
          this.cerrarFormulario();
        },
        error: (error) => console.error('❌ Error al actualizar:', error)
      });
    } else {
      this.planesService.crearPlan(datosEnviar).subscribe({
        next: () => {
          this.obtenerPlanes();
          this.cerrarFormulario();
        },
        error: (error) => console.error('❌ Error al crear:', error)
      });
    }
  }

  prepararEdicion(plan: any) {
    this.esEdicion = true;
    this.mostrarFormulario = true;
    this.formulario = { 
      ...plan, 
      caracteristicas: plan.caracteristicas.join(', ') // Array a string para el textarea
    };
  }

  eliminarPlan(id: string) {
    if (confirm('¿Estás seguro de eliminar este plan?')) {
      this.planesService.eliminarPlan(id).subscribe({
        next: () => this.obtenerPlanes(),
        error: (error) => console.error('❌ Error al eliminar:', error)
      });
    }
  }

  abrirFormulario() {
    this.mostrarFormulario = true;
    this.esEdicion = false;
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.formulario = { nombre: '', descripcion: '', precio: '', caracteristicas: '' };
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.limpiarFormulario();
  }
}