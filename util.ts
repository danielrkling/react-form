import { useRef } from "react";
import { Control, FieldProps } from ".";

export type ValidationError = void|undefined|null|string | string[];
export type Validate<T> = (value: T, control: Control<T>) => ValidationError;
export type ValidateMethod =
  | "onChange"
  | "onBlur"
  | "onSubmit"
  | "afterSubmit"
  | "afterBlur";

export type ForceLookup<T, K> = T[K & keyof T]; // no error

export type KeyOf<TParent extends object> = TParent extends Array<any>
  ? number
  : keyof TParent;
  // export type KeyOf<TParent extends object> = keyof TParent;

export type ValueOf<
  TParent extends object,
  TKey extends KeyOf<TParent>
> = TParent extends Array<infer TItem> ? TItem : ForceLookup<TParent, TKey>;



export function useSingleton<T>(init: () => T): T {
  const ref = useRef<T>();
  if (ref.current === undefined) {
    ref.current = init();
  }
  return ref.current;
}