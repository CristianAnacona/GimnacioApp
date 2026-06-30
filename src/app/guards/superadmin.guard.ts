import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const superAdminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  if (!token) { router.navigate(['/login']); return false; }

  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    const expirado = !payload.exp || payload.exp * 1000 < Date.now();
    if (!expirado && payload.role?.toLowerCase().trim() === 'superadmin') return true;
  } catch {}

  router.navigate(['/login']);
  return false;
};
