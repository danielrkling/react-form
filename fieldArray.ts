import React, { useSyncExternalStore, useMemo, useEffect, useRef, } from "react";
import {
  FieldControl,
  Control,
  FieldControlProps,
  useSingleton,
  KeyOf, 
  createField,
  createFieldGroup,
  useField, 
  ForceLookup
} from ".";

export type FieldArrayApi<
  TParent extends object,
  TKey extends KeyOf<TParent> = KeyOf<TParent>,
  TItem extends any = ForceLookup<ForceLookup<TParent,TKey>,number>
> = ReturnType<typeof useFieldArray<TParent, TKey, TItem>>;

export function useFieldArray<
  TParent extends object,
  TKey extends KeyOf<TParent> = KeyOf<TParent>,
  TItem extends any = ForceLookup<ForceLookup<TParent,TKey>,number>
>(props: FieldControlProps<TParent, TKey, TItem[]>) {
  const field = useField(props)
  const {getValue, setValue, control} = field

  function append(item: TItem) {
    setValue([...getValue(), item]);
  }

  function prepend(item: TItem) {
    setValue([item, ...getValue()]);
  }

  function insert(index: number, item: TItem) {
    const array = [...getValue()];
    array.splice(index, 0, item);
    setValue(array);
  }

  function replace(index: number, item: TItem) {
    const array = [...getValue()];
    array.splice(index, 1, item);
    setValue(array);
  }

  function remove(index: number) {
    const array = [...getValue()];
    array.splice(index, 1);
    setValue(array);
  }

  const Field = useSingleton(()=>createField(control))
  const FieldGroup = useSingleton(()=>createFieldGroup(control))
  const FieldArray = useSingleton(()=>createFieldArray(control))

  return {
    ...field,
    append,
    prepend,
    insert,
    replace,
    remove,
    Field,
    FieldGroup, 
    FieldArray
  };
}

export type FieldArrayProps<
  TParent extends object,
  TKey extends KeyOf<TParent> = KeyOf<TParent>,
  TItem extends any = ForceLookup<ForceLookup<TParent,TKey>,number>
> = FieldControlProps<TParent, TKey, TItem[]> & {
  children(props: FieldArrayApi<TParent, TKey, TItem>): React.ReactNode;
};

export type FieldArrayComponent<
  TParent extends object,
  TKey extends KeyOf<TParent> = KeyOf<TParent>,
  TItem extends any = ForceLookup<ForceLookup<TParent,TKey>,number>
> = (props: FieldArrayProps<TParent, TKey, TItem>) => React.ReactNode;

export function FieldArray<
  TParent extends object,
  TKey extends KeyOf<TParent> = KeyOf<TParent>,
  TItem extends any = ForceLookup<ForceLookup<TParent,TKey>,number>
>(props: FieldArrayProps<TParent, TKey, TItem>): React.ReactNode {
  const { children, ...rest } = props;
  const field = useFieldArray<TParent, TKey, TItem>(rest);
  return children(field);
}

export function createFieldArray<TParent extends object>(
  control: Control<TParent>
) {
  return function ArrayGroup<
  TKey extends KeyOf<TParent> = KeyOf<TParent>,
  TItem extends any = ForceLookup<ForceLookup<TParent,TKey>,number>
  >(props: Omit<FieldArrayProps<TParent, TKey, TItem>, "control">): React.ReactNode {
    const { children, ...rest } = props;
    const field = useFieldArray<TParent, TKey, TItem>({
      ...rest,
      control,
    });
    return children(field);
  };
}