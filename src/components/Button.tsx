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
        "flex cursor-pointer items-center gap-2  rounded bg-site-pink-500 px-6  py-2 hover:bg-site-pink-600 disabled:opacity-50"
      )}
    >
      {children}
    </button>
  );
};

export default Button;
