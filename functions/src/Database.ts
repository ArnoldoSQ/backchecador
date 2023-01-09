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

export async function checarPartida(checkrequest: CheckRequest): Promise<RespuestaChecador> {
  const dialaboral = await buscarDiaLaboral(checkrequest);

  if(dialaboral){
    const horaActual = obtenerHoraActual()

    const historialsalida:HistorialSalida ={
      hora: new Date(),
     matricula:checkrequest.matricula,
     status: horaActual<dialaboral.salida ? 'ANTICIPADA':'A TIEMPO',
     localizacion:checkrequest.localizacion,
    }

    const data = await Firestore.collection("HistorialSalida").add(historialsalida);

    if(data){
      return new RespuestaChecador({
        estado:"Salida Registrada Con Exito",
        mensaje: 'Que tenga un Excelente Dia ;)'
      })
    } else {
      throw new RespuestaChecador({
        estado: 'Error inesperado.',
        mensaje: `No se pudo registrar la Salida. Por favor inténtelo de nuevo.`
      });

    }

  } else{
    throw new RespuestaChecador({
      estado: 'Empleado no labora.',
      mensaje: `El empleado con la matrícula ${checkrequest.matricula} no labora el día ${nombreDiaLaboral()}.`
    });
  }

}

export async function buscarDiaLaboral(checkrequest: CheckRequest): Promise<DiaLaboral | null> {
  const doc = await Firestore.doc(`Horario/${checkrequest.matricula}`).get();

  if(doc.exists){
    const horario = doc.data() as Horario;    
    return horario && horario[nombreDiaLaboral()] || null;
  } else {
    throw new RespuestaChecador({
      estado: 'Matrícula no existe.',
      mensaje: `No se encontró la matrícula ${checkrequest.matricula}. Asegúrese que los datos sean correctos.`
    });
  }
}

function nombreDiaLaboral(): Dia {
  return new Date().toLocaleDateString('ex-MX', {weekday: 'long'}) as Dia;
}

function obtenerHoraActual(): number {
  const hoy = new Date();
  return hoy.getHours() * 60 + hoy.getMinutes();
}