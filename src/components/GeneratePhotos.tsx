import React, { useState } from "react";
import Button from "./Button";
import { Dialog } from "@headlessui/react";
import H2 from "./H2";
import { XMarkIcon } from "@heroicons/react/24/solid";
import FormRow from "./FormRow";
import ErrorList from "./ErrorList";
import { promptSchema } from "../utils/schema";

const GeneratePhotos: React.FC<{
  onNewPrompt: (prompt: string) => void;
}> = ({ onNewPrompt }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");

  const validated = promptSchema.safeParse(prompt);
  const handleFormSubmit = () => {
    if (!validated.success) return;
    onNewPrompt(prompt);
    setIsOpen(false);
  };
  return (
    <>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true">
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="mx-auto w-full rounded bg-white p-2 sm:w-2/3 lg:w-1/2">
                <Dialog.Title className="flex justify-between">
                  <H2>Generate more</H2>
                  <XMarkIcon
                    className="w-8 cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  />
                </Dialog.Title>
                <H2>TODO: some styles to not type prompt </H2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleFormSubmit();
                  }}
                >
                  <FormRow
                    component="textarea"
                    label="Your prompt"
                    placeholder="Portrait of person, as a character of raiders of the lost ark movie, futuristic, 8k, 35mm, cinematic lighting"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  {prompt && <ErrorList validated={validated} extra={[]} />}
                </form>
                <div className="flex justify-between">
                  <Button
                    onClick={handleFormSubmit}
                    disabled={!validated.success}
                  >
                    Generate
                  </Button>
                  <Button onClick={() => setIsOpen(true)}>Cancel</Button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </div>
      </Dialog>
      <Button onClick={() => setIsOpen(true)}>Generate more like that</Button>
    </>
  );
};

export default GeneratePhotos;
