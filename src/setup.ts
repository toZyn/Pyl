import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import input from "input";

export type PylConfig = {
  apiId: string;
  apiHash: string;
  mode: "token" | "phone";
  botToken?: string;
};

export async function firstRunSetup(): Promise<PylConfig> {
  const file = path.resolve(".data/pyl.config.json");
  if (existsSync(file)) return JSON.parse(await readFile(file, "utf8")) as PylConfig;

  console.log("\nFirst-time setup\n");
  const apiId = await input.text("Telegram API ID: ");
  const apiHash = await input.text("Telegram API hash: ");
  const connection = await input.select("Login method:", ["Bot token login", "Telegram phone number login"]);
  const config: PylConfig = {
    apiId,
    apiHash,
    mode: connection === 0 ? "token" : "phone"
  };

  if (config.mode === "token") {
    while (true) {
      const botToken = (await input.text("Bot token (for example, 896123456:AA...): ")).trim();
      if (/^\d+:[A-Za-z0-9_-]+$/.test(botToken)) {
        config.botToken = botToken;
        break;
      }
      console.log("Invalid bot token format. It must look like <numeric-id>:<token>.");
    }
  }
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(config, null, 2), "utf8");
  return config;
}
