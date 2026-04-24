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
    localStorage.clear();
    this.userSubject.next(null);
  }
}
