import { HttpErrorResponse } from '@angular/common/http';

import {
  AfterViewInit,
  Component,
  inject,
  ViewChild,
} from '@angular/core';

import { CommonModule }
  from '@angular/common';

import { MatButtonModule }
  from '@angular/material/button';

import {
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';

import { MatIconModule }
  from '@angular/material/icon';

import {
  MatPaginator,
  MatPaginatorModule,
} from '@angular/material/paginator';

import {
  MatProgressSpinnerModule,
} from '@angular/material/progress-spinner';

import {
  MatSnackBar,
  MatSnackBarModule,
} from '@angular/material/snack-bar';

import {
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';

import { filter } from 'rxjs/operators';

import { LeccionService }
  from '../../core/services/leccion.service';

import {
  LeccionResponse,
} from '../../models/api.models';

import {
  LeccionDialogComponent,
  LeccionDialogData,
} from './leccion-dialog';

@Component({
  selector: 'app-leccion-list',

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

  templateUrl: './leccion-list.html',

  styleUrl: './leccion-list.scss',
})

export class LeccionListComponent
  implements AfterViewInit {

  private readonly leccionService =
    inject(LeccionService);

  private readonly dialog =
    inject(MatDialog);

  private readonly snack =
    inject(MatSnackBar);

  readonly displayedColumns = [
    'titulo_leccion',
    'id_curso',
    'orden',
    'duracion_horas',
    'fecha_creacion',
    'acciones',
  ];

  readonly dataSource =
    new MatTableDataSource<LeccionResponse>([]);

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

    this.leccionService
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

  editar(row: LeccionResponse): void {

    this.openDialog({
      mode: 'edit',
      row,
    });
  }

  private openDialog(
    data: LeccionDialogData
  ): void {

    this.dialog
      .open(
        LeccionDialogComponent,
        {
          width: '600px',
          data,
        }
      )
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.reload());
  }

  eliminar(row: LeccionResponse): void {

    if (
      !confirm(
        `¿Eliminar lección ${row.titulo_leccion}?`
      )
    ) {
      return;
    }

    this.leccionService
      .delete(row.id_leccion)
      .subscribe({

        next: () => {

          this.snack.open(
            'Lección eliminada',
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
        .map(
          (x) =>
            x.msg ?? JSON.stringify(x)
        )
        .join('; ');
    }

    return err.message;
  }
}