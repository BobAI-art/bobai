export type FirstArgument<F> = F extends (
  arg: infer A,
  ...args: unknown[]
) => unknown
  ? A
  : never;
export type SecondArgument<F> = F extends (
  arg: unknown,
  arg2: infer A,
  ...args: unknown[]
) => unknown
  ? A
  : never;
