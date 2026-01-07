import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  // Obtener headers con el token de autenticación
  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Registrar nuevo usuario
  registrar(usuario: any) {
    return this.http.post(`${this.apiUrl}/register`, usuario);
  }

  // Iniciar sesión
  login(credenciales: any) {
    return this.http.post(`${this.apiUrl}/login`, credenciales);
  }

  // Obtener lista de usuarios (solo admin)
  getUsuarios() {
    return this.http.get(`${this.apiUrl}/usuarios`, {
      headers: this.getHeaders()
    });
  }

  // Renovar membresía de un usuario
  renovarMembresia(id: string, dias: number) {
    return this.http.put(`${this.apiUrl}/renovar/${id}`, { dias }, {
      headers: this.getHeaders()
    });
  }

  // Logout - limpiar datos
  logout() {
    localStorage.clear();
  }
  // En tu servicio auth.service.ts
limpiarMembresia(id: string) {
  return this.http.put(`${this.apiUrl}/limpiar-membresia/${id}`, {});
}
}