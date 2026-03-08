import { UseQueryResult, UseSuspenseQueryResult } from "@tanstack/react-query";

export const combineAggregateQueries = <TData>(queries: UseQueryResult<TData>[]) => ({
  isPending: queries.some((q) => q.isPending),
  data: queries.map((q) => q.data).filter((d) => d !== undefined),
});

export const combineFlatSuspenseQueries = <TData>(queries: UseSuspenseQueryResult<TData>[]) => ({
  data: queries.map((query) => query.data).flat(),
});
