import { Routes } from '@angular/router';
import { authGuard } from './guards/auth';
import { AdminDashboard } from './components/admin/dashboardAdmin/dashboardAdmin';
import { EjercicioDetalle } from './components/ejercicio-detalle/ejercicio-detalle';
import { noAuthGuard } from './guards/no-auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [noAuthGuard],
    loadComponent: () => import('./components/auth/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    canActivate: [noAuthGuard],
    loadComponent: () => import('./components/auth/register/register').then(m => m.Register)
  },

  // ESTRUCTURA PARA ADMINISTRADORES
  {
    path: 'admin',
    component:AdminDashboard,
    canActivate: [authGuard],
    children: [
      { path: 'noticias', loadComponent: () => import('./components/noticias/noticias')
        .then(m => m.Noticias) },
      { path: 'entrenadores',
         loadComponent: () => import('./components/admin/entrenadores/entrenadores')
         .then(m => m.Entrenadores) },
      { path: 'socios', loadComponent: () => import('./components/admin/socios/socios')
        .then(m => m.Socios) },
      { path: 'pagos', loadComponent: () => import('./components/admin/pagos/pagos')
        .then(m => m.Pagos) },
      { path: 'planes', loadComponent: () => import('./components/planes/planes')
        .then(m => m.Planes) },
      { path: 'rutinas', loadComponent: () => import('./components/admin/rutinas/rutinas')
        .then(m => m.Rutinas) },
      {path: 'rutinas/:id', loadComponent: () => import('./components/admin/rutinas/rutinas')
        .then(m => m.Rutinas)},
        {path: 'detalle-rutina/:id', loadComponent: () => import('./components/admin/detalle-rutina/detalle-rutina')
          .then(m => m.DetalleRutina)},
      { path: '', redirectTo: 'noticias', pathMatch: 'full' }
    ]
  },
  // CIERRE ESTRUCTURA PARA ADMINISTRADORES


  { path: 'ejercicio/:nombre', loadComponent: () => import('./components/ejercicio-detalle/ejercicio-detalle')
    .then(m => m.EjercicioDetalle) },

  // ESTRUCTURA PARA SOCIOS
  {
    path: 'socio',
    canActivate: [authGuard],
    loadComponent: () => import('./components/socio/dashboardSocio/dashboardSocio').then(m => m.Dashboard),
    children: [
      { path: 'noticias', loadComponent: () => import('./components/noticias/noticias')
        .then(m => m.Noticias) },
        {path: 'planes', loadComponent: () => import('./components/planes/planes').then(m => m.Planes)},
      { path: 'perfil', loadComponent: () => import('./components/socio/perfil/perfil')
        .then(m => m.Perfil) },
      { path: 'mi-rutina', loadComponent: () => import('./components/socio/mi-rutina/mi-rutina')
        .then(m => m.MiRutina) },
   { path: '', redirectTo: 'noticias', pathMatch: 'full' }
    ]
  },

  

  { path: '**', redirectTo: '/login' }
];