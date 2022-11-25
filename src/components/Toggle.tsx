import React, { PropsWithChildren } from "react";

export const Toggle: React.FC<
  PropsWithChildren<{
    value?: boolean;
    onChange?: (value: boolean) => void;
    ref?: React.RefObject<HTMLInputElement>;
    disabled?: boolean;
  }>
> = ({ value, disabled, children, onChange, ref }) => {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        disabled={disabled}
        ref={ref}
        type="checkbox"
        checked={value}
        onChange={(e) => onChange?.(e.target.checked)}
        className="peer sr-only"
      />
      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-site-pink-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
      <div className="ml-3">{children}</div>
    </label>
  );
};
