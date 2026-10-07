import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  // eslint-disable-next-line tailwindcss/no-custom-classname
  return twMerge(clsx(inputs));
}

/**
 * Filter function to omit undefined values from the list.
 * Use `filter(omitUndefinedFilter)` to filter out undefined values from an array.
 */
export function omitUndefinedFilter<T>(value: T | undefined): value is T {
  return value !== undefined;
}
