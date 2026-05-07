import { Component, OnDestroy, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface ConfettiPieza {
  id: number;
  left: number;
  delay: number;
  color: string;
  size: number;
  duration: number;
  isCircle: boolean;
}

const KEY_END  = 'crono_endTime';
const KEY_TOTAL = 'crono_total';
const KEY_PAUSE = 'crono_paused';

@Component({
  selector: 'app-cronometro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cronometro.html',
  styleUrl: './cronometro.css'
})
export class Cronometro implements OnInit, OnDestroy {
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
  enRutaSocio = false;

  private intervalo: any = null;
  private routeSub: any = null;
  private notifTimeout: any = null;
  private readonly COLORES = ['#cc0000','#22c55e','#3b82f6','#f97316','#a855f7','#eab308','#ec4899'];

  private onVisibilityChange = () => {
    if (document.visibilityState === 'visible') this.sincronizarDesdeStorage();
  };

  constructor(private cdr: ChangeDetectorRef, private router: Router) {}

  ngOnInit() {
    this.enRutaSocio = this.router.url.startsWith('/socio');
    this.routeSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.enRutaSocio = e.urlAfterRedirects.startsWith('/socio');
        this.cdr.detectChanges();
      });

    this.pedirPermisosNotificacion();
    this.restaurarDeStorage();
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

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
    this.limpiarStorage();
  }

  toggleTimer() {
    if (this.terminado) { this.reiniciar(); return; }
    this.activo ? this.pausar() : this.iniciar();
  }

  private iniciar() {
    this.activo = true;
    this.terminado = false;

    const endTime = Date.now() + this.tiempoRestante * 1000;
    localStorage.setItem(KEY_END, String(endTime));
    localStorage.setItem(KEY_TOTAL, String(this.tiempoTotal));
    localStorage.removeItem(KEY_PAUSE);

    this.programarNotificacion(this.tiempoRestante);
    this.lanzarIntervalo();
  }

  private lanzarIntervalo() {
    clearInterval(this.intervalo);
    this.intervalo = setInterval(() => {
      const endTime = Number(localStorage.getItem(KEY_END));
      if (endTime) {
        this.tiempoRestante = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      }
      if (this.tiempoRestante <= 0) {
        this.tiempoRestante = 0;
        this.alTerminar();
      }
      this.cdr.detectChanges();
    }, 500);
  }

  private pausar() {
    this.activo = false;
    clearInterval(this.intervalo);
    clearTimeout(this.notifTimeout);
    localStorage.removeItem(KEY_END);
    localStorage.setItem(KEY_PAUSE, String(this.tiempoRestante));
  }

  private detener() {
    this.activo = false;
    clearInterval(this.intervalo);
    clearTimeout(this.notifTimeout);
    this.limpiarStorage();
  }

  reiniciar() {
    this.detener();
    this.tiempoRestante = this.tiempoTotal;
    this.terminado = false;
    this.confettiPiezas = [];
  }

  private sincronizarDesdeStorage() {
    const endTime = Number(localStorage.getItem(KEY_END));
    if (!endTime || !this.activo) return;

    const restante = Math.ceil((endTime - Date.now()) / 1000);
    if (restante <= 0) {
      this.tiempoRestante = 0;
      this.alTerminar();
    } else {
      this.tiempoRestante = restante;
    }
    this.cdr.detectChanges();
  }

  private restaurarDeStorage() {
    const endTime = Number(localStorage.getItem(KEY_END));
    const total   = Number(localStorage.getItem(KEY_TOTAL));
    const paused  = Number(localStorage.getItem(KEY_PAUSE));

    if (endTime && total) {
      const restante = Math.ceil((endTime - Date.now()) / 1000);
      this.tiempoTotal = total;

      if (restante <= 0) {
        this.tiempoRestante = 0;
        this.limpiarStorage();
        this.alTerminar();
      } else {
        this.tiempoRestante = restante;
        this.activo = true;
        this.terminado = false;
        this.programarNotificacion(restante);
        this.lanzarIntervalo();
      }
    } else if (paused && total) {
      this.tiempoTotal    = total;
      this.tiempoRestante = paused;
    }
  }

  private limpiarStorage() {
    localStorage.removeItem(KEY_END);
    localStorage.removeItem(KEY_TOTAL);
    localStorage.removeItem(KEY_PAUSE);
  }

  private pedirPermisosNotificacion() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  private programarNotificacion(segundos: number) {
    clearTimeout(this.notifTimeout);
    this.notifTimeout = setTimeout(() => {
      if (this.activo) this.mostrarNotificacion();
    }, segundos * 1000);
  }

  private mostrarNotificacion() {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    new Notification('¡Tiempo de descanso terminado! 💪', {
      body: '¡A darle con todo, guerrero!',
      icon: '/icons/LogoGym.jpg',
      tag: 'cronometro-fin',
      requireInteraction: true
    } as NotificationOptions);
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
    this.mostrarNotificacion();
    setTimeout(() => {
      if (this.terminado) { this.reiniciar(); this.cdr.detectChanges(); }
    }, 5000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalo);
    clearTimeout(this.notifTimeout);
    this.routeSub?.unsubscribe();
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  }
}
