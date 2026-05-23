import { Injectable } from '@angular/core';

/**
 * Servicio centralizado para gestión de localStorage
 * Evita pérdida de datos importantes (cronómetro, preferencias) al limpiar la sesión
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  // Claves que se preservan al limpiar la sesión de autenticación
  private readonly PRESERVED_KEYS = [
    'gymActual',           // Gym seleccionado
    'crono_endTime',       // Estado del cronómetro
    'crono_total',
    'crono_paused',
    'theme',               // Tema dark/light
    'ultimoResetRutina',   // Control de reset diario
    'progreso_formIdx',    // Formulario de progreso abierto
    'progreso_formData',   // Datos del formulario de progreso
    'progreso_ejercicio'   // Ejercicio del formulario
  ];

  // Claves relacionadas con autenticación que se deben eliminar
  private readonly AUTH_KEYS = [
    'token',
    'usuario',
    'userId',
    'role',
    'nombre'
  ];

  /**
   * Limpia SOLO los datos de autenticación, preservando cronómetro y preferencias
   */
  clearAuthSession(): void {
    this.AUTH_KEYS.forEach(key => localStorage.removeItem(key));
  }

  /**
   * Limpia TODO el localStorage (usar solo en casos extremos)
   */
  clearAll(): void {
    localStorage.clear();
  }

  /**
   * Limpia la sesión completa pero preserva claves específicas
   */
  clearSessionPreservingData(): void {
    // Guardar datos a preservar
    const preserved: Record<string, string | null> = {};
    this.PRESERVED_KEYS.forEach(key => {
      preserved[key] = localStorage.getItem(key);
    });

    // Limpiar todo
    localStorage.clear();

    // Restaurar datos preservados
    Object.entries(preserved).forEach(([key, value]) => {
      if (value !== null) {
        localStorage.setItem(key, value);
      }
    });
  }

  /**
   * Obtiene el token actual
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Guarda el token
   */
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  /**
   * Verifica si el token está expirado
   */
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  /**
   * Obtiene el tiempo restante del token en milisegundos
   */
  getTokenTimeRemaining(): number {
    const token = this.getToken();
    if (!token) return 0;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Math.max(0, payload.exp * 1000 - Date.now());
    } catch {
      return 0;
    }
  }

  /**
   * Verifica si el token expira pronto (menos de 24 horas)
   */
  isTokenExpiringSoon(): boolean {
    const remaining = this.getTokenTimeRemaining();
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    return remaining > 0 && remaining < ONE_DAY_MS;
  }
}
