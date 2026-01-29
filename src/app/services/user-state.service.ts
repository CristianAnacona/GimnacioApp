import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  private userSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  user$ = this.userSubject.asObservable();

  private getUserFromStorage() {
    const user = localStorage.getItem('usuario');
    // Si tienes el token o el role en el storage, asegúrate de que se mantengan
    return user ? JSON.parse(user) : null;
  }

  // 🔥 AGREGAMOS ESTO PARA QUITAR EL ERROR
  getCurrentUser() {
    return this.userSubject.value;
  }

 updateUser(userData: any) {
  const current = this.getUserFromStorage();

  if (!current) return;

  const nuevoEstado = {
    ...current,
    ...userData,
    fotoUrl: userData.fotoUrl || current.fotoUrl
  };

  localStorage.setItem('usuario', JSON.stringify(nuevoEstado));
  this.userSubject.next(nuevoEstado);
}

}