import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cronometro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cronometro.html',
  styleUrl: './cronometro.css'
})
export class Cronometro implements OnDestroy {
  presets = [
    { label: '45s', segundos: 45 },
    { label: '60s', segundos: 60 },
    { label: '90s', segundos: 90 },
    { label: '2min', segundos: 120 },
  ];

  tiempoTotal = 60;
  tiempoRestante = 60;
  activo = false;
  terminado = false;
  minimizado = false;

  private intervalo: any = null;

  get progreso(): number {
    return this.tiempoTotal > 0 ? this.tiempoRestante / this.tiempoTotal : 1;
  }

  get circunferencia(): number { return 2 * Math.PI * 44; }

  get dashOffset(): number {
    return this.circunferencia * (1 - this.progreso);
  }

  get minutos(): string {
    return String(Math.floor(this.tiempoRestante / 60)).padStart(2, '0');
  }

  get segundosDisplay(): string {
    return String(this.tiempoRestante % 60).padStart(2, '0');
  }

  seleccionarPreset(segundos: number) {
    this.detener();
    this.tiempoTotal = segundos;
    this.tiempoRestante = segundos;
    this.terminado = false;
  }

  toggleTimer() {
    if (this.terminado) {
      this.reiniciar();
      return;
    }
    this.activo ? this.pausar() : this.iniciar();
  }

  private iniciar() {
    this.activo = true;
    this.terminado = false;
    this.intervalo = setInterval(() => {
      this.tiempoRestante--;
      if (this.tiempoRestante <= 0) {
        this.tiempoRestante = 0;
        this.alTerminar();
      }
    }, 1000);
  }

  private pausar() {
    this.activo = false;
    clearInterval(this.intervalo);
  }

  private detener() {
    this.activo = false;
    clearInterval(this.intervalo);
  }

  reiniciar() {
    this.detener();
    this.tiempoRestante = this.tiempoTotal;
    this.terminado = false;
  }

  private alTerminar() {
    this.detener();
    this.terminado = true;
    if ('vibrate' in navigator) {
      navigator.vibrate([400, 150, 400, 150, 400]);
    }
    // Auto-reset after 3 seconds
    setTimeout(() => {
      if (this.terminado) this.reiniciar();
    }, 3000);
  }

  toggleMinimizar() {
    this.minimizado = !this.minimizado;
  }

  ngOnDestroy() {
    clearInterval(this.intervalo);
  }
}
