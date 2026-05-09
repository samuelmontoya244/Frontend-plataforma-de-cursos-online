import { Routes } from '@angular/router';

import { auditUserGuard } from './core/audit-user.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login').then((m) => m.LoginComponent),
  },

  {
    path: 'app',
    canActivate: [auditUserGuard],
    loadComponent: () =>
      import('./features/shell/main-layout').then((m) => m.MainLayoutComponent),

    children: [
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' },

      // ✅ USUARIOS
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./features/usuarios/usuario-list').then(
            (m) => m.UsuarioListComponent
          ),
      },

      // ✅ CURSOS
      {
        path: 'cursos',
        loadComponent: () =>
          import('./features/curso/curso-list').then(
            (m) => m.CursoListComponent
          ),
      },

      // ✅ INSCRIPCIONES
      {
        path: 'inscripciones',
        loadComponent: () =>
          import('./features/inscripcion/inscripcion-list').then(
            (m) => m.InscripcionListComponent
          ),
      },

      // ✅ CATEGORIAS
      {
        path: 'categorias',
        loadComponent: () =>
          import('./features/categoria/categoria-list').then(
            (m) => m.CategoriaListComponent
          ),
      },

      // ✅ CALIFICACIONES
      {
        path: 'calificaciones',
        loadComponent: () =>
          import('./features/calificacion/calificacion-list').then(
            (m) => m.CalificacionListComponent
          ),
      },

      // ✅ CERTIFICADOS
      {
        path: 'certificados',
        loadComponent: () =>
          import('./features/certificado/certificado-list').then(
            (m) => m.CertificadoListComponent
          ),
      },

      // ✅ MATERIAL
      {
        path: 'material',
        loadComponent: () =>
          import('./features/material/material-list').then(
            (m) => m.MaterialListComponent
          ),
      },

      // ✅ PAGOS
      {
        path: 'pagos',
        loadComponent: () =>
          import('./features/pago/pago-list').then(
            (m) => m.PagoListComponent
          ),
      },

      // ✅ EVALUACION
      {
        path: 'evaluacion',
        loadComponent: () =>
          import('./features/evaluacion/evaluacion-list').then(
            (m) => m.EvaluacionListComponent
          ),
      },

      // ✅ LECCION
      {
        path: 'leccion',
        loadComponent: () =>
          import('./features/leccion/leccion-list').then(
            (m) => m.LeccionListComponent
          ),
      },
    ],
  },

  { path: '**', redirectTo: 'login' },
];