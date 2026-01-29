import { UserStateService } from './../../../services/user-state.service';
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
    private cdr: ChangeDetectorRef, private UserStateService: UserStateService) { }

  role: string = '';
  username: string = '';
  fotoUrl: string = 'https://ui-avatars.com/api/?name=Usuario&background=random';
  menuOpen = false;

  // Cache estático para evitar recargas
  private static perfilCache: any = null;
  private static lastLoadTime: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

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
        { icon: '📰', name: 'noticias', route: '/admin/noticias' },
        { icon: '👥', name: 'socios', route: '/admin/socios' },
        { icon: '💳', name: 'planes', route: '/admin/planes' },
        { icon: '💰', name: 'pagos', route: '/admin/pagos' },
        { icon: '🏋️', name: 'entrenadores', route: '/admin/entrenadores' },
        { icon: '📋', name: 'rutinas', route: '/admin/rutinas' },
        { icon: '🚪', name: 'Cerrar Sesión', route: 'logout', isAction: true }
      ];
    } else if (this.role === 'socio') {
      return [
        { icon: '📢', name: 'noticias', route: '/socio/noticias' },
        { icon: '🏋️‍♂️', name: 'mi rutina', route: '/socio/mi-rutina' },
        { icon: '👤', name: 'perfil', route: '/socio/perfil' },
        { icon: '💎', name: 'planes', route: '/socio/planes' },
        { icon: '💰', name: 'pagos', route: '/socio/pagos' },
        { icon: '🏃‍♂️', name: 'Cerrar Sesión', route: 'logout', isAction: true }
      ];
    }
    return [];
  }

  ngOnInit() {
    this.role = localStorage.getItem('role') || 'socio';
    this.username = localStorage.getItem('nombre') || 'Usuario';


    this.UserStateService.user$.subscribe(userData => {
      if (!userData) return;

      this.username = userData.nombre || this.username;

      if (userData.fotoUrl && userData.fotoUrl.trim() !== '') {
        this.fotoUrl = userData.fotoUrl;
      }
    });

    const userId = localStorage.getItem('userId');
    if (userId) {
      this.cargarDatosUsuario();
    } else {
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

    // Verificar si tenemos cache válido
    const now = Date.now();
    const cacheValido = Navbar.perfilCache &&
      (now - Navbar.lastLoadTime) < this.CACHE_DURATION;

    if (cacheValido && Navbar.perfilCache.userId === userId) {
      // Usar datos del cache
      this.aplicarDatosPerfil(Navbar.perfilCache.data);
      return;
    }

    // Si no hay cache válido, hacer la petición
    this.authService.obtenerPerfil(userId).subscribe({
      next: (perfil: any) => {
        // Guardar en cache
        Navbar.perfilCache = {
          userId: userId,
          data: perfil
        };
        Navbar.lastLoadTime = Date.now();

        this.aplicarDatosPerfil(perfil);
      },
      error: (error: any) => {
        console.error('Error al cargar perfil:', error);
        this.fotoUrl = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(this.username) + '&background=random';
      }
    });
  }

  private aplicarDatosPerfil(perfil: any) {
    this.username = perfil.nombre || 'Usuario';

    if (perfil.fotoUrl && perfil.fotoUrl.trim() !== '') {
      this.fotoUrl = perfil.fotoUrl;
    } else {
      this.fotoUrl = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(perfil.nombre) + '&background=random';
    }
    this.cdr.detectChanges();
  }

  manejarErrorFoto(event: any) {
    event.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(this.username)
      + '&background=random';
  }

  handleMenuClick(link: any) {
    if (link.isAction && link.route === 'logout') {
      this.logout();
    } else {
      this.router.navigate([link.route]);
    }
    this.menuOpen = false;
  }

  logout() {
    // Limpiar cache al cerrar sesión
    Navbar.perfilCache = null;
    Navbar.lastLoadTime = 0;
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}