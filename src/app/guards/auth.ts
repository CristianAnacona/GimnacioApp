import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role')?.toLowerCase().trim();

  if (token) {
    router.navigate(['/login']);
    return false;
  }

  if (state.url.includes('/admin') && role !== 'admin') {
    router.navigate(['/socio']); 
    return false;
  }

  return true;
};