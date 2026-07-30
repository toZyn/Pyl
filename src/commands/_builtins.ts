import type { PylCommand } from "../core/types.js";

export function builtins(getCommands: () => PylCommand[]): PylCommand[] {
  const menu = async ({ reply }: any) => {
    const rows = getCommands().map((command) => `/${command.name} — ${command.title}\n${command.description}`);
    await reply(`✨ <b>Pyl</b>\n\n${rows.join("\n\n")}`);
  };
  return [
    { name: "start", title: "Start", description: "Display the main menu.", aliases: ["help", "menu"], execute: menu },
    { name: "ping", title: "Ping", description: "Check that Pyl is connected.", execute: ({ reply }) => reply("🏓 Pong — Pyl is online.") }
  ];
}
