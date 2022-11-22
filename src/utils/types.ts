export type FirstArgument<F> = F extends (arg: infer A, ...args: any[]) => any
  ? A
  : never;
export type SecondArgument<F> = F extends (
  arg: any,
  arg2: infer A,
  ...args: any[]
) => any
  ? A
  : never;
