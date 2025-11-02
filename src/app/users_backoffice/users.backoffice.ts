import { Component, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthService } from "../auth/auth.service";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { UserInterface as CurrentUser } from "../auth/userInterface";
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { UsersService } from "./users.service";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

@Component({
  selector: "app-users-backoffice",
  standalone: true,
  templateUrl: "./users.backoffice.html",
  styleUrls: ["./users.backoffice.scss"],
  imports: [
    CommonModule, 
    MatPaginatorModule, 
    MatSortModule,
    MatTableModule, 
    MatInputModule, 
    MatFormFieldModule,
    MatSlideToggleModule
  ], 
})
export class UsersBackoffice implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource: MatTableDataSource<CurrentUser> = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'username', 'email', 'role', 'actions'];

  constructor(
    private authService: AuthService,
    private router: Router,
    private usersService: UsersService
  ) {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
      
  }

  private loadUsers(): void {
    this.usersService.getUsers().subscribe((users) => {
      this.dataSource = new MatTableDataSource(users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log('Loaded users:', users);  
    });
  }

  editUser(user: any, status: boolean){ 
    console.log('Editing user:', user, 'Status:', status);
    this.usersService.updateUser(user.id, {
      ...user,
      role: status ? 'admin' : 'user'
    });

  }

  deleteUser(user: any){ }

  onToggleChange(event: any, user: any) {
    const checked = event.checked; // true if toggled ON, false if OFF
    console.log('Toggle state:', checked);

    // You can call another function or trigger logic here
    if (checked) {
      this.editUser(user, true);
    }
    else {
      this.editUser(user, false);
    }
  }
}