# Frontend — Plataforma de Cursos Online

Aplicación web desarrollada en **Angular 20** para la gestión de una plataforma de cursos online. Permite administrar usuarios, categorías, calificaciones y certificados a través de una interfaz moderna conectada a un backend REST.

---

## 🔗 Enlaces importantes

| Recurso | URL |
|---|---|
| 🌐 Aplicación web (producción) | [plataforma-de-cursos-onl-507ce.web.app](https://plataforma-de-cursos-onl-507ce.web.app) |
| ⚙️ Backend (Render) | [backend-plataforma-de-cursos-online-1.onrender.com](https://backend-plataforma-de-cursos-online-1.onrender.com) |
| 🎥 Video explicativo | [Llamada con DUVAN — Grabación de la reunión (28/05/2026)](https://correoitmedu-my.sharepoint.com/:v:/g/personal/nicolascano1136534_correo_itm_edu_co/IQBvTnqK5SMQRauReAdPCVojAZ_K4e1eGpw32TQ1_YMj0Xk?e=xTnKsx&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D) |

---

## 🛠️ Tecnologías utilizadas

- **Angular 20** — Framework principal
- **Angular Material** — Componentes de UI
- **Angular CDK** — Kit de desarrollo de componentes
- **RxJS** — Programación reactiva
- **TypeScript 5.9**
- **Firebase Hosting** — Despliegue del frontend
- **Karma + Jasmine** — Pruebas unitarias

---

## 📁 Estructura del proyecto

```
Frontend-plataforma-de-cursos-online/
├── package.json                  # Scripts raíz (start, build, test)
└── web/
    ├── angular.json              # Configuración de Angular CLI
    ├── firebase.json             # Configuración de Firebase Hosting
    ├── package.json              # Dependencias del proyecto
    └── src/
        └── app/
            ├── app.routes.ts     # Rutas de la aplicación
            ├── app.config.ts     # Configuración global de Angular
            ├── core/
            │   ├── audit-user.guard.ts          # Guard de autenticación
            │   ├── audit-context.service.ts     # Contexto de sesión
            │   └── services/
            │       ├── calificacion.service.ts
            │       ├── categoria.service.ts
            │       ├── certificado.service.ts
            │       └── usuario.service.ts
            ├── features/
            │   ├── login/           # Pantalla de inicio de sesión
            │   ├── shell/           # Layout principal con navegación
            │   ├── usuarios/        # CRUD de usuarios
            │   ├── categoria/       # CRUD de categorías
            │   ├── calificacion/    # CRUD de calificaciones
            │   └── certificado/     # CRUD de certificados
            ├── models/
            │   └── api.models.ts    # Interfaces TypeScript para la API
            ├── shared/
            │   └── ids.ts
            └── environments/
                ├── environment.ts
                └── environment.prod.ts
```

---

## 🚀 Instalación y ejecución local

### Requisitos previos

- Node.js >= 18
- npm >= 9
- Angular CLI (`npm install -g @angular/cli`)

### Pasos

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd Frontend-plataforma-de-cursos-online

# 2. Instalar dependencias
npm install

# 3. Iniciar en modo desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:4200`.

---

## 📦 Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm start` | Inicia el servidor de desarrollo |
| `npm run build` | Genera el build de producción |
| `npm test` | Ejecuta las pruebas unitarias con Karma |
| `npm run ng -- <comando>` | Ejecuta comandos de Angular CLI |

---

## 🗺️ Rutas de la aplicación

| Ruta | Componente | Protegida |
|---|---|---|
| `/login` | `LoginComponent` | No |
| `/app/usuarios` | `UsuarioListComponent` | Sí |
| `/app/categorias` | `CategoriaListComponent` | Sí |
| `/app/calificaciones` | `CalificacionListComponent` | Sí |
| `/app/certificados` | `CertificadoListComponent` | Sí |

Las rutas bajo `/app` están protegidas por `auditUserGuard`, que verifica la sesión del usuario antes de permitir el acceso.

---

## 📐 Modelos de datos principales

La aplicación gestiona las siguientes entidades a través de la API REST:

- **Usuario** — Gestión de cuentas con roles, documento de identidad y estado activo/inactivo
- **Categoría** — Clasificación de cursos
- **Curso** — Cursos con categoría, duración y estado
- **Lección** — Lecciones asociadas a un curso con orden y duración
- **Material** — Recursos de apoyo vinculados a lecciones
- **Evaluación** — Evaluaciones por lección con porcentaje
- **Inscripción** — Registro de usuarios en cursos
- **Calificación** — Notas obtenidas en evaluaciones
- **Certificado** — Certificados generados al completar un curso
- **Pago** — Registro de pagos con método y estado

---

## 🌐 Despliegue

El frontend está desplegado en **Firebase Hosting**. Para generar y publicar una nueva versión:

```bash
# Build de producción
npm run build

# Desplegar en Firebase (requiere firebase-tools instalado)
cd web
firebase deploy --only hosting
```

---

## 🔗 Repositorio relacionado

- **Backend:** [backend-plataforma-de-cursos-online-1.onrender.com](https://backend-plataforma-de-cursos-online-1.onrender.com)
