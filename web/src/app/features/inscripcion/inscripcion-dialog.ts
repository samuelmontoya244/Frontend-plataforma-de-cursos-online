import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';

import { InscripcionService } from '../../core/services/inscripcion.service';
import { InscripcionResponse, InscripcionUpdate} from '../../models/api.models';

export interface InscripcionDialogData {
  mode: 'create' | 'edit';
  row?: InscripcionResponse;
}

@Component({
  selector: 'app-inscripcion-dialog',

  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
  ],

  templateUrl: './inscripcion-dialog.html',
})
export class InscripcionDialogComponent {

  private readonly fb = inject(FormBuilder);
  private readonly inscripcionService = inject(InscripcionService);
  private readonly dialogRef = inject(MatDialogRef<InscripcionDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<InscripcionDialogData>(MAT_DIALOG_DATA);

  readonly form = this.fb.nonNullable.group({
    id_curso: ['', Validators.required],
    id_usuario_inscrito: ['', Validators.required],
    estado_inscripcion: ['', Validators.required],
  });

  constructor() {
    if (this.data.mode === 'edit' && this.data.row) {
      const r = this.data.row;
      this.form.patchValue({
        id_curso: r.id_curso,
        id_usuario_inscrito: r.id_usuario_inscrito,
        estado_inscripcion: r.estado_inscripcion,
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
      this.inscripcionService
        .create({
          id_curso: v.id_curso,
          id_usuario_inscrito: v.id_usuario_inscrito,
          estado_inscripcion: v.estado_inscripcion,
        })

        .subscribe({
          next: () =>
            this.dialogRef.close(true),
          error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
        });
      return;
    }

    // UPDATE
    const id = this.data.row!.id_inscripcion;
    const body: InscripcionUpdate = {
      id_curso: v.id_curso,
      id_usuario_inscrito: v.id_usuario_inscrito,
      estado_inscripcion: v.estado_inscripcion,
    };

    this.inscripcionService
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