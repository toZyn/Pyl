import type { PylCommand } from "../core/types.js";

export function builtins(getCommands: () => PylCommand[]): PylCommand[] {
  const menu = async ({ reply }: any) => {
    const rows = getCommands().map((command) => `/${command.name} — ${command.title}\n${command.description}`);
    await reply(`✨ <b>Pyl</b>\n\n${rows.join("\n\n")}`);
  };
  return [
    { name: "start", title: "Iniciar", description: "Muestra el menú principal.", aliases: ["help", "menu"], execute: menu },
    { name: "ping", title: "Ping", description: "Comprueba que Pyl está conectado.", execute: ({ reply }) => reply("🏓 Pong — Pyl está activo.") }
  ];
}
