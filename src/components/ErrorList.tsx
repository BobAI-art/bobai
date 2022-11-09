import React from "react";
import { z } from "zod";
import { classNames } from "../toolbox";

const ErrorList: React.FC<{
  validated: z.SafeParseReturnType<unknown, unknown>;
  extra: { code: string; message: string }[];
  className?: string;
}> = ({ validated, extra = [], className }) =>
  !validated.success || extra.length > 0 ? (
    <ul
      className={classNames(
        className || "",
        "list-inside list-disc rounded border border-red-500 bg-red-100 p-2 text-red-700"
      )}
    >
      {!validated.success &&
        validated.error.errors.map((error) => (
          <li key={error.code}>{error.message}</li>
        ))}
      {extra.map((error) => (
        <li key={error.code}>{error.message}</li>
      ))}
    </ul>
  ) : (
    <></>
  );

export default ErrorList;
