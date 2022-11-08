import { classNames } from "../toolbox";
import React from "react";

const Form: React.FC<React.FormHTMLAttributes<HTMLFormElement>> = ({
  className,
  children,
  ...props
}) => (
  <form
    className={classNames(className || "", "flex flex-col gap-2")}
    {...props}
  >
    {children}
  </form>
);

export default Form;
