import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { GymService, Gym } from '../../services/gym.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-gym-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './gym-selector.html',
  styleUrl: './gym-selector.css'
})
export class GymSelector implements OnInit, OnDestroy {
  query = '';
  gyms: Gym[] = [];
  cargando = false;
  buscado = false;

  private query$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private gymService: GymService,
    private themeService: ThemeService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Carga inicial — muestra todos los gyms disponibles
    this.buscarGyms('');

    // Debounce de 350ms al escribir
    this.query$
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(q => this.buscarGyms(q));
  }

  onInput() {
    this.query$.next(this.query);
  }

  buscarGyms(q: string) {
    this.cargando = true;
    this.gymService.buscar(q).subscribe({
      next: (data) => {
        this.gyms = data;
        this.cargando = false;
        this.buscado = true;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando = false;
        this.buscado = true;
        this.cdr.detectChanges();
      }
    });
  }

  seleccionar(gym: Gym) {
    this.gymService.guardarGym(gym);
    this.themeService.aplicar(gym);
    // Limpia sesión anterior para forzar nuevo login en el gym seleccionado
    const gymActual = localStorage.getItem('gymActual');
    localStorage.clear();
    if (gymActual) localStorage.setItem('gymActual', gymActual);
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
