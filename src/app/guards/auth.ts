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

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));

    if (payload.exp * 1000 < Date.now()) {
      storageService.clearSessionPreservingData();
      router.navigate(['/login']);
      return false;
    }

    const role = payload.role?.toLowerCase().trim();

    if (state.url.includes('/admin') && role !== 'admin') {
      router.navigate(['/socio']);
      return false;
    }

    return true;
  } catch {
    storageService.clearSessionPreservingData();
    router.navigate(['/login']);
    return false;
  }
};
