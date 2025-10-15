import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

interface CurrentUser { username: string }

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent {
  user$: Observable<CurrentUser | null>;

  constructor(private auth: AuthService) {
    this.user$ = this.auth.user$;
  }

  logout() {
    this.auth.clearUser();
  }
}
