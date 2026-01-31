import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, timeout } from 'rxjs/operators';
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

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // --- MÉTODOS DE AUTENTICACIÓN ---
  login(credenciales: any) {
    return this.http.post(`${this.apiUrl}/login`, credenciales).pipe(
      timeout(5000),
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
    return this.http.get(`${this.apiUrl}/usuarios`, { headers: this.getHeaders() });
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

  actualizarPerfil(id: string, datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/actualizar-perfil/${id}`, datos).pipe(
      tap((res: any) => {
        const user = res.usuario || res;
        this.userStateService.updateUser(user);
      })
    );
  }

  // --- MÉTODOS DE RUTINAS ---
  obtenerRutina(usuarioId: string) {
    return this.http.get(`${this.rutinasUrl}/${usuarioId}`);
  }

  asignarRutina(datos: any) {
    return this.http.post(`${this.rutinasUrl}/asignar`, datos, { headers: this.getHeaders() });
  }

  actualizarRutina(idRutina: string, datos: any) {
    return this.http.put(`${this.rutinasUrl}/actualizar/${idRutina}`, datos, { headers: this.getHeaders() });
  }

  eliminarRutina(idRutina: string) {
    return this.http.delete(`${this.rutinasUrl}/eliminar/${idRutina}`, { headers: this.getHeaders() });
  }
}