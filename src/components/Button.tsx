import { classNames } from "../toolbox";
import React from "react";

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      className={classNames(
        className || "",
        "flex cursor-pointer items-center gap-2 font-extrabold leading-normal underline disabled:opacity-50"
      )}
    >
      {children}
    </button>
  );
};

export default Button;
