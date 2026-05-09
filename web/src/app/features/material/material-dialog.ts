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

import { MatButtonModule }
  from '@angular/material/button';

import { MatFormFieldModule }
  from '@angular/material/form-field';

import { MatInputModule }
  from '@angular/material/input';

import {
  MatSnackBar,
  MatSnackBarModule,
} from '@angular/material/snack-bar';

import { MaterialService }
  from '../../core/services/material.service';

import {
  MaterialResponse,
  MaterialUpdate,
} from '../../models/api.models';

export interface MaterialDialogData {
  mode: 'create' | 'edit';
  row?: MaterialResponse;
}

@Component({
  selector: 'app-material-dialog',

  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],

  templateUrl: './material-dialog.html',
})

export class MaterialDialogComponent {

  private readonly fb =
    inject(FormBuilder);

  private readonly materialService =
    inject(MaterialService);

  private readonly dialogRef =
    inject(
      MatDialogRef<
        MaterialDialogComponent,
        boolean
      >
    );

  private readonly snack =
    inject(MatSnackBar);

  readonly data =
    inject<MaterialDialogData>(
      MAT_DIALOG_DATA
    );

  readonly form =
    this.fb.nonNullable.group({

      id_leccion: [
        '',
        Validators.required,
      ],

      titulo_material: [
        '',
        Validators.required,
      ],

      tipo_material: [''],

      URL_archivo: [
        '',
        Validators.required,
      ],
    });

  constructor() {

    if (
      this.data.mode === 'edit'
      && this.data.row
    ) {

      const r = this.data.row;

      this.form.patchValue({

        id_leccion:
          r.id_leccion,

        titulo_material:
          r.titulo_material,

        tipo_material:
          r.tipo_material ?? '',

        URL_archivo:
          r.URL_archivo,
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

    const v =
      this.form.getRawValue();

    if (
      this.data.mode === 'create'
    ) {

      this.materialService
        .create({

          id_leccion:
            v.id_leccion,

          titulo_material:
            v.titulo_material,

          tipo_material:
            v.tipo_material || null,

          URL_archivo:
            v.URL_archivo,
        })

        .subscribe({

          next: () =>
            this.dialogRef.close(true),

          error: (
            err: HttpErrorResponse
          ) =>
            this.snack.open(
              this.msg(err),
              'Cerrar',
              {
                duration: 6000,
              }
            ),
        });

      return;
    }

    const id =
      this.data.row!.id_material;

    const body: MaterialUpdate = {

      id_leccion:
        v.id_leccion,

      titulo_material:
        v.titulo_material,

      tipo_material:
        v.tipo_material || null,

      URL_archivo:
        v.URL_archivo as any,
    };

    this.materialService
      .update(id, body)
      .subscribe({

        next: () =>
          this.dialogRef.close(true),

        error: (
          err: HttpErrorResponse
        ) =>
          this.snack.open(
            this.msg(err),
            'Cerrar',
            {
              duration: 6000,
            }
          ),
      });
  }

  private msg(
    err: HttpErrorResponse
  ): string {

    const d = err.error?.detail;

    if (
      typeof d === 'string'
    ) {
      return d;
    }

    if (Array.isArray(d)) {

      return d
        .map(
          (x) =>
            x.msg ??
            JSON.stringify(x)
        )
        .join('; ');
    }

    return err.message;
  }
}