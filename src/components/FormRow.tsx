import React from "react";
import Input from "./Input";
import Textarea from "./Textarea";
import MultiSelect from "./MultiSelect";
import NumberInput from "./NumberInput";

const components = {
  input: Input,
  textarea: Textarea,
  multiselect: MultiSelect,
  number: NumberInput,
};

type SelectProps<C extends keyof typeof components> =
  | React.ComponentProps<typeof components[C]> & {
      label: string;
      helpText?: string;
      component: C;
    };

const FormRow = <C extends keyof typeof components>({
  label,
  helpText,
  component,
  ...props
}: SelectProps<C>) => {
  const InputComponent = components[component as C];
  return (
    <label>
      {label}
      <InputComponent {...(props as any)} />
      {helpText && <p className="size-sm text-slate-500">{helpText}</p>}
    </label>
  );
};

export default FormRow;
