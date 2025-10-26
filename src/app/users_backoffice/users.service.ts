import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { UserInterface } from "../auth/userInterface";

@Injectable({ providedIn: "root" })
export class UsersService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserInterface[]> {
    return this.http.get<UserInterface[]>(`${this.base}users/get_all_users`);
  }

  getUserById(id: string): Observable<UserInterface> {
    return this.http.get<UserInterface>(`${this.base}users/${id}`);
  }

  createUser(user: UserInterface): Observable<UserInterface> {
    return this.http.post<UserInterface>(`${this.base}users/register`, user);
  }

  updateUser(id: string, user: UserInterface): Observable<UserInterface> {
    return this.http.post<UserInterface>(`${this.base}users/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}users/${id}`);
  }
}