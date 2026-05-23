import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { StorageService } from '../services/storage.service';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const storageService = inject(StorageService);
  const token = storageService.getToken();
  const role  = localStorage.getItem('role')?.toLowerCase().trim();
  const gym   = localStorage.getItem('gymActual');

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) {
        storageService.clearSessionPreservingData();
        return true;
      }
      // Sesión activa → redirigir según rol
      if (payload.role === 'superadmin') { router.navigate(['/plataforma']); return false; }
    } catch {
      storageService.clearSessionPreservingData();
      return true;
    }
    if (role === 'admin') router.navigate(['/admin']);
    else router.navigate(['/socio']);
    return false;
  }

  // Sin gym y sin token → selector (excepto ruta de superadmin)
  if (!gym) {
    router.navigate(['/gimnasios']);
    return false;
  }

  return true;
};
