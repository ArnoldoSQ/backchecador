import * as functions from "firebase-functions";
import { checarEntrada, checarPartida } from "./Database";
import { CheckRequest } from "./Model";

export const checarLlegada = functions.https.onRequest(
  async (request, response) => {
    response.set("Access-Control-Allow-Origin", "*");

    if (request.method === "OPTIONS") {
      response.set("Access-Control-Allow-Methods", "POST");
      response.set("Access-Control-Allow-Headers", "Content-Type");
      response.status(204).send("");
    } else if (request.method === "POST") {
      const checkrequest: CheckRequest = request.body;
      try {
        const id = await checarEntrada(checkrequest);
        response.status(200).send(id);
      } catch (error) {
        response.status(500).send(error);
      }
    } else {
      response.status(400).send("error de metodo");
    }
  }
);

export const checarSalida = functions.https.onRequest(
  async (request, response) => {
    response.set("Access-Control-Allow-Origin", "*");

    if (request.method === "OPTIONS") {
      response.set("Access-Control-Allow-Methods", "POST");
      response.set("Access-Control-Allow-Headers", "Content-Type");
      response.status(204).send("");
    } else if (request.method === "POST") {
      const checkrequest: CheckRequest = request.body;
      try {
        const id = await checarPartida(checkrequest);
        response.status(200).send(id);
      } catch (error) {
        response.status(500).send(error);
      }
    } else {
      response.status(400).send("error de metodo");
    }
  }
);
