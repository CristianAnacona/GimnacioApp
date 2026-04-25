import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Notification } from './components/shared/notification/notification';
import { Cronometro } from './components/shared/cronometro/cronometro';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Notification, Cronometro],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
