import React from "react";
import { z } from "zod";

const ErrorList: React.FC<{
  validated: z.SafeParseReturnType<unknown, unknown>;
  extra: { code: string; message: string }[];
}> = ({ validated, extra = [] }) =>
  !validated.success || extra ? (
    <ul>
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
