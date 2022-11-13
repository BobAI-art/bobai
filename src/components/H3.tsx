import { classNames } from "../toolbox";

const H3: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => (
  <h3
    className={classNames(
      className || "",
      "text-xl leading-normal tracking-tight"
    )}
    {...props}
  >
    {children}
  </h3>
);

export default H3;
