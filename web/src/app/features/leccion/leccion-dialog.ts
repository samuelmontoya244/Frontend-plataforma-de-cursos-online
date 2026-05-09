import { HttpErrorResponse } from '@angular/common/http';

import { Component, inject } from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule }
  from '@angular/material/form-field';

import { MatInputModule }
  from '@angular/material/input';

import {
  MatSnackBar,
  MatSnackBarModule,
} from '@angular/material/snack-bar';

import { LeccionService }
  from '../../core/services/leccion.service';

import {
  LeccionResponse,
  LeccionUpdate,
} from '../../models/api.models';

export interface LeccionDialogData {
  mode: 'create' | 'edit';
  row?: LeccionResponse;
}

@Component({
  selector: 'app-leccion-dialog',

  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],

  templateUrl: './leccion-dialog.html',
})

export class LeccionDialogComponent {

  private readonly fb = inject(FormBuilder);

  private readonly leccionService =
    inject(LeccionService);

  private readonly dialogRef =
    inject(MatDialogRef<LeccionDialogComponent, boolean>);

  private readonly snack =
    inject(MatSnackBar);

  readonly data =
    inject<LeccionDialogData>(MAT_DIALOG_DATA);

  readonly form = this.fb.nonNullable.group({

    id_curso: [
      '',
      Validators.required,
    ],

    titulo_leccion: [
      '',
      Validators.required,
    ],

    descripcion_leccion: [''],

    orden: [
      1,
      [
        Validators.required,
        Validators.min(1),
      ],
    ],

    duracion_horas: [
      1,
      [
        Validators.required,
        Validators.min(1),
      ],
    ],
  });

  constructor() {

    if (
      this.data.mode === 'edit'
      && this.data.row
    ) {

      const r = this.data.row;

      this.form.patchValue({
        id_curso: r.id_curso,
        titulo_leccion: r.titulo_leccion,
        descripcion_leccion:
          r.descripcion_leccion ?? '',
        orden: r.orden,
        duracion_horas: r.duracion_horas,
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

    if (this.data.mode === 'create') {

      this.leccionService
        .create({

          id_curso: v.id_curso,

          titulo_leccion:
            v.titulo_leccion,

          descripcion_leccion:
            v.descripcion_leccion || null,

          orden: v.orden,

          duracion_horas:
            v.duracion_horas,
        })

        .subscribe({

          next: () =>
            this.dialogRef.close(true),

          error: (err: HttpErrorResponse) =>
            this.snack.open(
              this.msg(err),
              'Cerrar',
              { duration: 6000 }
            ),
        });

      return;
    }

    const id = this.data.row!.id_leccion;

    const body: LeccionUpdate = {

      id_curso: v.id_curso,

      titulo_leccion:
        v.titulo_leccion,

      descripcion_leccion:
        v.descripcion_leccion || null,

      orden: v.orden,

      duracion_horas:
        v.duracion_horas,
    };

    this.leccionService
      .update(id, body)
      .subscribe({

        next: () =>
          this.dialogRef.close(true),

        error: (err: HttpErrorResponse) =>
          this.snack.open(
            this.msg(err),
            'Cerrar',
            { duration: 6000 }
          ),
      });
  }

  private msg(
    err: HttpErrorResponse
  ): string {

    const d = err.error?.detail;

    if (typeof d === 'string') {
      return d;
    }

    if (Array.isArray(d)) {

      return d
        .map(
          (x) =>
            x.msg ?? JSON.stringify(x)
        )
        .join('; ');
    }

    return err.message;
  }
}