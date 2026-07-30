import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { TelegramClient } from "teleproto";
import { StringSession } from "teleproto/sessions/index.js";
import { NewMessage } from "teleproto/events/index.js";
import input from "input";
import type { CommandRegistry } from "./core/registry.js";

export async function connect(mode: "app" | "phone" | "bot", registry: CommandRegistry) {
  const apiId = Number(process.env.API_ID);
  const apiHash = process.env.API_HASH;
  if (!apiId || !apiHash) throw new Error("API_ID and API_HASH are required.");
  const sessionFile = process.env.SESSION_FILE ?? ".data/pyl.session";
  await mkdir(path.dirname(sessionFile), { recursive: true });
  const saved = await readFile(sessionFile, "utf8").catch(() => "");
  const client = new TelegramClient(new StringSession(saved), apiId, apiHash, { connectionRetries: 5 });
  if (mode === "bot") {
    const botToken = (process.env.BOT_TOKEN || await input.text("Bot token (format: numeric-id:token): ")).trim();
    if (!/^\d+:[A-Za-z0-9_-]+$/.test(botToken)) throw new Error("Invalid bot token format. Expected numeric-id:token.");
    await client.start({ botAuthToken: botToken });
  } else {
    const prompt = mode === "app" ? "Phone number for app credentials (+country code): " : "Telegram phone number (+country code): ";
    const phone = process.env.PHONE_NUMBER || await input.text(prompt);
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
