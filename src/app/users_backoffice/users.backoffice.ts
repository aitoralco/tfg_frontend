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
    MatFormFieldModule
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

  editUser(user: any){ }

  deleteUser(user: any){ }
}