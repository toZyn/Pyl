import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { TelegramClient } from "gramjs";
import { StringSession } from "gramjs/sessions/index.js";
import { Api } from "gramjs";
import { NewMessage } from "gramjs/events/index.js";
import input from "input";
import type { CommandRegistry } from "./core/registry.js";

export async function connect(mode: "token" | "phone", registry: CommandRegistry) {
  const apiId = Number(process.env.API_ID);
  const apiHash = process.env.API_HASH;
  if (!apiId || !apiHash) throw new Error("Configura API_ID y API_HASH en .env");
  const sessionFile = process.env.SESSION_FILE ?? ".data/pyl.session";
  await mkdir(path.dirname(sessionFile), { recursive: true });
  const saved = await readFile(sessionFile, "utf8").catch(() => "");
  const client = new TelegramClient(new StringSession(saved), apiId, apiHash, { connectionRetries: 5 });
  if (mode === "token") {
    if (!process.env.BOT_TOKEN) throw new Error("Falta BOT_TOKEN en .env");
    await client.start({ botAuthToken: process.env.BOT_TOKEN });
  } else {
    const phone = process.env.PHONE_NUMBER || await input.text("Número de Telegram (+código de país): ");
    await client.start({
      phoneNumber: async () => phone,
      phoneCode: async () => input.text("Código recibido en Telegram: "),
      password: async () => input.text("Contraseña 2FA (si tienes): "),
      onError: (error) => { console.error(error); return true; }
    });
  }
  await writeFile(sessionFile, client.session.save(), "utf8");
  console.log(`\n✅ Pyl conectado en modo ${mode}.`);
  client.addEventHandler(async (event: any) => {
    const text = String(event.message?.message ?? "").trim();
    if (!text.startsWith("/")) return;
    const [raw, ...args] = text.split(/\s+/);
    const commandName = raw.slice(1).split("@")[0];
    const command = registry.get(commandName);
    if (!command) return;
    await command.execute({ event, client, args, reply: (replyText: string) => event.message.reply({ message: replyText, parseMode: "html" }) });
  }, new NewMessage({}));
  return client;
}
