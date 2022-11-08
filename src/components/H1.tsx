import { classNames } from "../toolbox";

const H1: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => (
  <h1 className={classNames(className || "", "text-3xl font-bold")}>
    {children}
  </h1>
);

export default H1;
