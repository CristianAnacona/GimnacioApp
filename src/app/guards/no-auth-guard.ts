import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role')?.toLowerCase().trim();

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) {
        localStorage.clear();
        return true;
      }
    } catch {
      localStorage.clear();
      return true;
    }

    if (role === 'admin') {
      router.navigate(['/admin']);
    } else {
      router.navigate(['/socio']);
    }
    return false;
  }

  return true;
};