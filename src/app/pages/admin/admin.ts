import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user-model';

@Component({
  selector: 'app-admin',
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);

  users: User[] = [];
  isLoading = false;
  errorMessage = '';

  editingUserId: number | null = null;
  editForm = this.fb.group({
    username: [''],
    email: [''],
    password: [''],
    role_id: [2 as number],
  });
  editError = '';

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: users => {
        this.users = users;
        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
        this.errorMessage = err.error?.detail ?? 'Error al cargar los usuarios.';
      },
    });
  }

  startEdit(user: User) {
    this.editingUserId = user.id;
    this.editForm.patchValue({
      username: user.username,
      email: user.email,
      password: '',
      role_id: user.role.id,
    });
    this.editError = '';
  }

  cancelEdit() {
    this.editingUserId = null;
    this.editError = '';
  }

  saveEdit(userId: number) {
    const { username, email, password, role_id } = this.editForm.value;
    const body: Record<string, string | number> = { role_id: role_id! };
    if (username) body['username'] = username;
    if (email) body['email'] = email;
    if (password) body['password'] = password;

    this.userService.updateUser(userId, body as any).subscribe({
      next: updated => {
        const idx = this.users.findIndex(u => u.id === userId);
        if (idx !== -1) this.users[idx] = updated;
        this.editingUserId = null;
      },
      error: err => {
        this.editError = err.error?.detail ?? 'Error al guardar los cambios.';
      },
    });
  }

  deleteUser(userId: number) {
    if (!confirm('¿Eliminar este usuario? Esta acción no se puede deshacer.')) return;
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== userId);
      },
      error: err => alert(err.error?.detail ?? 'Error al eliminar el usuario.'),
    });
  }
}
