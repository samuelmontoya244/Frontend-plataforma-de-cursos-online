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
import { LeccionService } from '../../core/services/leccion.service';
import { CursoService } from '../../core/services/curso.service';
import { LeccionResponse, LeccionUpdate, CursoResponse } from '../../models/api.models';

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
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './leccion-dialog.html',
})
export class LeccionDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly leccionService = inject(LeccionService);
  private readonly cursoService = inject(CursoService);
  private readonly audit = inject(AuditContextService);
  private readonly dialogRef = inject(MatDialogRef<LeccionDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);
  readonly data = inject<LeccionDialogData>(MAT_DIALOG_DATA);

  cursos: CursoResponse[] = [];
  loadingCursos = true;

  readonly form = this.fb.nonNullable.group({
    id_curso: ['', Validators.required],
    titulo_leccion: ['', Validators.required],
    descripcion_leccion: [''],
    orden: [1, [Validators.required, Validators.min(1)]],
    duracion_horas: [1, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.cursoService.list().subscribe({
      next: (data) => { this.cursos = data; this.loadingCursos = false; },
      error: () => { this.loadingCursos = false; this.snack.open('Error al cargar cursos', 'Cerrar', { duration: 4000 }); },
    });

    if (this.data.mode === 'edit' && this.data.row) {
      const r = this.data.row;
      this.form.patchValue({
        id_curso: r.id_curso,
        titulo_leccion: r.titulo_leccion,
        descripcion_leccion: r.descripcion_leccion ?? '',
        orden: r.orden,
        duracion_horas: r.duracion_horas,
      });
    }
  }

  cancel(): void { this.dialogRef.close(false); }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const uid = this.audit.usuarioId();
    if (!uid) { this.snack.open('Seleccione usuario de auditoría.', 'OK'); return; }
    const v = this.form.getRawValue();

    if (this.data.mode === 'create') {
      this.leccionService.create({
        id_curso: v.id_curso,
        titulo_leccion: v.titulo_leccion,
        descripcion_leccion: v.descripcion_leccion || null,
        orden: v.orden,
        duracion_horas: v.duracion_horas,
        id_usuario_creacion: uid,
      }).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
      return;
    }

    const body: LeccionUpdate = {
      id_curso: v.id_curso,
      titulo_leccion: v.titulo_leccion,
      descripcion_leccion: v.descripcion_leccion || null,
      orden: v.orden,
      duracion_horas: v.duracion_horas,
      id_usuario_edita: uid,
    };
    this.leccionService.update(this.data.row!.id_leccion, body).subscribe({
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