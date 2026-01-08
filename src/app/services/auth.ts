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
  // Asignar rutina a un usuario
  // En auth.service.ts

// En auth.service.ts
asignarRutina(datos: any) {
  // Forzamos la ruta que configuraste en tu index.js del backend
  return this.http.post('http://localhost:3000/api/rutinas/asignar', datos);
}

// 2. Para que el Socio o el Admin modifiquen una rutina existente
actualizarRutina(idRutina: string, datosActualizados: any) {
  return this.http.put(`${this.apiUrl}/rutinas/actualizar/${idRutina}`, datosActualizados);
}

// 3. Para obtener la rutina de un socio
// auth.service.ts
// En auth.service.ts
// auth.service.ts
obtenerRutina(usuarioId: string) {
  // Asegúrate de que la ruta coincida con tu backend de Node.js
  return this.http.get(`http://localhost:3000/api/rutinas/${usuarioId}`);
}
}