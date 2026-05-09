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

// Cambia estas rutas según tu estructura real de carpetas
import { PagoService } from '../../core/services/pago.service';
import { PagoResponse } from '../../models/api.models';
import {
  PagoDialogComponent,
  PagoDialogData,
} from './pago-dialog';

@Component({
  selector: 'app-pago-list',
  standalone: true,
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
  templateUrl: './pago-list.html',
  styleUrl: './pago-list.scss',
})
export class PagoListComponent implements AfterViewInit {
  private readonly pagoService = inject(PagoService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  readonly displayedColumns = [
    'id_pago',
    'id_usuario',
    'id_curso',
    'monto',
    'estado_pago',
    'metodo_pago',
    'fecha_creacion',
    'acciones',
  ];

  readonly dataSource = new MatTableDataSource<PagoResponse>([]);
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

    this.pagoService
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

  editar(row: PagoResponse): void {
    this.openDialog({
      mode: 'edit',
      row,
    });
  }

  private openDialog(data: PagoDialogData): void {
    this.dialog
      .open(PagoDialogComponent, {
        width: '600px',
        data,
      })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.reload());
  }

  eliminar(row: PagoResponse): void {
    if (
      !confirm(
        `¿Está seguro de eliminar el pago con ID: ${row.id_pago}?`
      )
    ) {
      return;
    }

    this.pagoService
      .delete(row.id_pago)
      .subscribe({
        next: () => {
          this.snack.open(
            'Pago eliminado correctamente',
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