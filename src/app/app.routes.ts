import { Routes } from '@angular/router';
import { authGuard } from './guards/auth';
import { AdminDashboard } from './components/admin/dashboardAdmin/dashboardAdmin';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/auth/register/register').then(m => m.Register)
  },

  // ESTRUCTURA PARA ADMINISTRADORES
  {
    path: 'admin',
    component:AdminDashboard,
    canActivate: [authGuard],
    children: [
      { path: 'entrenadores',
         loadComponent: () => import('./components/admin/entrenadores/entrenadores')
         .then(m => m.Entrenadores) },
      { path: 'socios', loadComponent: () => import('./components/admin/socios/socios').then(m => m.Socios) },
      { path: 'pagos', loadComponent: () => import('./components/admin/pagos/pagos').then(m => m.Pagos) },
      { path: 'planes', loadComponent: () => import('./components/admin/planes/planes').then(m => m.Planes) },
      { path: 'reportes', loadComponent: () => import('./components/admin/reportes/reportes').then(m => m.Reportes) },
      { path: 'rutinas', loadComponent: () => import('./components/admin/rutinas/rutinas').then(m => m.Rutinas) },
      {path: 'aadmin/rutinas/:id', loadComponent: () => import('./components/admin/rutinas/rutinas').then(m => m.Rutinas)},
      { path: '', redirectTo: 'socios', pathMatch: 'full' }
    ]
  },

  // ESTRUCTURA PARA SOCIOS
  {
    path: 'socio',
    canActivate: [authGuard],
    loadComponent: () => import('./components/socio/dashboardSocio/dashboardSocio').then(m => m.Dashboard),
    children: [
      { path: 'perfil', loadComponent: () => import('./components/socio/perfil/perfil')
        .then(m => m.Perfil) },
      { path: 'mi-rutina', loadComponent: () => import('./components/socio/mi-rutina/mi-rutina')
        .then(m => m.MiRutina) },
      { path: '', redirectTo: 'perfil', pathMatch: 'full' }
    ]
  },

  

  { path: '**', redirectTo: '/login' }
];