import React, { useSyncExternalStore, useMemo, useEffect } from "react";
import {
  KeyOf,
  ValueOf,
  FieldControlProps,
  FieldControl,
  useField,
  Control,
  FieldApi,
} from ".";

export type FieldProps<
  TParent extends object,
  TKey extends KeyOf<TParent> = KeyOf<TParent>,
  TValue extends any = ValueOf<TParent, TKey>
> = FieldControlProps<TParent, TKey, TValue> & {
  children(props: FieldApi<TParent, TKey, TValue>): React.ReactNode;
};

export type FieldComponent<
  TParent extends object,
  TKey extends KeyOf<TParent> = KeyOf<TParent>,
  TValue extends any = ValueOf<TParent, TKey>
> = (props: FieldProps<TParent, TKey, TValue>) => React.ReactNode;

export function Field<
  TParent extends object,
  TKey extends KeyOf<TParent> = KeyOf<TParent>,
  TValue extends any = ValueOf<TParent, TKey>
>(props: FieldProps<TParent, TKey, TValue>): React.ReactNode {
  const { children, ...rest } = props;
  const field = useField<TParent, TKey, TValue>(rest);
  return children(field);
}

// export type ChildField<TParent extends object> = <
//   TKey extends KeyOf<TParent>,
//   TValue extends ValueOf<TParent, TKey>,
//   TSubscribe extends boolean = DefaultSubscribe<TValue>
// >(
//   props: Omit<FieldProps<TParent, TKey, TValue, TSubscribe>, "control">
// ) => React.ReactNode;

export function createField<TParent extends object>(control: Control<TParent>) {
  return function Field<
    TKey extends KeyOf<TParent> = KeyOf<TParent>,
    TValue extends any = ValueOf<TParent, TKey>
  >(props: Omit<FieldProps<TParent, TKey, TValue>, "control">): React.ReactNode {
    const { children, ...rest } = props;
    const field = useField<TParent, TKey, TValue>({
      ...rest,
      control,
    });
    return children(field);
  };
}
