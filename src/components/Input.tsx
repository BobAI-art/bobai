import React from "react";
import { classNames } from "../toolbox";

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  className,
  ...props
}) => (
  <input
    className={classNames(className || "", "form-input mt-1 block w-full")}
    {...props}
  />
);

export default Input;
