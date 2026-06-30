import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { StorageService } from '../services/storage.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const storageService = inject(StorageService);
  const token = storageService.getToken();
  const gym   = localStorage.getItem('gymActual');

  // Sin gym seleccionado → selector
  if (!gym) {
    router.navigate(['/gimnasios']);
    return false;
  }

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  if (storageService.isTokenExpired()) {
    storageService.clearSessionPreservingData();
    router.navigate(['/login']);
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    const role = payload.role?.toLowerCase().trim();

    // Zona admin: solo admin o superadmin.
    if (state.url.startsWith('/admin') && role !== 'admin' && role !== 'superadmin') {
      router.navigate(['/socio']);
      return false;
    }

    // Zona socio: solo socio (admin/superadmin tienen su propio panel).
    if (state.url.startsWith('/socio') && role !== 'socio') {
      router.navigate(['/admin']);
      return false;
    }

    return true;
  } catch {
    storageService.clearSessionPreservingData();
    router.navigate(['/login']);
    return false;
  }
};
