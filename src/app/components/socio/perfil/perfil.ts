import { RouterModule } from '@angular/router';
import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from '../../../services/auth';



@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {
perfil: any = null;

constructor( private authService: AuthService, private cdr: ChangeDetectorRef) {}

ngOnInit() {
    const usuarioString = localStorage.getItem('usuario');
    if (usuarioString) {
      const usuarioObj = JSON.parse(usuarioString);
      this.cargarPerfil(usuarioObj._id);
    }
  }

  cargarPerfil(id: string) {
    this.authService.getPerfilSocio(id).subscribe({
      next: (data) => {
        this.perfil = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al traer el perfil', err)
    });
  }
}
