import {
  Validate,
  ValidateMethod,
  Control,
  FieldControl,
  Fields,
  ValidationError,
  ControlProps,
} from ".";

export type FormControlProps<TValue extends object> = ControlProps<TValue> & {
  defaultValues: TValue;
};

export class FormControl<TValue extends object> extends Control<TValue> {
  value: TValue;
  listeners: Set<() => void>;
  isSubmitted: boolean;

  constructor(props: FormControlProps<TValue>) {
    super(props);
    this.listeners = new Set();
    this.value = props.defaultValues;
    this.method = props.method ?? "onSubmit";
    this.isSubmitted = false;
    this.initialValue = props.defaultValues;
    this.fields={} as Fields<TValue>
  }

  trigger = () => {
    for (const listener of this.listeners) {
      listener();
    }
  };

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  setValue = (value: TValue, silent: boolean = false): void => {
    this.value = value;
    if (!silent) this.trigger();
  };

  getValue = () => {
    return this.value;
  };

  handleSubmit = (
    onValid?: (values: TValue) => any,
    onInvalid?: (errorList: string[]) => any
  ) => {
    this.isSubmitted = true;

    const errorList = this.validate();
    this.focusFirstError()
    if (errorList.length === 0) {
      onValid?.(this.getValue());
    } else {
      onInvalid?.(errorList);
    }
  };
}
