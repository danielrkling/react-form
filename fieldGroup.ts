import React, { useSyncExternalStore, useMemo, useEffect, useRef } from "react";
import {
  FieldControl,
  Control,
  FieldControlProps,
  useSingleton,
  createField,
  KeyOf, ValueOf, 
  createFieldArray
} from ".";

export type FieldGroupApi<
  TParent extends object,
  TKey extends KeyOf<TParent> = KeyOf<TParent>,
  //@ts-expect-error
  TValue extends object = ValueOf<TParent, TKey>
> = ReturnType<typeof useFieldGroup<TParent, TKey, TValue>>;

export function useFieldGroup<
  TParent extends object,
  TKey extends KeyOf<TParent> = KeyOf<TParent>,
  //@ts-expect-error
  TValue extends object = ValueOf<TParent, TKey>
>(props: FieldControlProps<TParent, TKey, TValue>) {
  const control = useSingleton(() => new FieldControl(props));
  const { setValue, getValue, validate, register, subscribe } = control;
  useEffect(register, []);

  function watch<R>(selector: (values: TValue) => R) {
    return useSyncExternalStore(subscribe, () => selector(getValue()));
  }

  const Field = useSingleton(()=>createField(control))
  const FieldGroup = useSingleton(()=>createFieldGroup(control))
  const FieldArray = useSingleton(()=>createFieldArray(control))

  return {
    control,
    getValue,
    setValue,
    watch,
    validate,
    Field, 
    FieldGroup, 
    FieldArray
  };
}

export type FieldGroupProps<
  TParent extends object,
  TKey extends KeyOf<TParent> = KeyOf<TParent>,
  //@ts-expect-error
  TValue extends object = ValueOf<TParent, TKey>
> = FieldControlProps<TParent, TKey, TValue> & {
  children(props: FieldGroupApi<TParent, TKey, TValue>): React.ReactNode;
};

export type FieldGroupComponent<
  TParent extends object,
  TKey extends KeyOf<TParent> = KeyOf<TParent>,
  //@ts-expect-error
  TValue extends object = ValueOf<TParent, TKey>
> = (props: FieldGroupProps<TParent, TKey, TValue>) => React.ReactNode;

export function FieldGroup<
  TParent extends object,
  TKey extends KeyOf<TParent> = KeyOf<TParent>,
  //@ts-expect-error
  TValue extends object = ValueOf<TParent, TKey>
>(props: FieldGroupProps<TParent, TKey, TValue>): React.ReactNode {
  const { children, ...rest } = props;
  const field = useFieldGroup<TParent, TKey, TValue>(rest);
  return children(field);
}

export function createFieldGroup<TParent extends object>(
    control: Control<TParent>
  ) {
    return function FieldGroup<
    TKey extends KeyOf<TParent> = KeyOf<TParent>,
    //@ts-expect-error
    TValue extends object = ValueOf<TParent, TKey>
    >(props: Omit<FieldGroupProps<TParent, TKey, TValue>, "control">): React.ReactNode {
      const { children, ...rest } = props;
      const field = useFieldGroup<TParent, TKey, TValue>({
        ...rest,
        control,
      });
      return children(field);
    };
  }