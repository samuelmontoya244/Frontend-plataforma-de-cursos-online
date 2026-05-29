import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common'; //agregue CommonModule

import { CursoService } from '../../core/services/curso.service';
import { CursoResponse } from '../../models/api.models';
import { CursoDialogComponent, CursoDialogData } from './curso-dialog';

@Component({
  selector: 'app-curso-list',

  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './curso-list.html',
  styleUrl: './curso-list.scss',
})
export class CursoListComponent implements AfterViewInit {
  private readonly cursoService = inject(CursoService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  readonly displayedColumns = [
    'nombre_curso',
    'id_categoria',
    'duracion_horas',
    'estado_curso',
    'descripcion_curso',
    'fecha_creacion',
    'acciones',
  ];

  readonly dataSource =
    new MatTableDataSource<CursoResponse>([]);

  loading = true;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  constructor() {
    this.reload();
  }

  reload(): void {
    this.loading = true;

    this.cursoService.list().subscribe({
      next: (rows) => {
        this.dataSource.data = rows;
        this.loading = false;
      },

      error: (err: HttpErrorResponse) => {
        this.loading = false;

        this.snack.open(
          this.msg(err),
          'Cerrar',
          { duration: 6000 }
        );
      },
    });
  }

  nuevo(): void {
    this.openDialog({
      mode: 'create',
    });
  }

  editar(row: CursoResponse): void {
    this.openDialog({
      mode: 'edit',
      row,
    });
  }

  private openDialog(
    data: CursoDialogData
  ): void {

    this.dialog
      .open(CursoDialogComponent, {
        width: '650px',
        data,
      })

      .afterClosed()

      .pipe(filter(Boolean))

      .subscribe(() => this.reload());
  }

  eliminar(row: CursoResponse): void {

    if (
      !confirm(
        `¿Eliminar curso ${row.nombre_curso}?`
      )
    ) {
      return;
    }

    this.cursoService
      .delete(row.id_curso)

      .subscribe({
        next: () => {

          this.snack.open(
            'Curso eliminado',
            'OK',
            { duration: 3000 }
          );

          this.reload();
        },

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