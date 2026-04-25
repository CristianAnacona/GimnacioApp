import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgresoService } from '../../../services/progreso.service';
import { UserStateService } from '../../../services/user-state.service';

interface Punto { fecha: string; peso: number | null; reps: number | null; }

@Component({
  selector: 'app-progreso',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './progreso.html',
  styleUrl: './progreso.css'
})
export class Progreso implements OnInit {
  usuarioId = '';
  ejercicios: string[] = [];
  ejercicioSeleccionado = '';
  historial: Punto[] = [];
  cargando = false;
  modo: 'peso' | 'reps' = 'peso';

  // SVG config
  readonly W = 320;
  readonly H = 180;
  readonly PAD = { top: 16, right: 16, bottom: 36, left: 44 };

  constructor(
    private progresoService: ProgresoService,
    private userState: UserStateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = this.userState.getCurrentUser();
    if (user?._id) {
      this.usuarioId = user._id;
      this.cargarEjercicios();
    }
  }

  cargarEjercicios() {
    this.progresoService.getEjercicios(this.usuarioId).subscribe({
      next: (data) => { this.ejercicios = data; this.cdr.detectChanges(); },
      error: (err) => console.error(err)
    });
  }

  seleccionarEjercicio(nombre: string) {
    this.ejercicioSeleccionado = nombre;
    this.cargando = true;
    this.progresoService.getHistorial(this.usuarioId, nombre).subscribe({
      next: (data) => {
        this.historial = data.map(r => ({
          fecha: new Date(r.fecha).toLocaleDateString('es', { day: '2-digit', month: 'short' }),
          peso: r.pesoKg,
          reps: r.repeticiones
        }));
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => { this.cargando = false; }
    });
  }

  // --- SVG helpers ---
  get datos(): (number | null)[] {
    return this.historial.map(p => this.modo === 'peso' ? p.peso : p.reps);
  }

  get valoresValidos(): number[] {
    return this.datos.filter(v => v !== null) as number[];
  }

  get minVal(): number { return this.valoresValidos.length ? Math.min(...this.valoresValidos) : 0; }
  get maxVal(): number { return this.valoresValidos.length ? Math.max(...this.valoresValidos) : 10; }

  get innerW(): number { return this.W - this.PAD.left - this.PAD.right; }
  get innerH(): number { return this.H - this.PAD.top - this.PAD.bottom; }

  xPos(i: number): number {
    const n = this.historial.length;
    return this.PAD.left + (n <= 1 ? this.innerW / 2 : (i / (n - 1)) * this.innerW);
  }

  yPos(val: number | null): number {
    if (val === null) return this.PAD.top + this.innerH / 2;
    const rng = this.maxVal - this.minVal || 1;
    return this.PAD.top + this.innerH - ((val - this.minVal) / rng) * this.innerH;
  }

  get polyline(): string {
    return this.historial
      .map((_, i) => `${this.xPos(i)},${this.yPos(this.datos[i])}`)
      .join(' ');
  }

  get areaPath(): string {
    if (!this.historial.length) return '';
    const pts = this.historial.map((_, i) => `${this.xPos(i)},${this.yPos(this.datos[i])}`).join(' ');
    const last = this.historial.length - 1;
    const bottom = this.PAD.top + this.innerH;
    return `M${this.PAD.left},${bottom} L${pts.split(' ').join(' L')} L${this.xPos(last)},${bottom} Z`;
  }

  yLabels(): { val: string; y: number }[] {
    const rng = this.maxVal - this.minVal || 1;
    return [0, 0.5, 1].map(f => ({
      val: (this.minVal + rng * f).toFixed(0),
      y: this.PAD.top + this.innerH - f * this.innerH
    }));
  }

  get mejora(): string {
    const v = this.valoresValidos;
    if (v.length < 2) return '';
    const diff = v[v.length - 1] - v[0];
    const pct = ((diff / v[0]) * 100).toFixed(0);
    return diff >= 0 ? `+${pct}%` : `${pct}%`;
  }

  get mejoraPositiva(): boolean {
    const v = this.valoresValidos;
    return v.length >= 2 && v[v.length - 1] >= v[0];
  }
}
