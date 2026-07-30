import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { TelegramClient } from "teleproto";
import { StringSession } from "teleproto/sessions/index.js";
import { NewMessage } from "teleproto/events/index.js";
import input from "input";
import type { CommandRegistry } from "./core/registry.js";

export async function connect(mode: "token" | "phone", registry: CommandRegistry) {
  const apiId = Number(process.env.API_ID);
  const apiHash = process.env.API_HASH;
  if (!apiId || !apiHash) throw new Error("API_ID and API_HASH are required.");
  const sessionFile = process.env.SESSION_FILE ?? ".data/pyl.session";
  await mkdir(path.dirname(sessionFile), { recursive: true });
  const saved = await readFile(sessionFile, "utf8").catch(() => "");
  const client = new TelegramClient(new StringSession(saved), apiId, apiHash, { connectionRetries: 5 });
  if (mode === "token") {
    if (!process.env.BOT_TOKEN) throw new Error("BOT_TOKEN is required.");
    await client.start({ botAuthToken: process.env.BOT_TOKEN });
  } else {
    const phone = await input.text("Telegram phone number (+country code): ");
    await client.start({
      phoneNumber: async () => phone,
      phoneCode: async () => input.text("Enter the verification code sent by Telegram: "),
      password: async () => input.text("Two-step verification password (if enabled): "),
      onError: (error) => { console.error(error); }
    });
  }
  await writeFile(sessionFile, client.session.save(), "utf8");
  console.log(`\n✅ Pyl connected in ${mode} mode.`);
  client.addEventHandler(async (event: any) => {
    const text = String(event.message?.message ?? "").trim();
    if (!text.startsWith("/")) return;
    const [raw, ...args] = text.split(/\s+/);
    const commandName = raw.slice(1).split("@")[0];
    const command = registry.get(commandName);
    if (!command) return;
    const reply = (replyText: string) => event.message.reply({ message: replyText, parseMode: "html" });
    const replyText = async (text: string): Promise<void> => { await reply(text); };
    await command.execute({ event, client, args, reply, replyText });
  }, new NewMessage({}));
  return client;
}
