import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Notification } from './components/shared/notification/notification';
import { Cronometro } from './components/shared/cronometro/cronometro';
import { UserStateService } from './services/user-state.service';
import { UpdateService } from './services/update.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Notification, Cronometro, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  userState = inject(UserStateService);
  private _update = inject(UpdateService);
}
