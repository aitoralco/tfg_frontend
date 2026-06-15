import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navigation-bar',
  imports: [RouterLink, RouterLinkActive, MatIconModule, AsyncPipe],
  templateUrl: './navigation-bar.html',
  styleUrl: './navigation-bar.css',
})
export class NavigationBar {
  readonly authService = inject(AuthService);

  onLogout() {
    this.authService.logout();
  }
}
