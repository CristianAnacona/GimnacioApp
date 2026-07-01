import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { StorageService } from '../services/storage.service';

export const superAdminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const storage = inject(StorageService);
  const token = storage.getToken();
  if (!token) { router.navigate(['/login']); return false; }

  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    const expirado = !payload.exp || payload.exp * 1000 < Date.now();
    if (!expirado && payload.role?.toLowerCase().trim() === 'superadmin') return true;
  } catch { /* token ilegible → limpiar y salir */ }

  // Token presente pero inválido/expirado/sin permiso: limpiar sesión obsoleta.
  storage.clearSessionPreservingData();
  router.navigate(['/login']);
  return false;
};
