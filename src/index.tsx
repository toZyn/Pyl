import chalk from "chalk";
import React from "react";
import { render } from "ink";
import { watch } from "chokidar";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CommandRegistry } from "./core/registry.js";
import { builtins } from "./commands/_builtins.js";
import { App, type Mode } from "./ui/App.js";
import { connect } from "./telegram.js";
import { firstRunSetup } from "./setup.js";

const root = path.dirname(fileURLToPath(import.meta.url));
const commandsDir = path.join(root, "commands");
console.log(chalk.cyan.bold(`\n ██████╗ ██╗   ██╗██╗     \n ██╔══██╗╚██╗ ██╔╝██║     \n ██████╔╝ ╚████╔╝ ██║     \n ██╔═══╝   ╚██╔╝  ██║     \n ██║        ██║   ███████╗\n ╚═╝        ╚═╝   ╚══════╝`));
console.log(chalk.gray(" Telegram framework • live commands\n"));

const registry = new CommandRegistry();
const start = async (mode: Mode) => {
  await registry.loadDirectory(commandsDir);
  for (const command of builtins(() => registry.all())) registry.register(command);
  await connect(mode, registry);
  watch(commandsDir, { ignoreInitial: true }).on("add", (file) => registry.loadFile(file)).on("change", (file) => registry.loadFile(file));
  console.log(chalk.green(`👀 Watching ${commandsDir} — add or edit commands without restarting.`));
};

const config = await firstRunSetup();
process.env.API_ID = config.apiId;
process.env.API_HASH = config.apiHash;
render(<App onSelect={start} />);
