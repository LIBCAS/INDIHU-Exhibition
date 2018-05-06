export type OptionalKeys<T extends Record<string, unknown>> = Exclude<
  {
    [K in keyof T]: Record<string, unknown> extends Pick<T, K> ? K : never;
  }[keyof T],
  undefined
>;

export type OptionalPropertiesOf<T extends Record<string, unknown>> = {
  [K in OptionalKeys<T>]: T[K];
};

export type ExcludeUndefinedValues<T extends Record<string, unknown>> = {
  [K in keyof T]: Exclude<T[K], undefined>;
};

export type DefaultOptions<T extends Record<string, unknown>> =
  ExcludeUndefinedValues<OptionalPropertiesOf<T>>;
