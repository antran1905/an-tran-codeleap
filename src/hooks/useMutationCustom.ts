import { useMutation, type UseMutationOptions, type UseMutationResult } from '@tanstack/react-query';

export function useMutationCustom<
  TData,
  TError = Error,
  TVariables = void,
  TContext = unknown,
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>,
): UseMutationResult<TData, TError, TVariables, TContext> {
  return useMutation(options);
}
