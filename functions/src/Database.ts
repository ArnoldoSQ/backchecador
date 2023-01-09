import * as Firebase from "firebase-admin";
import {
  CheckRequest,
  Dia,
  DiaLaboral,
  HistorialEntrada,
  HistorialSalida,
  Horario,
  RespuestaChecador,
} from "./Model";

Firebase.initializeApp();
const Firestore = Firebase.firestore();

export async function validarMatricula(Matricula: string): Promise<boolean> {
  const Matric = await Firestore.collection("Empleados")
    .where("matricula", "==", Matricula)
    .get();

  return !Matric.empty;
}
export async function checarEntrada(checkrequest: CheckRequest): Promise<RespuestaChecador> {
  const diaLaboral = await buscarDiaLaboral(checkrequest);

  if(diaLaboral){
    const horaActual = obtenerHoraActual();

    const historial: HistorialEntrada = {
      hora: new Date(),
      matricula:checkrequest.matricula,
      status: horaActual > diaLaboral.entrada ? 'RETARDO': 'LLEGADA',
      localizacion: checkrequest.localizacion
    }

    const data = await Firestore.collection("HistorialEntrada").add(historial);

    if(data){
      return new RespuestaChecador({
        estado: 'Bienvenido.',
        mensaje: `Su entrada se ha registrado correctamente.`
      });
    } else {
      throw new RespuestaChecador({
        estado: 'Error inesperado.',
        mensaje: `No se pudo registrar la entrada. Por favor inténtelo de nuevo.`
      });
    }

  } else {
    throw new RespuestaChecador({
      estado: 'Empleado no labora.',
      mensaje: `El empleado con la matrícula ${checkrequest.matricula} no labora el día ${nombreDiaLaboral()}.`
    });
  }
}

export async function checarPartida(checkrequest: CheckRequest) {
  const historial_salida: HistorialSalida = {
    hora: new Date(),
    localizacion: checkrequest.localizacion,
    matricula: checkrequest.matricula,
  };
  return await Firestore.collection("HistorialSalida").add(historial_salida);
}

export async function buscarDiaLaboral(checkrequest: CheckRequest): Promise<DiaLaboral | null> {
  const doc = await Firestore.collection("Horario").doc(checkrequest.matricula).get();
  const horario = doc.data() as Horario;

  if(doc.exists){    
    return horario && horario[nombreDiaLaboral()] || null;
  }

  throw new RespuestaChecador({
    estado: 'Matrícula no existe.',
    mensaje: `No se encontró la matrícula ${checkrequest.matricula}. Asegúrese que los datos ean correctos.`
  });
}

function nombreDiaLaboral(): Dia {
  return new Date().toLocaleDateString('ex-MX', {weekday: 'long'}) as Dia;
}

function obtenerHoraActual(): number {
  const hoy = new Date();
  return hoy.getHours() * 60 + hoy.getMinutes();
}