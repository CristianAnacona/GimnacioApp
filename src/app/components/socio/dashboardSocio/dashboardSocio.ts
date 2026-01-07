import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Navbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, Navbar],
  templateUrl: './dashboardSocio.html',
  styleUrl: './dashboardSocio.css',
})
export class Dashboard implements OnInit {
  username = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.username = localStorage.getItem('nombre') || 'Socio';
  }
  iniciarEntrenamiento() {
    this.router.navigate(['/rutinas']);
  }
  }
