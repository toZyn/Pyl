import { readdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { PylCommand } from "./types.js";

export class CommandRegistry {
  private commands = new Map<string, PylCommand>();

  async loadDirectory(directory: string) {
    const entries = await readdir(directory, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      if (!entry.isFile() || !/\.(js|ts|mjs|mts)$/.test(entry.name) || entry.name.startsWith("_")) continue;
      await this.loadFile(path.join(directory, entry.name));
    }
  }

  async loadFile(file: string) {
    try {
      const url = `${pathToFileURL(file).href}?update=${Date.now()}`;
      const imported = await import(url);
      const command = (imported.default ?? imported.command) as PylCommand;
      if (!command?.name || typeof command.execute !== "function") return;
      this.commands.set(command.name.toLowerCase(), command);
      for (const alias of command.aliases ?? []) this.commands.set(alias.toLowerCase(), command);
      console.log(`  ↻ ${command.name} cargado`);
    } catch (error) {
      console.error(`  No se pudo cargar ${path.basename(file)}:`, error);
    }
  }

  register(command: PylCommand) {
    this.commands.set(command.name.toLowerCase(), command);
    for (const alias of command.aliases ?? []) this.commands.set(alias.toLowerCase(), command);
  }

  get(name: string) { return this.commands.get(name.toLowerCase()); }
  all() { return [...new Set(this.commands.values())].sort((a, b) => a.name.localeCompare(b.name)); }
}
