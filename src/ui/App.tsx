import React from "react";
import { Box, Text } from "ink";
import SelectInput from "ink-select-input";
import type { LoginMode } from "../setup.js";

export function App({ onSelect }: { onSelect: (mode: LoginMode) => void }) {
  const items = [
    { label: "🔑 App credentials (API ID + API hash)", value: "app" as const },
    { label: "📱 Phone number", value: "phone" as const },
    { label: "🤖 Bot token (numeric-id:token)", value: "bot" as const },
    { label: "✕ Exit", value: "exit" as const }
  ];
  return <Box flexDirection="column" padding={1}>
    <Text color="cyan">Choose how you want to start Pyl:</Text>
    <SelectInput items={items} onSelect={(item) => item.value === "exit" ? process.exit(0) : onSelect(item.value)} />
  </Box>;
}
