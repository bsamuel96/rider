import { useState } from "react";

export function useChatComposer(onSend: (body: string) => Promise<void>) {
  const [value, setValue] = useState("");

  const submit = async () => {
    const nextValue = value.trim();
    if (!nextValue) {
      return;
    }

    setValue("");
    await onSend(nextValue);
  };

  return {
    value,
    setValue,
    submit,
    canSend: value.trim().length > 0
  };
}
