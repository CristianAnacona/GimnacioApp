import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role')?.toLowerCase().trim();

  // Si no hay token, redirige a login
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  // Si intenta ir a /admin sin ser admin, redirige a /socio
  if (state.url.includes('/admin') && role !== 'admin') {
    router.navigate(['/socio']); 
    return false;
  }

  return true;
};