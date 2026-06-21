import { useState } from "react";

export function useSupportComposer(onReply: (body: string) => Promise<void>) {
  const [value, setValue] = useState("");

  const submit = async () => {
    const nextValue = value.trim();

    if (!nextValue) {
      return;
    }

    setValue("");
    await onReply(nextValue);
  };

  return {
    value,
    setValue,
    submit,
    canSubmit: value.trim().length > 0
  };
}
