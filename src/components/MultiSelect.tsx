import React from "react";
import { classNames } from "../toolbox";

interface MultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  items: {
    id: string;
    name: string;
  }[];
}

const MultiSelect: React.FC<
  Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> &
    MultiSelectProps
> = ({ className, value, onChange, items, ...props }) => (
  <select
    className={classNames(className || "", "form-input mt-1 block w-full")}
    multiple
    value={value}
    onChange={(e) =>
      onChange(
        [...e.target.options]
          .filter((opt) => opt.selected)
          .map((opt) => opt.value)
      )
    }
    {...props}
  >
    {items.map((items) => (
      <option key={items.id} value={items.id}>
        {items.name}
      </option>
    ))}
  </select>
);

export default MultiSelect;
