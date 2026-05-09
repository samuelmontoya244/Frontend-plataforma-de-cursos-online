import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuditContextService } from '../../core/audit-context.service';
import { CertificadoService } from '../../core/services/certificado.service';
import { CertificadoResponse } from '../../models/api.models';

export interface CertificadoDialogData {
  mode: 'create' | 'edit';
  row?: CertificadoResponse;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

@Component({
  selector: 'app-certificado-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  templateUrl: './certificado-dialog.html',
})
export class CertificadoDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(CertificadoService);
  private readonly audit = inject(AuditContextService);
  private readonly dialogRef = inject(MatDialogRef<CertificadoDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);
  readonly data = inject<CertificadoDialogData>(MAT_DIALOG_DATA);

  readonly form = this.fb.nonNullable.group({
    id_inscripcion: ['', [Validators.required, Validators.pattern(UUID_PATTERN)]],
  });

  constructor() {
    if (this.data.mode === 'edit' && this.data.row) {
      this.form.patchValue({ id_inscripcion: this.data.row.id_inscripcion });
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
    const uid = this.audit.usuarioId();
    if (!uid) {
      this.snack.open('Seleccione usuario de auditoría en la barra superior.', 'OK');
      return;
    }
    const v = this.form.getRawValue();

    if (this.data.mode === 'create') {
      this.svc
        .create({ id_inscripcion: v.id_inscripcion, id_usuario_creacion: uid })
        .subscribe({
          next: () => this.dialogRef.close(true),
          error: (err: HttpErrorResponse) =>
            this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
        });
      return;
    }

    this.svc
      .update(this.data.row!.id_certificado, {
        id_inscripcion: v.id_inscripcion,
        id_usuario_edita: uid,
      })
      .subscribe({
        next: () => this.dialogRef.close(true),
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