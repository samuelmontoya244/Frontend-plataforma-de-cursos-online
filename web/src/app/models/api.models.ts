export interface CalificacionResponse {
  id_inscripcion: string;
  id_evaluacion: string;
  Nota: number;
  fecha_creacion: string | null;
  fecha_edicion: string | null;
  id_usuario_creacion: string;
  id_usuario_edita: string | null;
}

export interface CalificacionCreate {
  id_usuario_creacion: string;
  id_inscripcion: string;
  id_evaluacion: string;
  Nota: number;
}

export interface CalificacionUpdate {
  id_usuario_edita: string;
  id_inscripcion?: string;
  id_evaluacion?: string;
  Nota?: number;
}


// ✅ CORREGIDO: campos completos alineados con el backend
export interface CategoriaRead {
  id_categoria: string;
  nombre_categoria: string;
  fecha_creacion: string | null;
  fecha_edicion: string | null;
  id_usuario_creacion: string;
  id_usuario_edita: string | null;
}

export interface CategoriaCreate {
  nombre_categoria: string;
  id_usuario_creacion: string;
}

export interface CategoriaUpdate {
  nombre_categoria?: string;
  id_usuario_edita: string;
}


export interface CertificadoResponse {
  id_certificado: string;
  id_inscripcion: string;
  fecha_creacion: string | null;
  fecha_edicion: string | null;
  id_usuario_creacion: string;
  id_usuario_edita: string | null;
}

export interface CertificadoCreate {
  id_inscripcion: string;
  id_usuario_creacion: string;
}

export interface CertificadoUpdate {
  id_inscripcion?: string;
  id_usuario_edita: string;
}


export interface CursoResponse {
  id_curso: string;
  id_categoria: string;
  nombre_curso: string;
  duracion_horas: number;
  estado_curso: string;
  descripcion_curso: string | null;
  fecha_creacion: string | null;
  fecha_edicion: string | null;
}

export interface CursoCreate {
  id_categoria: string;
  nombre_curso: string;
  duracion_horas: number;
  estado_curso: string;
  // ✅ CORREGIDO: descripcion_curso (no descripicon_curso), sin id_usuario_creacion
  descripcion_curso: string | null;
}

export interface CursoUpdate {
  id_categoria?: string;
  nombre_curso?: string;
  duracion_horas?: number;
  estado_curso?: string;
  // ✅ CORREGIDO: descripcion_curso (no descripicon_curso), sin id_usuario_creacion
  descripcion_curso?: string | null;
}


export interface EvaluacionResponse {
  id_evaluacion: string;
  id_leccion: string;
  nombre_evaluacion: string;
  porcentaje: number;
  id_usuario_creacion: string;
  id_usuario_edita: string | null;
  fecha_creacion: string | null;
  fecha_edicion: string | null;
}

export interface EvaluacionCreate {
  id_leccion: string;
  nombre_evaluacion: string;
  porcentaje: number;
  // ✅ CORREGIDO: id_usuario_creacion no lo pide el backend en este schema
}

export interface EvaluacionUpdate {
  id_leccion?: string;
  nombre_evaluacion?: string;
  porcentaje?: number;
  id_usuario_edita?: string;
}


export interface InscripcionResponse {
  id_inscripcion: string;
  id_curso: string;
  id_usuario_inscrito: string;
  estado_inscripcion: string;
  fecha_creacion: string | null;
  fecha_edicion: string | null;
}

export interface InscripcionCreate {
  id_curso: string;
  id_usuario_inscrito: string;
  estado_inscripcion: string;
}

export interface InscripcionUpdate {
  id_curso?: string;
  id_usuario_inscrito?: string;
  estado_inscripcion?: string;
}


export interface LeccionResponse {
  id_curso: string;
  id_leccion: string;
  titulo_leccion: string;
  descripcion_leccion: string | null;
  orden: number;
  duracion_horas: number;
  fecha_creacion: string | null;
  fecha_edicion: string | null;
}

export interface LeccionCreate {
  id_usuario_creacion: string;
  id_curso: string;
  titulo_leccion: string;
  descripcion_leccion: string | null;
  orden: number;
  duracion_horas: number;
}

export interface LeccionUpdate {
  id_usuario_edita?: string;
  id_curso?: string;
  titulo_leccion?: string;
  descripcion_leccion?: string | null;
  orden?: number;
  duracion_horas?: number;
}


export interface MaterialResponse {
  id_material: string;
  id_leccion: string;
  titulo_material: string;
  tipo_material: string | null;
  URL_archivo: string;
  fecha_creacion: string | null;
  fecha_edicion: string | null;
}

export interface MaterialCreate {
  id_leccion: string;
  titulo_material: string;
  tipo_material: string | null;
  URL_archivo: string;
  // ✅ CORREGIDO: id_usuario_creacion no lo pide el backend en este schema
}

export interface MaterialUpdate {
  id_usuario_edita?: string;
  id_leccion?: string;
  titulo_material?: string;
  tipo_material?: string | null;
  URL_archivo?: string;
}


export interface PagoResponse {
  id_pago: string;
  id_usuario: string;
  id_curso: string;
  monto: number;
  estado_pago: string;
  metodo_pago: string;
  fecha_creacion: string | null;
  fecha_edicion: string | null;
}

export interface PagoCreate {
  // ✅ CORREGIDO: id_usuario requerido (lo selecciona el usuario en el dropdown)
  id_usuario: string;
  id_curso: string;
  monto: number;
  estado_pago: string;
  metodo_pago: string;
}

export interface PagoUpdate {
  id_usuario?: string;
  id_curso?: string;
  monto?: number;
  estado_pago?: string;
  metodo_pago?: string;
}


export interface UsuarioResponse {
  id_usuario: string;
  nombre_usuario: string;
  tipo_documento: string;
  documento_identidad: string;
  email: string;
  rol: string;
  activo: boolean;
  fecha_creacion: string;
  fecha_edicion: string | null;
}

export interface UsuarioCreate {
  nombre_usuario: string;
  tipo_documento: string;
  documento_identidad: string;
  email: string;
  contrasena: string;
  rol: string;
  activo: boolean;
}

export interface UsuarioUpdate {
  nombre_usuario?: string;
  tipo_documento?: string;
  documento_identidad?: string;
  email?: string;
  contrasena?: string;
  rol?: string;
  activo?: boolean;
}