import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
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
        localStorage.clear();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};
