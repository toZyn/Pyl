import type { Api } from "teleproto";

export type PylContext = {
  event: any;
  client: any;
  args: string[];
  reply: (text: string) => Promise<Api.Message>;
};

export type PylCommand = {
  name: string;
  title: string;
  description: string;
  aliases?: string[];
  execute: (ctx: PylContext) => Promise<void> | void;
};
