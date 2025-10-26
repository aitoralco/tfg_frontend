import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { UserInterface as CurrentUser } from '../auth/userInterface';
import { NgIf } from '@angular/common';
import { OnInit } from '@angular/core';


@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [
    RouterModule, 
    CommonModule,
    NgIf,
  ],
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {
  user$: Observable<CurrentUser | null>;

  constructor(private auth: AuthService) {
    this.user$ = this.auth.user$;
  }

  ngOnInit() {
    // Any initialization logic can go here
  }

  logout() {
    this.auth.clearUser();
  }
}
