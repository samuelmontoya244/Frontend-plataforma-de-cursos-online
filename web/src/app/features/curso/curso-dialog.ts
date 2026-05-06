import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';

import { CursoService } from '../../core/services/curso.service';

import {
  CursoResponse,
  CursoUpdate,
} from '../../models/api.models';

export interface CursoDialogData {
  mode: 'create' | 'edit';
  row?: CursoResponse;
}

@Component({
  selector: 'app-curso-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './curso-dialog.html',
})
export class CursoDialogComponent {
  private readonly fb = inject(FormBuilder);

  private readonly cursoService = inject(CursoService);

  private readonly dialogRef =
    inject(MatDialogRef<CursoDialogComponent, boolean>);

  private readonly snack = inject(MatSnackBar);

  readonly data = inject<CursoDialogData>(MAT_DIALOG_DATA);

  readonly form = this.fb.nonNullable.group({
    id_categoria: ['', Validators.required],

    nombre_curso: ['', Validators.required],

    duracion_horas: [0, [Validators.required, Validators.min(1)]],

    estado_curso: ['', Validators.required],

    descripcion_curso: [''],
  });

  constructor() {
    if (this.data.mode === 'edit' && this.data.row) {
      const r = this.data.row;

      this.form.patchValue({
        id_categoria: r.id_categoria,
        nombre_curso: r.nombre_curso,
        duracion_horas: r.duracion_horas,
        estado_curso: r.estado_curso,
        descripcion_curso: r.descripcion_curso ?? '',
      });
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

    // CREATE
    if (this.data.mode === 'create') {
      this.cursoService
        .create({
          id_categoria: v.id_categoria,
          nombre_curso: v.nombre_curso,
          duracion_horas: v.duracion_horas,
          estado_curso: v.estado_curso,
          descripcion_curso: v.descripcion_curso,
        })
        .subscribe({
          next: () => this.dialogRef.close(true),

          error: (err: HttpErrorResponse) =>
            this.snack.open(this.msg(err), 'Cerrar', {
              duration: 6000,
            }),
        });

      return;
    }

    // UPDATE
    const id = this.data.row!.id_curso;

    const body: CursoUpdate = {
      id_categoria: v.id_categoria,
      nombre_curso: v.nombre_curso,
      duracion_horas: v.duracion_horas,
      estado_curso: v.estado_curso,
      descripcion_curso: v.descripcion_curso ?? '',
    };

    this.cursoService.update(id, body).subscribe({
      next: () => this.dialogRef.close(true),

      error: (err: HttpErrorResponse) =>
        this.snack.open(this.msg(err), 'Cerrar', {
          duration: 6000,
        }),
    });
  }

  private msg(err: HttpErrorResponse): string {
    const d = err.error?.detail;

    if (typeof d === 'string') return d;

    if (Array.isArray(d)) {
      return d.map((x) => x.msg ?? JSON.stringify(x)).join('; ');
    }

    return err.message;
  }
}