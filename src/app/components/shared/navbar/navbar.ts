import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  standalone: true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  constructor(private router: Router, private authService: AuthService, 
    private cdr: ChangeDetectorRef) {}

  role: string = '';
  username: string = '';
  fotoUrl: string = 'https://ui-avatars.com/api/?name=Usuario&background=random';
  menuOpen = false;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInsideMenu = target.closest('.menu-container');
    const clickedMenuButton = target.closest('.menu-button');

    if (!clickedInsideMenu && !clickedMenuButton && this.menuOpen) {
      this.menuOpen = false;
    }
  }

  get menuLinks() {
    if (this.role === 'admin') {
      return [
        { icon: '📰', name: 'noticias', route: 'noticias' },
        { icon: '👥', name: 'socios', route: 'socios' },
        { icon: '💳', name: 'planes', route: 'planes' },
        { icon: '💰', name: 'pagos', route: 'pagos' },
        { icon: '🏋️', name: 'entrenadores', route: 'entrenadores' },
        { icon: '📋', name: 'rutinas', route: 'rutinas' }
      ];
    } else if (this.role === 'socio') {
      return [
        { icon: '📰', name: 'noticias', route: 'noticias' },
        { icon: '💪', name: 'mi rutina', route: 'mi-rutina' },
        { icon: '👤', name: 'perfil', route: 'perfil' },
        { icon: '💳', name: 'planes', route: 'planes' },
        { icon: '💰', name: 'pagos', route: 'pagos' }
      ];
    }
    return [];
  }

  ngOnInit() {
    this.role = localStorage.getItem('role') || 'socio';
    this.username = localStorage.getItem('nombre') || 'Usuario';

    // Solo cargar datos si hay userId
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.cargarDatosUsuario();
    } else {
      // Usar imagen por defecto mientras no hay login
      this.fotoUrl = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(this.username) + '&background=random';
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  cargarDatosUsuario() {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      this.fotoUrl = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(this.username) + '&background=random';
      return;
    }

    this.authService.obtenerPerfil(userId).subscribe({
      next: (perfil: any) => {
        console.log('Perfil recibido:', perfil);
        this.username = perfil.nombre || 'Usuario';

        // Si tiene fotoUrl y no está vacía, la usa. Si no, genera una con el nombre
        if (perfil.fotoUrl && perfil.fotoUrl.trim() !== '') {
          this.fotoUrl = perfil.fotoUrl;
        } else {
          this.fotoUrl = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(perfil.nombre) + '&background=random';
        }
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error al cargar perfil:', error);
        this.fotoUrl = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(this.username) + '&background=random';
      }
    });
  }

  manejarErrorFoto(event: any) {
    // Si la foto local falla, usamos una de respaldo de internet
    event.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(this.username) + '&background=random';
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}