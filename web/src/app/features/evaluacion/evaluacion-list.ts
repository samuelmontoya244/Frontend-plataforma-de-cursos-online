import { HttpErrorResponse } from '@angular/common/http';

import {
  AfterViewInit,
  Component,
  inject,
  ViewChild,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';

import {
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';

import { MatIconModule } from '@angular/material/icon';

import {
  MatPaginator,
  MatPaginatorModule,
} from '@angular/material/paginator';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import {
  MatSnackBar,
  MatSnackBarModule,
} from '@angular/material/snack-bar';

import {
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';

import { filter } from 'rxjs/operators';

import { EvaluacionService } from '../../core/services/evaluacion.service';

import { EvaluacionResponse } from '../../models/api.models';

import {
  EvaluacionDialogComponent,
  EvaluacionDialogData,
} from './evaluacion-dialog';

@Component({
  selector: 'app-evaluacion-list',

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

  templateUrl: './evaluacion-list.html',

  styleUrl: './evaluacion-list.scss',
})
export class EvaluacionListComponent
  implements AfterViewInit {

  private readonly evaluacionService =
    inject(EvaluacionService);

  private readonly dialog =
    inject(MatDialog);

  private readonly snack =
    inject(MatSnackBar);

  readonly displayedColumns = [
    'nombre_evaluacion',
    'id_leccion',
    'porcentaje',
    'fecha_creacion',
    'acciones',
  ];

  readonly dataSource =
    new MatTableDataSource<EvaluacionResponse>([]);

  loading = true;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator =
      this.paginator;
  }

  constructor() {
    this.reload();
  }

  reload(): void {

    this.loading = true;

    this.evaluacionService
      .list()

      .subscribe({

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

  editar(row: EvaluacionResponse): void {

    this.openDialog({
      mode: 'edit',
      row,
    });
  }

  private openDialog(
    data: EvaluacionDialogData
  ): void {

    this.dialog
      .open(EvaluacionDialogComponent, {
        width: '650px',
        data,
      })

      .afterClosed()

      .pipe(filter(Boolean))

      .subscribe(() => this.reload());
  }

  eliminar(
    row: EvaluacionResponse
  ): void {

    if (
      !confirm(
        `¿Eliminar evaluación ${row.nombre_evaluacion}?`
      )
    ) {
      return;
    }

    this.evaluacionService
      .delete(row.id_evaluacion)

      .subscribe({

        next: () => {

          this.snack.open(
            'Evaluación eliminada',
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

  private msg(
    err: HttpErrorResponse
  ): string {

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