import * as Firebase from "firebase-admin";
import {
  CheckRequest,
  HistorialEntrada,
  HistorialSalida,
  Login,
} from "./Model";

Firebase.initializeApp();
const Firestore = Firebase.firestore();

export async function validarMatricula(Matricula: string): Promise<boolean> {
  const Matric = await Firestore.collection("Empleados")
    .where("matricula", "==", Matricula)
    .get();

  return !Matric.empty;
}
export async function checarEntrada(checkrequest: CheckRequest) {
  const historial_entrada: HistorialEntrada = {
    hora: new Date(),
    localizacion: checkrequest.localizacion,
    matricula: checkrequest.matricula,
  };

  const response = await Firestore.collection("HistorialEntrada").add(
    historial_entrada
  );
  return response.id;
}
export async function checarPartida(checkrequest: CheckRequest) {
  const historial_salida: HistorialSalida = {
    hora: new Date(),
    localizacion: checkrequest.localizacion,
    matricula: checkrequest.matricula,
  };
  return await Firestore.collection("HistorialSalida").add(historial_salida);
}

export async function checkMatricula(checkrequest: CheckRequest) {}
