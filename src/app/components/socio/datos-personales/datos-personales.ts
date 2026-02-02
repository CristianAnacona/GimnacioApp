import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { AuthService } from '../../../services/auth';
import { UserStateService } from '../../../services/user-state.service';

@Component({
  selector: 'app-datos-personales',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './datos-personales.html'
})
export class DatosPersonales implements OnInit {
  perfil: any = null;
  cargando: boolean = false;

  constructor(
    private authService: AuthService,
    private userStateService: UserStateService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.userStateService.getCurrentUser();
    
    if (user && user._id) {
      this.cargarDatos(user._id);
    } else {
      console.error('No se encontró sesión activa');
      this.router.navigate(['/login']);
    }
  }

  cargarDatos(id: string) {
    this.authService.getPerfilSocio(id).subscribe({
      next: (res: any) => {
        this.perfil = res.datosCompletos || res;
        
        // ✅ SOLUCIÓN: Asegurar que datosPersonales existe con valores por defecto
        if (!this.perfil.datosPersonales) {
          this.perfil.datosPersonales = {
            identificacion: '',
            fechaNacimiento: '',
            sexo: '',
            pesoActual: 0,
            altura: 0,
            telefono: ''
          };
        }
        
        // ✅ También asegurar que stats existe
        if (!this.perfil.stats) {
          this.perfil.stats = {
            racha: 0,
            asistenciasMes: 0
          };
        }
        
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar perfil:', err)
    });
  }

async onFotoChange(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const fotoComprimida = await this.redimensionarImagen(file);
    this.perfil.fotoUrl = fotoComprimida;
     this.cdr.detectChanges();
    this.authService.actualizarPerfil(this.perfil._id, { fotoUrl: fotoComprimida }).subscribe({
      next: (res: any) => { 
        const usuarioActualizado = res.usuario || res;
        this.userStateService.updateUser(usuarioActualizado);
        
        console.log('✅ Foto de perfil actualizada en el servidor');
       
      },
      error: (err) => {
        console.error("❌ Error al subir la foto:", err);
        alert('No se pudo guardar la foto. Verifica tu conexión.');
      }
    });
  } catch (error) {
    console.error("Error al procesar la imagen:", error);
  }
}

  private redimensionarImagen(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400; 
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
      };
      reader.onerror = error => reject(error);
    });
  }

  guardar() {
    if (!this.perfil || !this.perfil._id) return;
    
    this.cargando = true;

    // ✅ Incluir datosPersonales al guardar
    const datosAEditar = {
      nombre: this.perfil.nombre,
      email: this.perfil.email,
      fotoUrl: this.perfil.fotoUrl,
      datosPersonales: this.perfil.datosPersonales, // ✅ Agregar esto
      mensajeMotivador: this.perfil.mensajeMotivador // ✅ Y esto si lo usas
    };

    this.authService.actualizarPerfil(this.perfil._id, datosAEditar).subscribe({
      next: (res: any) => {
        this.cargando = false;
        const usuarioActualizado = res.usuario || res;
        
        this.userStateService.updateUser(usuarioActualizado);

        alert('¡Datos actualizados con éxito!');
        this.router.navigate(['/socio/perfil']);
      },
      error: (err) => {
        this.cargando = false;
        alert('Error al guardar los datos');
      }
    });
  }
}