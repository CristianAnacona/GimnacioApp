import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;
  private rutinasUrl = `${environment.apiUrl}/api/rutinas`;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // --- MÉTODOS DE USUARIO ---
  registrar(usuario: any) {
    return this.http.post(`${this.apiUrl}/register`, usuario);
  }

  login(credenciales: any) {
    return this.http.post(`${this.apiUrl}/login`, credenciales);
  }

  getUsuarios() {
    return this.http.get(`${this.apiUrl}/usuarios`, { headers: this.getHeaders() });
  }

  renovarMembresia(id: string, dias: number) {
    return this.http.put(`${this.apiUrl}/renovar/${id}`, { dias }, { headers: this.getHeaders() });
  }

  limpiarMembresia(id: string) {
    return this.http.put(`${this.apiUrl}/limpiar-membresia/${id}`, {}, { headers: this.getHeaders() });
  }

  logout() {
    localStorage.clear();
  }

  // --- MÉTODOS DE RUTINAS (MODO CREAR/ACTUALIZAR) ---

  // Obtener las rutinas de un socio específico
  obtenerRutina(usuarioId: string) {
    return this.http.get(`${this.rutinasUrl}/${usuarioId}`);
  }

  // Opción A: Crear nueva (POST)
  asignarRutina(datos: any) {
    return this.http.post(`${this.rutinasUrl}/asignar`, datos);
  }

  // Opción B: Actualizar existente (PUT)
  // Usamos el ID de la RUTINA para saber cuál sobreescribir
  actualizarRutina(idRutina: string, datos: any) {
    return this.http.put(`${this.rutinasUrl}/actualizar/${idRutina}`, datos);
  }

  // Opción C: Eliminar (DELETE)
  eliminarRutina(idRutina: string) {
    return this.http.delete(`${this.rutinasUrl}/eliminar/${idRutina}`);
  }
}