import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role')?.toLowerCase().trim();

  if (token) {
    // Si ya hay sesión, redirige según el rol
    if (role === 'admin') {
      router.navigate(['/admin']);
    } else {
      router.navigate(['/socio']);
    }
    return false;
  }

  // Si no hay sesión, permite ver login
  return true;
};