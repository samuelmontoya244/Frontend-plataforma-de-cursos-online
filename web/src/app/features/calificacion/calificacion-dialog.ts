import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuditContextService } from '../../core/audit-context.service';
import { CalificacionService } from '../../core/services/calificacion.service';
import { InscripcionService } from '../../core/services/inscripcion.service';
import { EvaluacionService } from '../../core/services/evaluacion.service';
import { CalificacionResponse, InscripcionResponse, EvaluacionResponse } from '../../models/api.models';

export interface CalificacionDialogData {
  mode: 'create' | 'edit';
  row?: CalificacionResponse;
}

@Component({
  selector: 'app-calificacion-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './calificacion-dialog.html',
})
export class CalificacionDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(CalificacionService);
  private readonly inscripcionService = inject(InscripcionService);
  private readonly evaluacionService = inject(EvaluacionService);
  private readonly audit = inject(AuditContextService);
  private readonly dialogRef = inject(MatDialogRef<CalificacionDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);
  readonly data = inject<CalificacionDialogData>(MAT_DIALOG_DATA);

  inscripciones: InscripcionResponse[] = [];
  evaluaciones: EvaluacionResponse[] = [];
  loadingInscripciones = true;
  loadingEvaluaciones = true;

  readonly form = this.fb.nonNullable.group({
    id_inscripcion: ['', Validators.required],
    id_evaluacion: ['', Validators.required],
    Nota: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
  });

  ngOnInit(): void {
    this.inscripcionService.list().subscribe({
      next: (data) => { this.inscripciones = data; this.loadingInscripciones = false; },
      error: () => { this.loadingInscripciones = false; this.snack.open('Error al cargar inscripciones', 'Cerrar', { duration: 4000 }); },
    });
    this.evaluacionService.list().subscribe({
      next: (data) => { this.evaluaciones = data; this.loadingEvaluaciones = false; },
      error: () => { this.loadingEvaluaciones = false; this.snack.open('Error al cargar evaluaciones', 'Cerrar', { duration: 4000 }); },
    });

    if (this.data.mode === 'edit' && this.data.row) {
      const r = this.data.row;
      this.form.patchValue({
        id_inscripcion: r.id_inscripcion,
        id_evaluacion: r.id_evaluacion,
        Nota: r.Nota,
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
      this.svc.create({
        id_usuario_creacion: uid,
        id_inscripcion: v.id_inscripcion,
        id_evaluacion: v.id_evaluacion,
        Nota: v.Nota,
      }).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
      return;
    }

    this.svc.update(this.data.row!.id_inscripcion, {
      id_usuario_edita: uid,
      id_inscripcion: v.id_inscripcion,
      id_evaluacion: v.id_evaluacion,
      Nota: v.Nota,
    }).subscribe({
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