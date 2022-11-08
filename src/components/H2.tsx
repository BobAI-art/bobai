import { classNames } from "../toolbox";

const H2: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => (
  <h2
    className={classNames(
      className || "",
      "text-2xl font-extrabold leading-normal tracking-tight"
    )}
  >
    {children}
  </h2>
);

export default H2;
