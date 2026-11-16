// Tipos compartidos con el backend (code.gs)

export interface Negocio {
  nombre: string;
  tagline: string;
  logoUrl: string;
  moneda: string;
  colorPrimario: string;
  colorAcento: string;
  anuncio: string;
  heroTexto: string;
}

export interface Contacto {
  telefono: string;
  whatsapp: string;
  email: string;
  direccion: string;
  horarioTexto: string;
  estacionamiento: string;
  instagram: string;
  facebook: string;
  tiktok: string;
}

export interface Ubicacion {
  mapEmbed: string;
  mapLink: string;
  lat: string;
  lng: string;
}

export interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  duracion: number;
  precio: number;
  activo: boolean;
}

export interface Bloqueo {
  fecha: string;
  hora: string;
  motivo: string;
}

export interface Disponibilidad {
  anticipacionHoras: number;
  maxDias: number;
  diasCerrados: string[];
  bloqueos: Bloqueo[];
}

export interface Horarios {
  [weekday: string]: string[];
}

export interface Imagen {
  url: string;
  alt: string;
}

export interface AppConfig {
  negocio: Negocio;
  contacto: Contacto;
  ubicacion: Ubicacion;
  servicios: Servicio[];
  horarios: Horarios;
  disponibilidad: Disponibilidad;
  imagenes: Imagen[];
}

export type CitaEstado = 'pendiente' | 'confirmada' | 'completada' | 'cancelada';

export interface Cita {
  _row: number;
  fecha: string;
  hora: string;
  nombre: string;
  email: string;
  telefono: string;
  servicio: string;
  precio: number;
  estado: CitaEstado;
}

export interface Dashboard {
  config: AppConfig;
  citas: Cita[];
  spreadsheetId: string;
  spreadsheetUrl: string;
}
