import React, { ComponentProps } from "react";
import Input from "./Input";
import Textarea from "./Textarea";

const components = {
  input: Input,
  textarea: Textarea,
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
  className,
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
