import { classNames } from "../toolbox";

// interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   title: string;
//   showIcon: boolean;
// }

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
