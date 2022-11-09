import Form from "./Form";
import FormRow from "./FormRow";
import Button from "./Button";
import React, { useState } from "react";
import { z } from "zod";
import { promptSchema } from "../utils/schema";
import ErrorList from "./ErrorList";
import H2 from "./H2";

interface PromptSubmitParams {
  models?: {
    id: string;
    name: string;
    created: Date;
  }[];
  onSubmitPrompt: (options: { prompt: string; modelIds: string[] }) => void;
  isLoading: boolean;
}

const PromptSubmit: React.FC<PromptSubmitParams> = ({
  models,
  onSubmitPrompt,
  isLoading,
}) => {
  const [prompt, setPrompt] = useState("");
  const modelsToShow = models || [];
  const [modelIds, setModelIds] = useState(
    modelsToShow[0]?.id ? [modelsToShow[0]?.id] : []
  );

  if (modelsToShow.length === 0) {
    return null;
  }

  const handleFormSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (isLoading) {
      return;
    }
    if (validated.success) {
      onSubmitPrompt({ modelIds, prompt });
    }
  };
  const handleKeyboards = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (validated.success) {
        handleFormSubmit(e);
      } else {
        e.preventDefault();
      }
    }
  };

  const validator = z.object(promptSchema);
  const validated = validator.safeParse({ prompt, modelIds });

  return (
    <Form onSubmit={(e) => handleFormSubmit(e)}>
      <H2>Generate portraits</H2>
      <FormRow
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyboards}
        label="Prompt"
        component="textarea"
        placeholder="portrait of a <MODEL> as disney princess"
      />
      {modelsToShow.length > 1 && (
        <FormRow
          label="Models"
          component="multiselect"
          items={modelsToShow}
          value={modelIds}
          onChange={setModelIds}
          onKeyDown={handleKeyboards}
        />
      )}
      {prompt && <ErrorList validated={validated} extra={[]} />}
      <Button disabled={isLoading || !validated.success}>Add</Button>
    </Form>
  );
};

export default PromptSubmit;
