import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { PagoService } from '../../core/services/pago.service';
import { CursoService } from '../../core/services/curso.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { AuditContextService } from '../../core/audit-context.service';
import { PagoResponse, PagoCreate, PagoUpdate, CursoResponse, UsuarioResponse } from '../../models/api.models';

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
export class PagoDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly pagoService = inject(PagoService);
  private readonly cursoService = inject(CursoService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly audit = inject(AuditContextService);
  private readonly dialogRef = inject(MatDialogRef<PagoDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);
  readonly data = inject<PagoDialogData>(MAT_DIALOG_DATA);

  cursos: CursoResponse[] = [];
  usuarios: UsuarioResponse[] = [];
  loadingCursos = true;
  loadingUsuarios = true;

  readonly form = this.fb.nonNullable.group({
    id_curso: ['', Validators.required],
    id_usuario: ['', Validators.required],
    monto: [0, [Validators.required, Validators.min(1)]],
    estado_pago: ['pendiente', Validators.required],
    metodo_pago: ['', Validators.required],
  });

  ngOnInit(): void {
    this.cursoService.list().subscribe({
      next: (data) => { this.cursos = data; this.loadingCursos = false; },
      error: () => { this.loadingCursos = false; this.snack.open('Error al cargar cursos', 'Cerrar', { duration: 4000 }); },
    });
    this.usuarioService.list().subscribe({
      next: (data) => { this.usuarios = data; this.loadingUsuarios = false; },
      error: () => { this.loadingUsuarios = false; this.snack.open('Error al cargar usuarios', 'Cerrar', { duration: 4000 }); },
    });

    if (this.data.mode === 'edit' && this.data.row) {
      const r = this.data.row;
      this.form.patchValue({
        id_curso: r.id_curso,
        id_usuario: r.id_usuario,
        monto: r.monto,
        estado_pago: r.estado_pago,
        metodo_pago: r.metodo_pago,
      });
    }
  }

  cancel(): void { this.dialogRef.close(false); }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const uid = this.audit.usuarioId();
    if (!uid) { this.snack.open('Seleccione usuario de auditoría en la barra superior.', 'OK'); return; }
    const v = this.form.getRawValue();

    if (this.data.mode === 'create') {
      const body: PagoCreate = {
        id_curso: v.id_curso,
        id_usuario: v.id_usuario,
        monto: v.monto,
        estado_pago: v.estado_pago,
        metodo_pago: v.metodo_pago,
      };
      this.pagoService.create(body).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
      return;
    }

    const body: PagoUpdate = {
      id_curso: v.id_curso,
      id_usuario: v.id_usuario,
      monto: v.monto,
      estado_pago: v.estado_pago,
      metodo_pago: v.metodo_pago,
    };
    this.pagoService.update(this.data.row!.id_pago, body).subscribe({
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