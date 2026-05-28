import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CursoService } from '../../core/services/curso.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { CursoResponse, CursoUpdate, CategoriaRead } from '../../models/api.models';

export interface CursoDialogData {
  mode: 'create' | 'edit';
  row?: CursoResponse;
}

@Component({
  selector: 'app-curso-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './curso-dialog.html',
})
export class CursoDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly cursoService = inject(CursoService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly dialogRef = inject(MatDialogRef<CursoDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);
  readonly data = inject<CursoDialogData>(MAT_DIALOG_DATA);

  categorias: CategoriaRead[] = [];
  loadingCategorias = true;

  readonly form = this.fb.nonNullable.group({
    id_categoria: ['', Validators.required],
    nombre_curso: ['', Validators.required],
    duracion_horas: [0, [Validators.required, Validators.min(1)]],
    estado_curso: ['', Validators.required],
    descripcion_curso: [''],
  });

  ngOnInit(): void {
    this.categoriaService.list().subscribe({
      next: (data) => {
        this.categorias = data;
        this.loadingCategorias = false;
      },
      error: () => {
        this.loadingCategorias = false;
        this.snack.open('Error al cargar categorías', 'Cerrar', { duration: 4000 });
      },
    });

    if (this.data.mode === 'edit' && this.data.row) {
      const r = this.data.row;
      this.form.patchValue({
        id_categoria: r.id_categoria,
        nombre_curso: r.nombre_curso,
        duracion_horas: r.duracion_horas,
        estado_curso: r.estado_curso,
        descripcion_curso: r.descripcion_curso ?? '',
      });
    }
  }

  cancel(): void { this.dialogRef.close(false); }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();

    if (this.data.mode === 'create') {
      this.cursoService.create({
        id_categoria: v.id_categoria,
        nombre_curso: v.nombre_curso,
        duracion_horas: v.duracion_horas,
        estado_curso: v.estado_curso,
        descripcion_curso: v.descripcion_curso,
      }).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
      return;
    }

    const body: CursoUpdate = {
      id_categoria: v.id_categoria,
      nombre_curso: v.nombre_curso,
      duracion_horas: v.duracion_horas,
      estado_curso: v.estado_curso,
      descripcion_curso: v.descripcion_curso ?? '',
    };
    this.cursoService.update(this.data.row!.id_curso, body).subscribe({
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