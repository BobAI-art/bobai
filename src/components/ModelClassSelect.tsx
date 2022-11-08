import { defaultModelClass, modelClasses } from "../utils/consts";
import Button from "./Button";
import React, { useState } from "react";

export const ModelClassSelect: React.FC<{
  onChange?: (value: string) => void;
}> = ({ onChange }) => {
  const [isCustom, setIsCustom] = useState(false);
  const [value, setValue] = useState<string>(defaultModelClass);
  const handleChange = (e: { target: { value: string } }) => {
    onChange?.(e.target.value);
    setValue(e.target.value);
  };

  return (
    <>
      <div className="flex items-center gap-2 ">
        <label htmlFor="class">Class</label>
        {isCustom ? (
          <input
            value={value}
            onChange={handleChange}
            type={"text"}
            name={"class"}
            placeholder={"Custom class"}
          />
        ) : (
          <select name="class" value={value} onChange={handleChange}>
            {[...modelClasses.entries()].map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        )}

        <Button
          onClick={(e) => {
            e.preventDefault();
            setIsCustom((current) => !current);
          }}
        >
          {isCustom ? "Pre selected" : "Custom"}
        </Button>
      </div>
      <p className="text-sm text-slate-500">
        One to three word description of your subject: <b>young blonde girl</b>,{" "}
        <b>australian shepherd</b>
      </p>
    </>
  );
};
