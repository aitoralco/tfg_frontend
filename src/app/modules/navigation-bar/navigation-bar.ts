import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-navigation-bar',
  imports: [RouterLink, RouterLinkActive, MatIconModule, AsyncPipe],
  templateUrl: './navigation-bar.html',
  styleUrl: './navigation-bar.css',
})
export class NavigationBar {
  // si es publico el html puede ver el authService
  constructor(public authService: AuthService) {}

  onLogout() {
    this.authService.logout();
  }
}
