import { PagosService } from './../../services/pagos.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagos.html',
  styleUrl: './pagos.css',
})
export class Pagos implements OnInit {
  role = localStorage.getItem('role');
  listaPagos: any[] = []; 
  
  // Estado del Formulario
  mostrarFormulario = false;
  esEdicion = false;
  idEdicion = '';

  formulario = {
    titulo: '',
    descripcion: '',
    imagenUrl: '',
    datosClave: '',
    tipo: 'digital'
  };

  constructor(
    private pagosService: PagosService, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarMetodos();
  }

  cargarMetodos() {
    this.pagosService.obtenerMetodos().subscribe({
      next: (data) => {
        this.listaPagos = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar pagos:', err)
    });
  }

  abrirFormulario() {
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.esEdicion = false;
    this.idEdicion = '';
    // Reiniciamos el formulario a su estado original
    this.formulario = {
      titulo: '',
      descripcion: '',
      imagenUrl: '',
      datosClave: '',
      tipo: 'digital'
    };
  }

  prepararEdicion(pago: any) {
    this.esEdicion = true;
    this.idEdicion = pago._id;
    // Usamos el operador spread (...) para no modificar el objeto original por referencia
    this.formulario = { ...pago }; 
    this.abrirFormulario();
  }

 guardarPago() {
  if (!this.formulario.titulo || !this.formulario.descripcion) {
    alert("Por favor llena los campos básicos");
    return;
  }

  // Desactivamos temporalmente para evitar doble envío accidental
  const peticion = this.esEdicion 
    ? this.pagosService.actualizarMetodo(this.idEdicion, this.formulario)
    : this.pagosService.crearMetodo(this.formulario);

  peticion.subscribe({
    next: (res) => {
      console.log('✅ Éxito:', res);
      this.cargarMetodos();
      this.cerrarFormulario();
      this.cdr.detectChanges(); // Asegura que la vista se actualice
    },
    error: (err) => {
      console.error('❌ Error detallado:', err);
      alert('Error al guardar: ' + (err.error?.error || err.message));
    }
  });
}

  eliminarMetodo(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este método de pago?')) {
      this.pagosService.eliminarMetodo(id).subscribe({
        next: () => {
          this.cargarMetodos();
        },
        error: (err) => console.error('Error al eliminar:', err)
      });
    }
  }

copiarAlPortapapeles(texto: string) {
  navigator.clipboard.writeText(texto).then(() => {
    // Puedes usar un toast o un alert sencillo
    alert('¡Copiado al portapapeles: ' + texto + '!');
  });
}


}

