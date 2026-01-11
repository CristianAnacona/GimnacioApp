import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { NoticiaService } from '../../services/noticia.service';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './noticias.html',
  styleUrls: ['./noticias.css']
})
export class Noticias implements OnInit {
  noticias: any[] = [];
  mostrarFormulario = false;
  esEdicion = false;
  noticiaEditando: any = null;
  rol = localStorage.getItem('role')?.toLowerCase().trim();

  formulario = {
    titulo: '',
    descripcion: '',
    dia: '',
    horaInicio: '',
    horaFin: ''
  };

  dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  constructor(
    private noticiaService: NoticiaService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.cargarNoticias();
  }

  cargarNoticias() {
    this.noticiaService.obtenerNoticias().subscribe({
      next: (data: any) => {
        this.noticias = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Error al cargar noticias:', error);
      }
    });
  }

  abrirFormulario() {
    this.mostrarFormulario = true;
    this.esEdicion = false;
    this.limpiarFormulario();
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.formulario = {
      titulo: '',
      descripcion: '',
      dia: '',
      horaInicio: '',
      horaFin: ''
    };
    this.noticiaEditando = null;
  }

  guardarNoticia(form: NgForm) {
    if (!form.valid) {
      alert('Por favor completa el título y la descripción');
      return;
    }

    // Crear objeto limpio solo con título y descripción obligatorios
    const datosAEnviar: any = {
      titulo: this.formulario.titulo.trim(),
      descripcion: this.formulario.descripcion.trim()
    };

    if (this.esEdicion) {
      datosAEnviar.dia =
        this.formulario.dia === '' || this.formulario.dia === null
          ? null
          : this.formulario.dia;
    } else {
      if (this.formulario.dia && this.formulario.dia !== '') {
        datosAEnviar.dia = this.formulario.dia;
      }
    }
    if (this.formulario.horaInicio && this.formulario.horaInicio !== '') {
      datosAEnviar.horaInicio = this.formulario.horaInicio;
    }
    if (this.formulario.horaFin && this.formulario.horaFin !== '') {
      datosAEnviar.horaFin = this.formulario.horaFin;
    }

    if (this.esEdicion && this.noticiaEditando?._id) {
      // ACTUALIZAR
      this.noticiaService.actualizarNoticia(this.noticiaEditando._id, datosAEnviar).subscribe({
        next: (response) => {
          alert('Noticia actualizada exitosamente');
          form.resetForm();
          this.limpiarFormulario();
          this.cerrarFormulario();
          this.cargarNoticias();
        },
        error: (error) => {
          console.error('❌ Error al actualizar:', error);
          console.error('❌ Status:', error.status);
          console.error('❌ Error body:', error.error);
          alert('Error al actualizar: ' + (error.error?.message || error.error?.error || JSON.stringify(error.error)));
        }
      });
    } else {
      // CREAR
      this.noticiaService.crearNoticia(datosAEnviar).subscribe({
        next: (response) => {
          alert('Noticia creada exitosamente');
          form.resetForm();
          this.limpiarFormulario();
          this.cerrarFormulario();
          this.cargarNoticias();
        },
        error: (error) => {
          console.error('❌ Error al crear:', error);
          console.error('❌ Status:', error.status);
          console.error('❌ Error completo:', error.error);
          console.error('❌ Mensaje:', error.error?.message);
          console.error('❌ Detalles:', error.error?.error);

          // Mostrar error detallado
          let mensajeError = 'Error al crear la noticia';
          if (error.error?.message) {
            mensajeError = error.error.message;
          } else if (error.error?.error) {
            mensajeError = error.error.error;
          } else if (typeof error.error === 'string') {
            mensajeError = error.error;
          }

          alert('Error: ' + mensajeError);
        }
      });
    }
  }

  editarNoticia(noticia: any) {
    this.noticiaEditando = noticia;
    this.formulario = {
      titulo: noticia.titulo || '',
      descripcion: noticia.descripcion || '',
      dia: noticia.dia ?? null,
      horaInicio: noticia.horaInicio || '',
      horaFin: noticia.horaFin || ''
    };
    this.esEdicion = true;
    this.mostrarFormulario = true;
  }

  eliminarNoticia(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta noticia?')) {
      this.noticiaService.eliminarNoticia(id).subscribe({
        next: () => {
          alert('Noticia eliminada exitosamente');
          this.cargarNoticias();
        },
        error: (error) => {
          console.error('❌ Error al eliminar:', error);
          alert('Error al eliminar la noticia');
        }
      });
    }
  }
}