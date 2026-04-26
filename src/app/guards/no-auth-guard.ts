import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const role  = localStorage.getItem('role')?.toLowerCase().trim();
  const gym   = localStorage.getItem('gymActual');

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) {
        localStorage.clear();
        if (gym) localStorage.setItem('gymActual', gym);
        return true;
      }
      // Sesión activa → redirigir según rol
      if (payload.role === 'superadmin') { router.navigate(['/plataforma']); return false; }
    } catch {
      localStorage.clear();
      if (gym) localStorage.setItem('gymActual', gym);
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
