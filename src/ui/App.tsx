import React from "react";
import { Box, Text } from "ink";
import SelectInput from "ink-select-input";

export type Mode = "token" | "phone";
export function App({ onSelect }: { onSelect: (mode: Mode) => void }) {
  const items = [
    { label: "🤖 Conectar con token de bot", value: "token" as const },
    { label: "📱 Conectar con número de Telegram", value: "phone" as const },
    { label: "✕ Salir", value: "exit" as const }
  ];
  return <Box flexDirection="column" padding={1}>
    <Text color="cyan">Selecciona cómo quieres iniciar Pyl:</Text>
    <SelectInput items={items} onSelect={(item) => item.value === "exit" ? process.exit(0) : onSelect(item.value)} />
  </Box>;
}
