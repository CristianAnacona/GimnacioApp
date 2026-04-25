import { Component, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../../services/auth';
import { ToastService } from '../../../services/toast.service';

const GOOGLE_CLIENT_ID = '976541861094-pcm89afbvhdi6fttf7si2cc7gbtuf2pn.apps.googleusercontent.com';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements AfterViewInit {
  usuario = { email: '', password: '' };
  cargando = false;
  verPass = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toast: ToastService,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit() {
    this.initGoogle();
  }

  private initGoogle() {
    const tryInit = () => {
      const google = (window as any).google;
      if (google?.accounts?.id) {
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response: any) => {
            this.ngZone.run(() => this.handleGoogleResponse(response));
          },
          use_fedcm_for_prompt: false,
          auto_select: false
        });
      } else {
        setTimeout(tryInit, 400);
      }
    };
    setTimeout(tryInit, 200);
  }

  clickGoogleBtn() {
    const google = (window as any).google;
    if (google?.accounts?.id) {
      google.accounts.id.prompt();
    } else {
      this.toast.error('Google no está disponible. Intenta de nuevo.');
    }
  }

  private handleGoogleResponse(response: any) {
    this.authService.loginConGoogle(response.credential).subscribe({
      next: (res: any) => {
        localStorage.clear();
        const role = res.usuario.role.toLowerCase().trim();
        localStorage.setItem('userId', res.usuario._id);
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', role);
        localStorage.setItem('nombre', res.usuario.nombre);
        if (role === 'admin') this.router.navigate(['admin/noticias']);
        else this.router.navigate(['/socio']);
      },
      error: () => this.toast.error('Error al iniciar sesión con Google')
    });
  }

  iniciarSesion() {
    if (!this.usuario.email || !this.usuario.password || this.cargando) return;
    this.cargando = true;

    this.authService.login(this.usuario).subscribe({
      next: (res: any) => {
        localStorage.clear();
        const role = res.usuario.role.toLowerCase().trim();
        localStorage.setItem('userId', res.usuario._id);
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', role);
        localStorage.setItem('nombre', res.usuario.nombre);
        if (role === 'admin') this.router.navigate(['admin/noticias']);
        else this.router.navigate(['/socio']);
        this.cargando = false;
      },
      error: (err) => {
        this.cargando = false;
        if (err.status === 400 || err.status === 401) {
          this.toast.error('Credenciales incorrectas. Revisa tu email y contraseña.');
        } else {
          this.toast.error('Error del servidor. Inténtalo más tarde.');
        }
      }
    });
  }
}
