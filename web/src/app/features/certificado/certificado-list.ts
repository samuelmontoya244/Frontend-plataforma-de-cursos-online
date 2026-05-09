import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { filter } from 'rxjs/operators';
import { CertificadoService } from '../../core/services/certificado.service';
import { CertificadoResponse } from '../../models/api.models';
import { CertificadoDialogComponent, CertificadoDialogData } from './certificado-dialog';

@Component({
  selector: 'app-certificado-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './certificado-list.html',
  styleUrl: './certificado-list.scss',
})
export class CertificadoListComponent implements AfterViewInit {
  private readonly svc = inject(CertificadoService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  readonly displayedColumns = [
    'id_certificado',
    'id_inscripcion',
    'fecha_creacion',
    'fecha_edicion',
    'acciones',
  ];
  readonly dataSource = new MatTableDataSource<CertificadoResponse>([]);
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  constructor() {
    this.reload();
  }

  reload(): void {
    this.loading = true;
    this.svc.list().subscribe({
      next: (rows) => {
        this.dataSource.data = rows;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 });
      },
    });
  }

  nuevo(): void {
    this.open({ mode: 'create' });
  }

  editar(row: CertificadoResponse): void {
    this.open({ mode: 'edit', row });
  }

  private open(data: CertificadoDialogData): void {
    this.dialog
      .open(CertificadoDialogComponent, { width: '480px', data })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.reload());
  }

  eliminar(row: CertificadoResponse): void {
    if (!confirm(`¿Eliminar certificado ${row.id_certificado}?`)) return;
    this.svc.delete(row.id_certificado).subscribe({
      next: () => {
        this.snack.open('Certificado eliminado', 'OK', { duration: 3000 });
        this.reload();
      },
      error: (err: HttpErrorResponse) =>
        this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
    });
  }

  private msg(err: HttpErrorResponse): string {
    const d = err.error?.detail;
    if (typeof d === 'string') return d;
    if (Array.isArray(d)) return d.map((x) => x.msg ?? JSON.stringify(x)).join('; ');
    return err.message;
  }
}