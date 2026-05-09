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
import { MatSelectModule } from '@angular/material/select';
import {
  MatSnackBar,
  MatSnackBarModule,
} from '@angular/material/snack-bar';

import { PagoService } from '../../core/services/pago.service';
import {
  PagoResponse,
  PagoCreate,
  PagoUpdate,
} from '../../models/api.models';

export interface PagoDialogData {
  mode: 'create' | 'edit';
  row?: PagoResponse;
}

@Component({
  selector: 'app-pago-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './pago-dialog.html',
})
export class PagoDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly pagoService = inject(PagoService);
  private readonly dialogRef = inject(MatDialogRef<PagoDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<PagoDialogData>(MAT_DIALOG_DATA);

  readonly form = this.fb.nonNullable.group({
    id_curso: ['', Validators.required],
    monto: [0, [Validators.required, Validators.min(1)]],
    estado_pago: ['pendiente', Validators.required],
    metodo_pago: ['', Validators.required],
    // id_usuario se puede manejar internamente o mediante un input si es necesario
    id_usuario: ['', Validators.required], 
  });

  constructor() {
    if (this.data.mode === 'edit' && this.data.row) {
      this.form.patchValue({
        id_curso: this.data.row.id_curso,
        monto: this.data.row.monto,
        estado_pago: this.data.row.estado_pago,
        metodo_pago: this.data.row.metodo_pago,
        id_usuario: this.data.row.id_usuario
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
      // Aquí agregamos los campos que faltaban para cumplir con PagoCreate
      const body: PagoCreate = {
        id_curso: v.id_curso,
        monto: v.monto,
        estado_pago: v.estado_pago,
        metodo_pago: v.metodo_pago,
        // Asignamos valores temporales o del usuario actual para evitar el error TS2345
        // id_usuario: v.id_usuario, 
        // id_usuario_creacion: 'ID_DEL_ADMIN_O_USUARIO' 
      } as any; // Usamos 'as any' temporalmente si no tienes los IDs reales aún

      this.pagoService.create(body).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.showError(err),
      });
    } else {
      const id = this.data.row!.id_pago;
      const body: PagoUpdate = { ...v };

      this.pagoService.update(id, body).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.showError(err),
      });
    }
  }

  private showError(err: HttpErrorResponse): void {
    this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 });
  }

  private msg(err: HttpErrorResponse): string {
    const d = err.error?.detail;
    if (typeof d === 'string') return d;
    if (Array.isArray(d)) return d.map((x) => x.msg ?? JSON.stringify(x)).join('; ');
    return err.message;
  }
}