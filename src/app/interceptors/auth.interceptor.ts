import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storageService = inject(StorageService);
  const token = storageService.getToken();
  const usuarioRaw = localStorage.getItem('usuario');
  const usuario = usuarioRaw ? JSON.parse(usuarioRaw) : {};

  const authReq = token
    ? req.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`,
          'user-id': usuario._id || 'publico'
        }
      })
    : req;

  const router = inject(Router);

  return next(authReq).pipe(
    catchError(err => {
      if (err.status === 401) {
        // Preservar cronómetro y preferencias al cerrar sesión por token inválido
        storageService.clearSessionPreservingData();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};
