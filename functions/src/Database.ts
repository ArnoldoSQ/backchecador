import * as Firebase from "firebase-admin";
import { ConsultaHistorial } from "./HistorialRequest";
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

    if (diaLaboral) {
        const horaActual = obtenerHoraActual();

        const historial: HistorialEntrada = {
            hora: new Date(),
            matricula: checkrequest.matricula,
            status: horaActual > diaLaboral.entrada ? 'RETARDO' : 'LLEGADA',
            localizacion: checkrequest.localizacion,
            nombre:diaLaboral.nombre
        }

        const data = await Firestore.collection("HistorialEntrada").add(historial);

        if (data) {
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

    if (dialaboral) {
        const horaActual = obtenerHoraActual()

        const historialsalida: HistorialSalida = {
            hora: new Date(),
            matricula: checkrequest.matricula,
            status: horaActual < dialaboral.salida ? 'ANTICIPADA' : 'A TIEMPO',
            localizacion: checkrequest.localizacion,
            nombre:dialaboral.nombre
        }

        const data = await Firestore.collection("HistorialSalida").add(historialsalida);

        if (data) {
            return new RespuestaChecador({
                estado: "Salida Registrada Con Exito",
                mensaje: 'Que tenga un Excelente Dia ;)'
            })
        } else {
            throw new RespuestaChecador({
                estado: 'Error inesperado.',
                mensaje: `No se pudo registrar la Salida. Por favor inténtelo de nuevo.`
            });

        }

    } else {
        throw new RespuestaChecador({
            estado: 'Empleado no labora.',
            mensaje: `El empleado con la matrícula ${checkrequest.matricula} no labora el día ${nombreDiaLaboral()}.`
        });
    }

}

export async function buscarDiaLaboral(checkrequest: CheckRequest): Promise<DiaLaboral | null> {
    const doc = await Firestore.doc(`Horario/${checkrequest.matricula}`).get();

    if (doc.exists) {
        const horario = doc.data() as Horario;
        if(horario.password == checkrequest.contraseña){
            return horario && horario[nombreDiaLaboral()] && ({...horario[nombreDiaLaboral()], nombre: horario.nombre}) || null as any;
        }else{
            throw new RespuestaChecador({
                estado: 'Contraseña invalida.',
                mensaje: `No es correcta la contraseña de la matricula ${checkrequest.matricula}. Asegúrese que los datos sean correctos.`
            });

        }
       
    } else {
        throw new RespuestaChecador({
            estado: 'Matrícula no existe.',
            mensaje: `No se encontró la matrícula ${checkrequest.matricula}. Asegúrese que los datos sean correctos.`
        });
    }
}

function nombreDiaLaboral(): Dia {
    return sanitizeString(new Date().toLocaleDateString('es-MX', { weekday: 'long' })) as Dia;
}

function obtenerHoraActual(): number {
    const hoy = new Date();
    return hoy.getHours() * 60 + hoy.getMinutes();
}

export async function consultarEntrada(Consulhistori: ConsultaHistorial): Promise<HistorialEntrada[]> {
    const data = await Firestore.collection("HistorialEntrada")
        .where("hora", ">=", new Date(Consulhistori.fechadesde))
        .where("hora", "<=", new Date(Consulhistori.fechaasta))
        .get();

    return data.docs.map(d => d.data() as HistorialEntrada);
}

export async function consultarSalida(Consulhistori: ConsultaHistorial): Promise<HistorialSalida[]> {
    const data = await Firestore.collection("HistorialSalida")
        .where("hora", ">=", new Date(Consulhistori.fechadesde))
        .where("hora", "<=", new Date(Consulhistori.fechaasta))
        .get();

    return data.docs.map(d => d.data() as HistorialSalida);
}

export async function consultarhistorico(Consulhistori: ConsultaHistorial): Promise<(HistorialEntrada | HistorialSalida)[]> {
    const entradas = await consultarEntrada(Consulhistori);
    const salidas = await consultarSalida(Consulhistori);
    return [...entradas, ...salidas]
}

export function sanitizeString(str: string): string {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}