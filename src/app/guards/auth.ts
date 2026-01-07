
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token'); // Busca el permiso en el navegador

  if (token) {
    return true; // Si hay token, ¡pasa adelante!
  } else {
    // Si no hay token, lo mandamos al login y bloqueamos el paso
    router.navigate(['/login']);
    return false;
  }
};

