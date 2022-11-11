import { classNames } from "../toolbox";

const H2: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => (
  <h2
    className={classNames(
      className || "",
      "text-2xl font-bold leading-normal tracking-tight"
    )}
    {...props}
  >
    {children}
  </h2>
);

export default H2;
