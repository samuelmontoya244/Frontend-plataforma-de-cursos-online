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

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';

import {
  MatSnackBar,
  MatSnackBarModule,
} from '@angular/material/snack-bar';

import { EvaluacionService } from '../../core/services/evaluacion.service';

import {
  EvaluacionResponse,
  EvaluacionUpdate,
} from '../../models/api.models';

export interface EvaluacionDialogData {
  mode: 'create' | 'edit';
  row?: EvaluacionResponse;
}

@Component({
  selector: 'app-evaluacion-dialog',

  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],

  templateUrl: './evaluacion-dialog.html',
})
export class EvaluacionDialogComponent {

  private readonly fb = inject(FormBuilder);

  private readonly evaluacionService =
    inject(EvaluacionService);

  private readonly dialogRef =
    inject(MatDialogRef<EvaluacionDialogComponent, boolean>);

  private readonly snack = inject(MatSnackBar);

  readonly data =
    inject<EvaluacionDialogData>(MAT_DIALOG_DATA);

  readonly form = this.fb.nonNullable.group({

    id_leccion: ['', Validators.required],

    nombre_evaluacion: ['', Validators.required],

    porcentaje: [
      0,
      [
        Validators.required,
        Validators.min(1),
        Validators.max(100),
      ],
    ],
  });

  constructor() {

    if (this.data.mode === 'edit' && this.data.row) {

      const r = this.data.row;

      this.form.patchValue({
        id_leccion: r.id_leccion,
        nombre_evaluacion: r.nombre_evaluacion,
        porcentaje: r.porcentaje,
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

      this.evaluacionService
        .create({
          id_leccion: v.id_leccion,
          nombre_evaluacion: v.nombre_evaluacion,
          porcentaje: v.porcentaje,
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

    // UPDATE
    const id = this.data.row!.id_evaluacion;

    const body: EvaluacionUpdate = {

      id_leccion: v.id_leccion,

      nombre_evaluacion:
        v.nombre_evaluacion,

      porcentaje: v.porcentaje,
    };

    this.evaluacionService
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

  private msg(err: HttpErrorResponse): string {

    const d = err.error?.detail;

    if (typeof d === 'string') {
      return d;
    }

    if (Array.isArray(d)) {

      return d
        .map((x) => x.msg ?? JSON.stringify(x))
        .join('; ');
    }

    return err.message;
  }
}