import Form from "./Form";
import FormRow from "./FormRow";
import Button from "./Button";
import React, { useState } from "react";
import { modelClasses } from "../utils/consts";
import moment from "moment";
import { trpc } from "../utils/trpc";
import { z } from "zod";
import { promptSchema } from "../utils/schema";
import ErrorList from "./ErrorList";
import toast from "react-hot-toast";

interface PromptSubmitParams {
  models?: {
    id: string;
    name: string;
    created: Date;
  }[];
}

const PromptSubmit: React.FC<PromptSubmitParams> = ({models}) => {
  const createPrompt = trpc.prompt.create.useMutation({
    onSuccess: () => {
      toast.success("Prompt created");
      setPrompt("")
    },
    onError: (error) => {
      toast.error(`Error creating prompt: ${error.message}`);
    }
  })
  const [prompt, setPrompt] = useState("")
  const modelsToShow = models || [];
  const [modelId, setModelId] = useState(modelsToShow[0]?.id || "")

  if(modelsToShow.length === 0) {
    return null;
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(validated.success) {
      createPrompt.mutate({modelId, prompt})
    }
  }
  const validator = z.object(promptSchema);
  const validated = validator.safeParse({prompt, modelId});

  return <Form  onSubmit={e => handleFormSubmit(e)}>
    <FormRow value={prompt} onChange={e => setPrompt(e.target.value)}  label="Prompt:" component="textarea" placeholder="<MODEL> as disney princess" />
    {modelsToShow.length > 1 && <select value={modelId} onChange={e => setModelId(e.target.value)} name="class" >
      {modelsToShow.map((model) => (
        <option key={model.id} value={model.id}>
          {model.name} Created: {moment(model.created).fromNow()}
        </option>
      ))}
    </select>}
    <ErrorList validated={validated} extra={[]} />
    <Button disabled={!validated.success}>Add</Button>
  </Form>;
};

export default PromptSubmit;
