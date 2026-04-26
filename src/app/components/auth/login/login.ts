import { Component, AfterViewInit, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../../services/auth';
import { ToastService } from '../../../services/toast.service';
import { GymService, Gym } from '../../../services/gym.service';

const GOOGLE_CLIENT_ID = '976541861094-pcm89afbvhdi6fttf7si2cc7gbtuf2pn.apps.googleusercontent.com';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit, AfterViewInit {
  usuario = { email: '', password: '' };
  cargando = false;
  verPass = false;
  gym: Gym | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toast: ToastService,
    private gymService: GymService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.gym = this.gymService.getGym();
    if (!this.gym) {
      this.router.navigate(['/gimnasios']);
    }
  }

  ngAfterViewInit() {
    this.initGoogle();
  }

  private initGoogle() {}

  clickGoogleBtn() {
    const google = (window as any).google;
    if (!google?.accounts?.oauth2) {
      this.toast.error('Google no está disponible. Intenta de nuevo.');
      return;
    }

    const client = google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'openid email profile',
      callback: (tokenResponse: any) => {
        if (tokenResponse.access_token) {
          this.ngZone.run(() => this.handleGoogleToken(tokenResponse.access_token));
        }
      }
    });
    client.requestAccessToken();
  }

  private handleGoogleToken(accessToken: string) {
    const gymId = this.gym?._id || null;
    this.authService.loginConGoogle(accessToken, gymId).subscribe({
      next: (res: any) => {
        this.guardarSesion(res);
      },
      error: () => this.toast.error('Error al iniciar sesión con Google')
    });
  }

  iniciarSesion() {
    if (!this.usuario.email || !this.usuario.password || this.cargando) return;
    this.cargando = true;

    const credenciales = {
      ...this.usuario,
      gymId: this.gym?._id || null
    };

    this.authService.login(credenciales).subscribe({
      next: (res: any) => {
        this.guardarSesion(res);
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

  private guardarSesion(res: any) {
    // Preservar el gym antes de limpiar
    const gymActual = localStorage.getItem('gymActual');
    localStorage.clear();
    if (gymActual) localStorage.setItem('gymActual', gymActual);

    const role = res.usuario.role.toLowerCase().trim();
    localStorage.setItem('userId', res.usuario._id);
    localStorage.setItem('usuario', JSON.stringify(res.usuario));
    localStorage.setItem('token', res.token);
    localStorage.setItem('role', role);
    localStorage.setItem('nombre', res.usuario.nombre);

    if (role === 'superadmin') this.router.navigate(['/plataforma']);
    else if (role === 'admin') this.router.navigate(['admin/noticias']);
    else this.router.navigate(['/socio']);
  }

  cambiarGym() {
    this.gymService.limpiarGym();
    this.router.navigate(['/gimnasios']);
  }
}
