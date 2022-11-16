import React from "react";
import { classNames } from "../toolbox";

const NumberInput: React.FC<
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">
> = ({ className, ...props }) => (
  <input
    className={classNames(className || "", "form-input mt-1 block w-full")}
    type="number"
    {...props}
  />
);

export default NumberInput;
