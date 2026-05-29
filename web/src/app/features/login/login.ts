import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';

import { AuditContextService } from '../../core/audit-context.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { AuthService } from '../../core/services/auth.service';
import { UsuarioResponse } from '../../models/api.models';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly usuarioService = inject(UsuarioService);
  private readonly audit = inject(AuditContextService);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);
  private readonly authService = inject(AuthService);

  readonly loading = signal(true);
  readonly usuarios = signal<UsuarioResponse[]>([]);

  readonly loginForm = this.fb.nonNullable.group({
    nombre_usuario: ['', Validators.required],
    clave: ['', Validators.required],
  });

  readonly firstUserForm = this.fb.nonNullable.group({
    nombre_usuario: ['', Validators.required],
    tipo_documento: ['', Validators.required],
    documento_identidad: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(4)]],
    rol: ['admin', Validators.required],
  });

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.loading.set(true);
    this.usuarioService.list().subscribe({
      next: (rows) => {
        this.usuarios.set(rows);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.usuarios.set([]);
      },
    });
  }

  ingresar(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { nombre_usuario, clave } = this.loginForm.getRawValue();

    this.authService.login({ nombre_usuario, contrasena: clave }).subscribe({
      next: (res) => {
        // Guardar token
        localStorage.setItem('token', res.access_token);

        // Extraer user_id del payload del JWT y guardarlo en audit
        const payload: any = JSON.parse(atob(res.access_token.split('.')[1]));
        this.audit.select(payload.user_id);

        void this.router.navigateByUrl('/app');
      },
      error: (err: HttpErrorResponse) => {
        this.snack.open(this.msg(err), 'Cerrar', { duration: 5000 });
      },
    });
  }

  crearPrimero(): void {
    if (this.firstUserForm.invalid) {
      this.firstUserForm.markAllAsTouched();
      return;
    }
    const v = this.firstUserForm.getRawValue();

    // ✅ CORREGIDO: primero crea el usuario, luego hace login para obtener el token JWT
    this.usuarioService.create({
      nombre_usuario: v.nombre_usuario,
      tipo_documento: v.tipo_documento,
      documento_identidad: v.documento_identidad,
      email: v.email,
      contrasena: v.contrasena,
      rol: v.rol,
      activo: true,
    }).subscribe({
      next: () => {
        // Una vez creado, hacer login para obtener el token real
        this.authService.login({
          nombre_usuario: v.nombre_usuario,
          contrasena: v.contrasena,
        }).subscribe({
          next: (res) => {
            localStorage.setItem('token', res.access_token);
            const payload: any = JSON.parse(atob(res.access_token.split('.')[1]));
            this.audit.select(payload.user_id);
            void this.router.navigateByUrl('/app');
          },
          error: (err: HttpErrorResponse) => {
            // Usuario creado pero login falló — redirigir igual y avisar
            this.snack.open('Usuario creado. Inicia sesión manualmente.', 'OK', { duration: 5000 });
            this.reload();
          },
        });
      },
      error: (err: HttpErrorResponse) =>
        this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
    });
  }

  private msg(err: HttpErrorResponse): string {
    const d = err.error?.detail;
    if (typeof d === 'string') return d;
    if (Array.isArray(d)) return d.map((x) => x.msg ?? JSON.stringify(x)).join('; ');
    return err.message;
  }
}