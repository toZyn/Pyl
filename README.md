# Pyl

A Telegram bot and userbot framework with a Chalk banner, an Ink interactive CLI, and live command loading.

## Features

- Interactive first-run setup: API ID, API hash, and connection mode are requested in the terminal.
- Connect with either a bot token or a Telegram phone number.
- Phone mode asks for the Telegram verification code and supports two-step verification.
- Configuration and the GramJS session are stored locally in `.data/`.
- `/start`, `/help`, and `/menu` display the available commands.
- `/ping` is included by default.
- Add or edit command files in `src/commands/` during development without restarting.

> Use phone mode only with your own account and follow Telegram's rules.

## Quick start

```bash
npm install
npm run dev
```

On the first run, Pyl asks for the Telegram API ID, API hash, and whether you want to use a bot token or a phone number. The answers are saved locally so they are not requested again.

For production:

```bash
npm run build
npm start
```

## Create a command

Create `src/commands/hello.ts`:

```ts
import type { PylCommand } from "../core/types.js";

const command: PylCommand = {
  name: "hello",
  title: "Greeting",
  description: "Greet the user.",
  aliases: ["hi"],
  execute: async ({ reply, args }) => {
    await reply(`Hello ${args.join(" ") || "world"} 👋`);
  }
};

export default command;
```

Save the file and Pyl loads it automatically. It will appear in the next menu request.

## Structure

```text
src/
├── commands/       # live-loaded commands
├── core/            # command types and registry
├── ui/              # Ink interactive menu
├── setup.ts         # first-run local configuration
├── index.ts         # CLI and watcher
└── telegram.ts      # Telegram connection and dispatcher
```
