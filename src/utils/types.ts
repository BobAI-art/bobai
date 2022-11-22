export type FirstArgument<F> = F extends (arg: infer A) => unknown ? A : never;
export type SecondArgument<F> = F extends (arg: any, arg2: infer A) => unknown
  ? A
  : never;
