import { useSyncExternalStore, useEffect, useRef } from "react";
import {
  FieldControl,
  FieldControlProps,
  KeyOf,
  ValueOf,
  useSingleton,
} from ".";

export function useField<
  TParent extends object,
  TKey extends KeyOf<TParent> = KeyOf<TParent>,
  TValue extends any = ValueOf<TParent, TKey>
>(props: FieldControlProps<TParent, TKey, TValue>) {
  const control = useSingleton(() => new FieldControl(props));
  const { setValue, getValue, validate, touch, register, subscribe } = control;
  useEffect(register, []);

  const value = useSyncExternalStore(subscribe, getValue);
  const error = useSyncExternalStore(subscribe, () => control.error);
  const errors = useSyncExternalStore(subscribe, () => control.errors);
  const isDirty = useSyncExternalStore(subscribe, () => control.isDirty);
  const isPristine = !isDirty;
  const isTouched = useSyncExternalStore(subscribe, () => control.isTouched);

  const isSubmitted = useSyncExternalStore(
    subscribe,
    () => control.isSubmitted
  );
  const isValidated = useSyncExternalStore(
    subscribe,
    () => control.isValidated
  );
  const isValid = isValidated && errors.length===0;
  const isInvalid = isValidated && errors.length>0;

  const ref = useRef()
  control.element = ref.current

  return {
    value,
    error,
    errors,
    isDirty,
    isPristine,
    isTouched,
    isSubmitted,
    isValidated,
    isValid,
    isInvalid,
    control,
    getValue,
    setValue,
    validate,
    touch,
    ref
  };
}

export type FieldApi<
  TParent extends object,
  TKey extends KeyOf<TParent> = KeyOf<TParent>,
  TValue extends any = ValueOf<TParent, TKey>
> = ReturnType<typeof useField<TParent, TKey, TValue>>;
