import { Routes } from '@angular/router';
import { authGuard } from './guards/auth';

export const routes: Routes = [
  {
    path: 'login',
    // IMPORTANTE: m.Login debe coincidir con el nombre en tu archivo login.ts
    loadComponent: () => import('./components/auth/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    // Verifica si en tu archivo de registro la clase se llama 'Register' o 'RegisterComponent'
    loadComponent: () => import('./components/auth/register/register').then(m => m.Register)
  },
  {
    path: 'home', // Nueva ruta para el home
    canActivate: [authGuard], // Protegida por el guardia de autenticación
    loadComponent: () => import('./components/home/home').then(m => m.HomeComponent)
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },

  //Rutas para el dashboard de administración
 
];