import type { PylCommand } from "../core/types.js";

const command: PylCommand = {
  name: "ping2",
  title: "Ping extendido",
  description: "Otro ejemplo de comando cargado desde la carpeta commands.",
  execute: ({ reply }) => reply("🏓 Pong 2 desde un archivo en vivo.")
};
export default command;
