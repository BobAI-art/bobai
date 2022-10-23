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
        "flex cursor-pointer items-center gap-2 font-extrabold leading-normal tracking-tight underline decoration-pink-500 hover:text-slate-800 hover:decoration-pink-900 disabled:opacity-50"
      )}
    >
      {children}
    </button>
  );
};

export default Button;
