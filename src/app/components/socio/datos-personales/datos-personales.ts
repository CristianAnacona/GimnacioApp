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
    // Usamos el UserStateService para obtener el usuario actual de forma segura
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
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar perfil:', err)
    });
  }

  // LÓGICA DE FOTO (Mantenemos la compresión para evitar el error 413)
  async onFotoChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const fotoComprimida = await this.redimensionarImagen(file);
      this.perfil.fotoUrl = fotoComprimida; // Vista previa inmediata
      
      // Actualizamos solo la foto en el servidor
      this.authService.actualizarPerfil(this.perfil._id, { fotoUrl: fotoComprimida }).subscribe({
        next: (res) => {
          this.userStateService.updateUser(res.usuario || res);
          this.cdr.detectChanges();
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

    // 🔥 SOLUCIÓN AL RESETEO DE DÍAS: 
    // Enviamos SOLO los campos que el usuario puede editar.
    const datosAEditar = {
      nombre: this.perfil.nombre,
      email: this.perfil.email,
      fotoUrl: this.perfil.fotoUrl
      // NO enviamos "vencimiento", "role", ni "cards"
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