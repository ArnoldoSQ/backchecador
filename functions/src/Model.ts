export interface Empleado {
  matricula: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  contraseña: string;
  correo: string;
  telefono: number;
  puesto: string;
}

export interface Horario {
  horaEntrada: Date;

  horaSalida: Date;
}
export interface HistorialEntrada {
  matricula: string;
  hora: Date;
  localizacion: Cordenadas;
  status: "LLEGADA" | "RETARDO";
}
export interface HistorialSalida {
  matricula: string;
  hora: Date;
  localizacion: Cordenadas;
  status: "A TIEMPO" | "ANTICIPADA" | "EXTRA";
}
export interface CheckRequest {
  matricula: string;
  contraseña: string;
  localizacion: Cordenadas;
}
export interface Cordenadas {
  longitud: number;
  latitud: number;
}

export interface Login {
  matricula: string;
  contraseña: string;
}
