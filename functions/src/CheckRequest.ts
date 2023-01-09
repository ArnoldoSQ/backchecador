export function Matriculaexiste(Matricula: number): boolean {
  return Matricula === 123456;
}
export function Locationexiste(Localizacion: String): boolean {
  return Localizacion === "123456";
}
export function contraseñaexiste(contraseña: string): boolean {
  return contraseña == "123456";
}
export function checkllegada(Matricula: number): boolean {
  const hora = new Date();
  llegada: String;
  validar: Boolean;

  if (hora.getHours() <= 21 && hora.getMinutes() <= 15) {
    return true;
  }

  return false;
}

export interface CheckRequest {
  Matricula: string;
  Localizacion: String;
}

export interface InicioSeccion {
  Matricula: string;
  contraseña: string;
}
