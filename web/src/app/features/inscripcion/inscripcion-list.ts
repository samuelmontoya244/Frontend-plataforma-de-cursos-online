import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, inject, ViewChild} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule} from '@angular/material/table';
import { filter } from 'rxjs/operators';

import { InscripcionService } from '../../core/services/inscripcion.service';
import { InscripcionResponse} from '../../models/api.models';
import { InscripcionDialogComponent, InscripcionDialogData} from './inscripcion-dialog';

@Component({
  selector: 'app-inscripcion-list',

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

  templateUrl: './inscripcion-list.html',

  styleUrl: './inscripcion-list.scss',
})
export class InscripcionListComponent
  implements AfterViewInit {
  private readonly inscripcionService = inject(InscripcionService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  readonly displayedColumns = [
    'id_curso',
    'id_usuario_inscrito',
    'estado_inscripcion',
    'fecha_creacion',
    'acciones',
  ];

  readonly dataSource =
    new MatTableDataSource<InscripcionResponse>([]);

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

    this.inscripcionService.list().subscribe({

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

  editar(row: InscripcionResponse): void {

    this.openDialog({
      mode: 'edit',
      row,
    });
  }

  private openDialog(
    data: InscripcionDialogData
  ): void {

    this.dialog
      .open(InscripcionDialogComponent, {
        width: '650px',
        data,
      })

      .afterClosed()

      .pipe(filter(Boolean))

      .subscribe(() => this.reload());
  }

  eliminar(row: InscripcionResponse): void {

    if (
      !confirm(
        `¿Eliminar inscripción ${row.id_inscripcion}?`
      )
    ) {
      return;
    }

    this.inscripcionService
      .delete(row.id_inscripcion)

      .subscribe({

        next: () => {

          this.snack.open(
            'Inscripción eliminada',
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