import React from "react";
import { Box, Text } from "ink";
import SelectInput from "ink-select-input";

export type Mode = "token" | "phone";
export function App({ onSelect }: { onSelect: (mode: Mode) => void }) {
  const items = [
    { label: "🤖 Connect with a bot token", value: "token" as const },
    { label: "📱 Connect with a Telegram phone number", value: "phone" as const },
    { label: "✕ Exit", value: "exit" as const }
  ];
  return <Box flexDirection="column" padding={1}>
    <Text color="cyan">Choose how you want to start Pyl:</Text>
    <SelectInput items={items} onSelect={(item) => item.value === "exit" ? process.exit(0) : onSelect(item.value)} />
  </Box>;
}
