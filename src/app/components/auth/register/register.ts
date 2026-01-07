import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth'; // Verifica que la ruta a tu servicio sea esta

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  nuevoUsuario = {
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'socio'
  };

  constructor(private authService: AuthService, private router: Router) {}

  // Verifica que las contraseñas coincidan y tengan longitud mínima
  esFormularioValido(): boolean {
    return (
      this.nuevoUsuario.nombre.length > 2 &&
      this.nuevoUsuario.email.includes('@') &&
      this.nuevoUsuario.password.length >= 8 &&
      this.nuevoUsuario.password === this.nuevoUsuario.confirmPassword
    );
  }

  contrasenasCoinciden(): boolean {
    return this.nuevoUsuario.password === this.nuevoUsuario.confirmPassword;
  }

  registrar() {
    if (this.esFormularioValido()) {
      this.authService.registrar(this.nuevoUsuario).subscribe({
        next: (res: any) => {
          alert('✅ ¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
          this.router.navigate(['/login']);
        },
        error: (err: any) => {
          alert('❌ Error: El correo ya está registrado o hubo un problema con el servidor.');
          console.error(err);
        }
      });
    }
  }
}
