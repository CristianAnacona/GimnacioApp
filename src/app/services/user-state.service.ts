import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserStateService {
  private userSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  user$ = this.userSubject.asObservable();

  private getUserFromStorage() {
    const user = localStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
  }

  private getGymFromStorage() {
    const gym = localStorage.getItem('gymActual');
    return gym ? JSON.parse(gym) : null;
  }

  getCurrentUser() {
    return this.userSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  // Retorna el gymId del usuario logueado o del gym seleccionado
  getGymId(): string | null {
    return this.userSubject.value?.gymId
      || this.getGymFromStorage()?._id
      || null;
  }

  // Retorna el objeto completo del gym seleccionado
  getGym(): any {
    return this.getGymFromStorage();
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  updateUser(userData: any) {
    if (!userData) {
      localStorage.removeItem('usuario');
      this.userSubject.next(null);
      return;
    }

    const current = this.getUserFromStorage() || {};
    const nuevoEstado = {
      ...current,
      ...userData,
      fotoUrl: userData.fotoUrl || current.fotoUrl
    };

    localStorage.setItem('usuario', JSON.stringify(nuevoEstado));
    this.userSubject.next(nuevoEstado);
  }

  clearSession() {
    // Preservar el gym seleccionado para no tener que buscarlo de nuevo
    const gymActual = localStorage.getItem('gymActual');
    localStorage.clear();
    if (gymActual) localStorage.setItem('gymActual', gymActual);
    this.userSubject.next(null);
  }
}
