import React from "react";
import { classNames } from "../toolbox";

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({
  className,
  ...props
}) => (
  <textarea
    className={classNames(className || "", "form-input mt-1 block w-full")}
    {...props}
  />
);

export default Textarea;
