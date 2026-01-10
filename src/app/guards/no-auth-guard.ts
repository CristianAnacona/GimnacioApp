import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    // Si ya hay sesión, redirige al dashboard
    router.navigate(['/socio']);
    return false;
  }

  // Si no hay sesión, permite ver login
  return true;
};