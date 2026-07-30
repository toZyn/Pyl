import type { PylCommand } from "../core/types.js";

export function builtins(getCommands: () => PylCommand[]): PylCommand[] {
  const menu = async ({ replyText }: any) => {
    const rows = getCommands().map((command) => `/${command.name} — ${command.title}\n${command.description}`);
    await replyText(`✨ <b>Pyl</b>\n\n${rows.join("\n\n")}`);
  };
  return [
    { name: "start", title: "Start", description: "Display the main menu.", aliases: ["help", "menu"], execute: menu },
    { name: "ping", title: "Ping", description: "Check that Pyl is connected.", execute: ({ replyText }) => replyText("🏓 Pong — Pyl is online.") }
  ];
}
