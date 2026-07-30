import type { PylCommand } from "../core/types.js";

const command: PylCommand = {
  name: "ping2",
  title: "Extended ping",
  description: "An example command loaded from the commands folder.",
  execute: ({ replyText }) => replyText("🏓 Pong 2 from a live command file.")
};
export default command;
