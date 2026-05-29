import { HttpErrorResponse }
  from '@angular/common/http';

import {
  AfterViewInit,
  Component,
  inject,
  ViewChild,
} from '@angular/core';

import {
  CommonModule,
} from '@angular/common';

import {
  MatButtonModule,
} from '@angular/material/button';

import {
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';

import {
  MatIconModule,
} from '@angular/material/icon';

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

import {
  filter,
} from 'rxjs/operators';

import {
  MaterialService,
} from '../../core/services/material.service';

import {
  MaterialResponse,
} from '../../models/api.models';

import {
  MaterialDialogComponent,
  MaterialDialogData,
} from './material-dialog';

@Component({
  selector: 'app-material-list',

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

  templateUrl:
    './material-list.html',

  styleUrl:
    './material-list.scss',
})

export class MaterialListComponent
  implements AfterViewInit {

  private readonly materialService =
    inject(MaterialService);

  private readonly dialog =
    inject(MatDialog);

  private readonly snack =
    inject(MatSnackBar);

  readonly displayedColumns = [
    'titulo_material',
    'id_leccion',
    'tipo_material',
    'URL_archivo',
    'fecha_creacion',
    'acciones',
  ];

  readonly dataSource =
    new MatTableDataSource<
      MaterialResponse
    >([]);

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

    this.materialService
      .list()
      .subscribe({

        next: (rows) => {

          this.dataSource.data =
            rows;

          this.loading = false;
        },

        error: (
          err: HttpErrorResponse
        ) => {

          this.loading = false;

          this.snack.open(
            this.msg(err),
            'Cerrar',
            {
              duration: 6000,
            }
          );
        },
      });
  }

  nuevo(): void {

    this.openDialog({
      mode: 'create',
    });
  }

  editar(
    row: MaterialResponse
  ): void {

    this.openDialog({
      mode: 'edit',
      row,
    });
  }

  private openDialog(
    data: MaterialDialogData
  ): void {

    this.dialog
      .open(
        MaterialDialogComponent,
        {
          width: '600px',
          data,
        }
      )
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() =>
        this.reload()
      );
  }

  eliminar(
    row: MaterialResponse
  ): void {

    if (
      !confirm(
        `¿Eliminar material ${row.titulo_material}?`
      )
    ) {
      return;
    }

    this.materialService
      .delete(
        row.id_material
      )
      .subscribe({

        next: () => {

          this.snack.open(
            'Material eliminado',
            'OK',
            {
              duration: 3000,
            }
          );

          this.reload();
        },

        error: (
          err: HttpErrorResponse
        ) =>
          this.snack.open(
            this.msg(err),
            'Cerrar',
            {
              duration: 6000,
            }
          ),
      });
  }

  private msg(
    err: HttpErrorResponse
  ): string {

    const d =
      err.error?.detail;

    if (
      typeof d === 'string'
    ) {
      return d;
    }

    if (Array.isArray(d)) {

      return d
        .map(
          (x) =>
            x.msg ??
            JSON.stringify(x)
        )
        .join('; ');
    }

    return err.message;
  }
}