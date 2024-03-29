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
  lunes?: DiaLaboral;
  martes?: DiaLaboral;
  miercoles?: DiaLaboral;
  jueves?: DiaLaboral;
  viernes?: DiaLaboral;
  nombre: string;
  password:string;
}

export interface HistorialEntrada {
  matricula: string;
  nombre:string;
  hora: number;
  localizacion: Cordenadas;
  status: 'LLEGADA' | 'RETARDO';
}

export interface HistorialSalida {
  matricula: string;
  nombre: string;
  hora: number;
  localizacion: Cordenadas;
  status: 'A TIEMPO' | 'ANTICIPADA';
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

export interface DiaLaboral{
  entrada: number;
  salida: number;
  nombre:string;
}

export type Dia = 'lunes' |'martes' |'miercoles' |'jueves' |'viernes';

export class RespuestaChecador{
  public estado: string;
  public mensaje: string;

  constructor(respuesta: RespuestaChecador){
    this.estado = respuesta.estado;
    this.mensaje = respuesta.mensaje;
  }
}
