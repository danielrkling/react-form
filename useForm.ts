import { useMemo, useRef, useSyncExternalStore } from "react";
import {
  FormControlProps,
  FormControl,
  useSingleton,
  createField,
  createFieldGroup,
  createFieldArray,
} from ".";

// export type FormApi<TData extends object> = {
//   handleSubmit: (
//     onSuccess?: (values: TData) => any,
//     onFailure?: (
//       fieldErrors: ValidationError[],
//       formError: ValidationError
//     ) => any
//   ) => void;
//   Field: ChildField<TData>;
//   control: Control<TData>
// } &
//   SharedMethods<TData>;

export function useForm<TData extends object>(props: FormControlProps<TData>) {
  const control = useSingleton(() => new FormControl(props));
  const { setValue, validate, subscribe, getValue, handleSubmit } = control;

  function watch<R>(selector: (values: TData) => R) {
    return useSyncExternalStore(subscribe, () => selector(getValue()));
  }

  const isSubmitted = useSyncExternalStore(
    subscribe,
    () => control.isSubmitted
  );
  const isDirty = useSyncExternalStore(subscribe, () => control.isDirty);

  const Field = useSingleton(() => createField(control));
  const FieldGroup = useSingleton(() => createFieldGroup(control));
  const FieldArray = useSingleton(() => createFieldArray(control));

  return {
    control,
    handleSubmit,
    watch,
    getValue,
    setValue,
    isSubmitted,
    isDirty,
    validate,
    Field,
    FieldGroup,
    FieldArray,
  };
}
