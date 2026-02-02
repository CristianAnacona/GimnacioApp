import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { UserStateService } from './user-state.service'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;
  private rutinasUrl = `${environment.apiUrl}/api/rutinas`;

  constructor(
    private http: HttpClient,
    private userStateService: UserStateService 
  ) {}

// auth.service.ts
private getHeaders() {
  const token = localStorage.getItem('token');
  const usuarioRaw = localStorage.getItem('usuario');
  const usuario = usuarioRaw ? JSON.parse(usuarioRaw) : {};

  return new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'user-id': usuario._id || 'publico' // 👈 Esto es vital para tu index.js
  });
}

  // --- MÉTODOS DE AUTENTICACIÓN ---
  login(credenciales: any) {
    const startTime = Date.now();
    return this.http.post(`${this.apiUrl}/login`, credenciales).pipe(
      tap((response: any) => {
        if (response.usuario) {
          this.userStateService.updateUser(response.usuario);
        }
      })
    );
  }

  registrar(usuario: any) {
    return this.http.post(`${this.apiUrl}/register`, usuario);
  }

  logout() {
    this.userStateService.updateUser(null);
  }

  // --- MÉTODOS DE GESTIÓN DE USUARIOS (Dashboard Admin) ---
  
  // 🔥 Este es el que te daba el error TS2339
getUsuarios(): Observable<any> {
  const urlSinAuth = `${environment.apiUrl}/api/auth/usuarios`; 
  return this.http.get(urlSinAuth, { headers: this.getHeaders() });
}

  // 🔥 Revisa que aquí estés pasando los días correctos
  renovarMembresia(id: string, dias: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/renovar/${id}`, { dias }, { headers: this.getHeaders() }).pipe(
      tap((res: any) => {
        // Si el admin se renueva a sí mismo, actualizamos su estado
        const currentUser = JSON.parse(localStorage.getItem('usuario') || '{}');
        if (currentUser._id === id) {
          this.userStateService.updateUser(res.usuario);
        }
      })
    );
  }

  limpiarMembresia(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/limpiar-membresia/${id}`, {}, { headers: this.getHeaders() });
  }

  // --- MÉTODOS DE PERFIL ---
  
  getPerfilSocio(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/perfil/${id}`).pipe(
      tap((perfil: any) => {
        this.userStateService.updateUser(perfil);
      })
    );
  }

  obtenerPerfil(userId: string): Observable<any> {
    return this.getPerfilSocio(userId);
  }

actualizarPerfil(id: string, datos: any) {
  // Asegúrate de que environment.apiUrl sea 'http://localhost:3000' 
  // y no incluya ya el '/api/auth'
  const url = `${environment.apiUrl}/api/auth/actualizar-perfil/${id}`;
  
  const token = localStorage.getItem('token');
  const headers = { 'Authorization': `Bearer ${token}` };

  return this.http.put(url, datos, { headers });
}

  // --- MÉTODOS DE RUTINAS ---
// --- MÉTODOS DE RUTINAS CORREGIDOS ---

obtenerRutina(usuarioId: string) {
  // Añadimos headers para romper el caché (304)
  return this.http.get(`${this.rutinasUrl}/${usuarioId}`, { headers: this.getHeaders() });
}

asignarRutina(datos: any) {
  return this.http.post(`${this.rutinasUrl}/asignar`, datos, { headers: this.getHeaders() });
}

actualizarRutina(idRutina: string, datos: any) {
  return this.http.put(`${this.rutinasUrl}/actualizar/${idRutina}`, datos, { headers: this.getHeaders() });
}

eliminarRutina(idRutina: string) {
  // Coincide con router.delete('/eliminar/:id', ...)
  return this.http.delete(`${this.rutinasUrl}/eliminar/${idRutina}`, { headers: this.getHeaders() });
}
}