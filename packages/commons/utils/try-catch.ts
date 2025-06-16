/**
 * JS try catch is just annoying to work with, there's a lot of nesting involve
 * and we have to do type gymination to get the error type.
 *
 * This will solve all that type gymnastics at once
 */
export function tryCatch<T>(promise: Promise<T>) {
  const executor = async (): Promise<[T, null] | [null, Error]> => {
    try {
      const data = await promise;
      return [data, null];
    } catch (error) {
      return [null, error as Error];
    }
  };

  return {
    $errorType<E = Error>(): Promise<[T, null] | [null, E]> {
      return executor() as unknown as Promise<[T, null] | [null, E]>;
    },

    // self awaitable with default Error type
    // biome-ignore lint/suspicious/noThenProperty: intentional
    then<TResult1 = [T, null] | [null, Error], TResult2 = never>(
      onfulfilled?:
        | ((
            value: [T, null] | [null, Error],
          ) => TResult1 | PromiseLike<TResult1>)
        | null,
      // biome-ignore lint/suspicious/noExplicitAny: intentional
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): Promise<TResult1 | TResult2> {
      return executor().then(onfulfilled, onrejected);
    },
  };
}
