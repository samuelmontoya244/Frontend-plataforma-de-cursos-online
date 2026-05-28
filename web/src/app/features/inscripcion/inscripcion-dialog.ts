import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { InscripcionService } from '../../core/services/inscripcion.service';
import { CursoService } from '../../core/services/curso.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { InscripcionResponse, InscripcionUpdate, CursoResponse, UsuarioResponse } from '../../models/api.models';

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
export class InscripcionDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly inscripcionService = inject(InscripcionService);
  private readonly cursoService = inject(CursoService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly dialogRef = inject(MatDialogRef<InscripcionDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);
  readonly data = inject<InscripcionDialogData>(MAT_DIALOG_DATA);

  cursos: CursoResponse[] = [];
  usuarios: UsuarioResponse[] = [];
  loadingCursos = true;
  loadingUsuarios = true;

  readonly form = this.fb.nonNullable.group({
    id_curso: ['', Validators.required],
    id_usuario_inscrito: ['', Validators.required],
    estado_inscripcion: ['', Validators.required],
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
        id_usuario_inscrito: r.id_usuario_inscrito,
        estado_inscripcion: r.estado_inscripcion,
      });
    }
  }

  cancel(): void { this.dialogRef.close(false); }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();

    if (this.data.mode === 'create') {
      this.inscripcionService.create({
        id_curso: v.id_curso,
        id_usuario_inscrito: v.id_usuario_inscrito,
        estado_inscripcion: v.estado_inscripcion,
      }).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
      return;
    }

    const body: InscripcionUpdate = {
      id_curso: v.id_curso,
      id_usuario_inscrito: v.id_usuario_inscrito,
      estado_inscripcion: v.estado_inscripcion,
    };
    this.inscripcionService.update(this.data.row!.id_inscripcion, body).subscribe({
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