import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {RouterModule, Router } from '@angular/router';

// Ajusta tu ruta
import { AuthService } from '../../../services/auth';



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
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
  const userString = localStorage.getItem('usuario');
  console.log('1. Usuario en LocalStorage:', userString);

  if (userString) {
    const user = JSON.parse(userString);
    console.log('2. ID a buscar:', user._id);

    this.authService.getPerfilSocio(user._id).subscribe({
      next: (res: any) => {
        console.log('3. Respuesta del servidor:', res);
        // IMPORTANTE: Verifica si aquí recibes 'datosCompletos' o el objeto directo
        this.perfil = res.datosCompletos || res; 
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('ERROR de red:', err);
      }
    });
  } else {
    console.error('No hay usuario en el localStorage');
  }
}
  obtenerDatos() {
    const user = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.authService.getPerfilSocio(user._id).subscribe({
      next: (res: any) => {
        this.perfil = res.datosCompletos;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar', err)
    });
  }

  // MÉTODO PARA LA GALERÍA
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.perfil.fotoUrl = reader.result as string; // Convertimos a Base64
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  guardar() {
    this.cargando = true;
    this.authService.actualizarPerfil(this.perfil._id, this.perfil).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigate(['/socio/perfil']);
        alert('¡Datos actualizados con éxito!');
        
      },
      error: () => {
        this.cargando = false;
        alert('Error al guardar');
      }
    });
  }
}