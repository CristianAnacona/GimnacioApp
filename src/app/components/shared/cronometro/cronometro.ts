import { Component, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ConfettiPieza {
  id: number;
  left: number;
  delay: number;
  color: string;
  size: number;
  duration: number;
  isCircle: boolean;
}

@Component({
  selector: 'app-cronometro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cronometro.html',
  styleUrl: './cronometro.css'
})
export class Cronometro implements OnDestroy {
  presets = [
    { label: '30s', segundos: 30 },
    { label: '60s', segundos: 60 },
    { label: '90s', segundos: 90 },
    { label: '2min', segundos: 120 },
  ];

  tiempoTotal = 60;
  tiempoRestante = 60;
  activo = false;
  terminado = false;
  minimizado = true;
  confettiPiezas: ConfettiPieza[] = [];

  private intervalo: any = null;
  private readonly COLORES = ['#cc0000','#22c55e','#3b82f6','#f97316','#a855f7','#eab308','#ec4899'];

  constructor(private cdr: ChangeDetectorRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('app-cronometro')) this.minimizado = true;
  }

  onClickInterno(event: MouseEvent) { event.stopPropagation(); }

  get progreso(): number {
    return this.tiempoTotal > 0 ? this.tiempoRestante / this.tiempoTotal : 1;
  }
  get circunferencia(): number { return 2 * Math.PI * 44; }
  get dashOffset(): number { return this.circunferencia * (1 - this.progreso); }
  get minutos(): string { return String(Math.floor(this.tiempoRestante / 60)).padStart(2, '0'); }
  get segundosDisplay(): string { return String(this.tiempoRestante % 60).padStart(2, '0'); }
  get casiTerminado(): boolean { return this.tiempoRestante <= 10 && this.activo && !this.terminado; }

  abrir(event: MouseEvent) { event.stopPropagation(); this.minimizado = false; }

  seleccionarPreset(segundos: number) {
    this.detener();
    this.tiempoTotal = segundos;
    this.tiempoRestante = segundos;
    this.terminado = false;
    this.confettiPiezas = [];
  }

  toggleTimer() {
    if (this.terminado) { this.reiniciar(); return; }
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
      this.cdr.detectChanges();
    }, 1000);
  }

  private pausar() { this.activo = false; clearInterval(this.intervalo); }
  private detener() { this.activo = false; clearInterval(this.intervalo); }

  reiniciar() {
    this.detener();
    this.tiempoRestante = this.tiempoTotal;
    this.terminado = false;
    this.confettiPiezas = [];
  }

  private generarConfetti() {
    this.confettiPiezas = Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: 5 + Math.random() * 90,
      delay: Math.random() * 0.8,
      color: this.COLORES[Math.floor(Math.random() * this.COLORES.length)],
      size: 7 + Math.random() * 8,
      duration: 2.2 + Math.random() * 1.5,
      isCircle: Math.random() > 0.5
    }));
  }

  private alTerminar() {
    this.detener();
    this.terminado = true;
    this.generarConfetti();
    if ('vibrate' in navigator) navigator.vibrate([400, 150, 400, 150, 400]);
    setTimeout(() => {
      if (this.terminado) { this.reiniciar(); this.cdr.detectChanges(); }
    }, 5000);
  }

  ngOnDestroy() { clearInterval(this.intervalo); }
}
