import { Routes } from '@angular/router';

import { auditUserGuard } from './core/audit-user.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'app',
    canActivate: [auditUserGuard],
    loadComponent: () => import('./features/shell/main-layout').then((m) => m.MainLayoutComponent),
    children: [
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./features/usuarios/usuario-list').then((m) => m.UsuarioListComponent),
      },
      {
        path: 'categorias',
        loadComponent: () =>
          import('./features/categoria/categoria-list').then((m) => m.CategoriaListComponent),
      },
      {
        path: 'calificaciones',
        loadComponent: () =>
          import('./features/calificacion/calificacion-list').then((m) => m.CalificacionListComponent),
      },
      {
        path: 'certificados',
        loadComponent: () =>
          import('./features/certificado/certificado-list').then((m) => m.CertificadoListComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];