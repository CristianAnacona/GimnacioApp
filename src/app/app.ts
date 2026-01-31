import { HttpClient } from '@angular/common/http';
import { noAuthGuard } from './guards/no-auth-guard';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment'; // AGREGAR

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');

  // ⚡ AGREGAR: Inyectar HttpClient
  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Pre-calentar el servidor
    this.prewarmServer();
  }

  // ⚡ MEJOR: Crear un método separado
  private prewarmServer() {
    const apiUrl = environment.apiUrl || 'https://gimnacioapp-backend-1.onrender.com';
    
    console.log('🔥 Pre-calentando servidor...');
    
    this.http.get(`${apiUrl}/health`).subscribe({
      next: () => console.log('✅ Servidor listo y despierto'),
      error: (err) => {
        console.log('⏳ Servidor despertando, esto puede tomar 30-60 segundos...');
        // Opcional: reintentar después de 30 segundos
        setTimeout(() => {
          this.http.get(`${apiUrl}/health`).subscribe({
            next: () => console.log('✅ Servidor ahora está despierto'),
            error: () => console.log('⚠️ Servidor aún no responde')
          });
        }, 30000);
      }
    });
  }
}