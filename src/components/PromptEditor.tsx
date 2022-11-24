import React, { useState } from "react";
import { useAutocomplete } from "../hooks/useAutocomplete";
import { AutocompleteSelector } from "./AutocompleteSelector";

export const PromptEditor = () => {
  const [cursorPosition, setCursorPosition] = useState(0);

  const ref = React.useRef<HTMLDivElement>(null);
  const [toSearch, setToSearch] = useState("");

  const currentPrompt = ref.current?.innerText || "";

  const autocomplete = useAutocomplete(
    toSearch,
    currentPrompt.includes("<model>")
  );

  const handleSelect = (text: string) => {
    const div = ref.current;
    if (div) {
      // cursor position
      // text before cursor
      const textBeforeCursor = div.innerText.slice(0, cursorPosition);
      // text after cursor
      const textAfterCursor = div.innerText.slice(cursorPosition);

      const before = textBeforeCursor.split(",").slice(0, -1);
      const after = textAfterCursor.split(",").slice(1);
      div.innerText = [...before, text, ...after].join(", ");

      const selection = window.getSelection();
      if (selection) {
        selection.selectAllChildren(div);
        selection.collapseToEnd();
      }
      div.focus();
      setToSearch("");
    }
  };

  const handleChange = () => {
    const div = ref.current;
    if (div) {
      // cursor position
      const cursorPos = window.getSelection()?.focusOffset;
      setCursorPosition(cursorPos || 0);
      // text before cursor
      const textBeforeCursor = div.innerText.slice(0, cursorPos);
      // text after cursor
      const textAfterCursor = div.innerText.slice(cursorPos);
      const prefix = textBeforeCursor.split(",").pop();
      const postfix = textAfterCursor.split(",").shift();
      const text = `${prefix}${postfix}`.trim();
      setToSearch(text);
    }
  };
  return (
    <>
      <div
        ref={ref}
        onInput={handleChange}
        onBlur={handleChange}
        className="rounded-md bg-white p-2 text-gray-600 shadow-md"
        contentEditable={true}
        placeholder="a awesome potrait of ..., during hike in the mountains"
      />
      <AutocompleteSelector
        onSelect={handleSelect}
        autocomplete={autocomplete}
      />
    </>
  );
};
