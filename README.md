# Pyl

Framework de Telegram para ejecutar un **bot con token** o un **userbot con número de Telegram**, con una CLI bonita en [Ink](https://github.com/vadimdemedes/ink) y encabezado en [Chalk](https://github.com/chalk/chalk).

## Características

- Menú inicial interactivo con botones: token o número.
- Token: conexión directa con `BOT_TOKEN`.
- Número: solicita el código que Telegram envía a tu cuenta y soporta contraseña 2FA.
- Guarda la sesión en `.data/pyl.session` para no pedir el código cada vez.
- `/start`, `/help` y `/menu` muestran el menú de comandos.
- `/ping` viene incluido.
- Comandos en vivo: agrega o edita archivos dentro de `src/commands/` (en desarrollo) o `dist/commands/` (producción) sin reiniciar.
- Cada comando declara su nombre, título, descripción y función.

> Usa el modo número únicamente con tu propia cuenta y respeta las reglas de Telegram.

## Inicio rápido

```bash
npm install
cp .env.example .env
# completa API_ID y API_HASH; luego BOT_TOKEN o PHONE_NUMBER
npm run dev
```

Obtén `API_ID` y `API_HASH` en [my.telegram.org](https://my.telegram.org). Para un bot, crea el token con [@BotFather](https://t.me/BotFather).

Para producción:

```bash
npm run build
npm start
```

## Crear un comando

Crea `src/commands/hello.ts`:

```ts
import type { PylCommand } from "../core/types.js";

const command: PylCommand = {
  name: "hello",
  title: "Saludo",
  description: "Saluda al usuario.",
  aliases: ["hola"],
  execute: async ({ reply, args }) => {
    await reply(`Hola ${args.join(" ") || "mundo"} 👋`);
  }
};

export default command;
```

Guárdalo y Pyl lo cargará automáticamente. El menú lo incluirá en la siguiente consulta.

## Estructura

```text
src/
├── commands/       # comandos del bot, cargados en vivo
├── core/           # tipos y registro de comandos
├── ui/             # menú interactivo de Ink
├── index.ts        # CLI y watcher
└── telegram.ts     # conexión GramJS y dispatcher
```
