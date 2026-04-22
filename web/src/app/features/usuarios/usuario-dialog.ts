import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { UsuarioService } from '../../core/services/usuario.service';
import { UsuarioResponse, UsuarioUpdate } from '../../models/api.models';
import { MatSelectModule } from '@angular/material/select'; //importé MatSelectModule para el campo tipo_documento

export interface UsuarioDialogData {
  mode: 'create' | 'edit';
  row?: UsuarioResponse;
}

@Component({
  selector: 'app-usuario-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule,
  ],
  templateUrl: './usuario-dialog.html',
})
export class UsuarioDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly usuarioService = inject(UsuarioService);
  private readonly dialogRef = inject(MatDialogRef<UsuarioDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<UsuarioDialogData>(MAT_DIALOG_DATA);

  readonly form = this.fb.nonNullable.group({
      nombre_usuario: ['', Validators.required],
      tipo_documento: ['', Validators.required],
      documento_identidad: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.minLength(4)]], //Validators.required lo elimine para que no sea obligatorio en modo edición 
      rol: ['admin', Validators.required],
      activo: [true],
  });

  constructor() {
    if (this.data.mode === 'edit' && this.data.row) {
      const r = this.data.row;
      this.form.patchValue({
        nombre_usuario: r.nombre_usuario,
        tipo_documento: r.tipo_documento,
        documento_identidad: r.documento_identidad,
        email: r.email,
        contrasena: '',
        rol: r.rol,
        activo: r.activo,
      });
    }
    if (this.data.mode === 'create') {
      this.form.controls.contrasena.setValidators([Validators.required, Validators.minLength(4)]);
      this.form.controls.contrasena.updateValueAndValidity();
    }
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    if (this.data.mode === 'create') {
      this.usuarioService
        .create({
          nombre_usuario: v.nombre_usuario,
          tipo_documento: v.tipo_documento,
          documento_identidad: v.documento_identidad,
          email: v.email,
          contrasena: v.contrasena,
          rol: v.rol,
          activo: v.activo,
        })
        .subscribe({
          next: () => this.dialogRef.close(true),
          error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
        });
      return;
    }
    const id = this.data.row!.id_usuario;
    const body: UsuarioUpdate = {
      nombre_usuario: v.nombre_usuario,
      tipo_documento: v.tipo_documento,
      documento_identidad: v.documento_identidad,
      email: v.email,
      rol: v.rol,
      activo: v.activo,
    };
    if (v.contrasena?.trim()) {
      body.contrasena = v.contrasena;
    }
    this.usuarioService.update(id, body).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
    });
  }

  private msg(err: HttpErrorResponse): string {
    const d = err.error?.detail;
    if (typeof d === 'string') return d;
    if (Array.isArray(d)) return d.map((x) => x.msg ?? JSON.stringify(x)).join('; ');
    return err.message;
  }
}