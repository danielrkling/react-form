import {
  Validate,
  ValidateMethod,
  FieldControl,
  ValidationError,
  KeyOf,
} from ".";

// export type Fields<T> = Map<keyof T, FieldControl<any>>;
export type Fields<T> = T extends Array<infer TValue>
  ? Array<FieldControl<T>>
  : T extends object
  ? {
      [K in KeyOf<T>]: FieldControl<T, K>;
    }
  : {};

export type ControlProps<TValue> = {
  validate?: Validate<TValue>;
  method?: ValidateMethod;
};

export abstract class Control<TValue> {
  initialValue: TValue;
  #validate: Validate<TValue>;
  method: ValidateMethod;
  fields: Fields<TValue>;
  error: ValidationError;
  errors: string[];
  isValidated: boolean;
  element: HTMLElement;

  abstract trigger(): void;
  abstract subscribe(listener: () => void): () => void;
  abstract get isSubmitted(): boolean;

  abstract setValue(value: TValue, silent?: boolean): void;
  abstract getValue(): TValue;

  constructor(props: ControlProps<TValue>) {
    // this.fields = new Map();

    this.#validate = props.validate;
    this.isValidated = false;
    this.method = props.method;
    this.errors = [];
  }

  get isDirty() {
    return this.initialValue !== this.getValue();
  }

  addError = (error: ValidationError) => {
    if (typeof error === "string") {
      this.errors.push(error);
    } else if (Array.isArray(error)) {
      this.errors.push(...error);
    }
  };

  validate = (silent?: boolean): string[] => {
    const errorList = [];
    this.errors = [];
    this.addError(this.#validate?.(this.getValue(), this));

    // this.fields.forEach((f) => {
    //   errorList.push(...f.validate(true));
    // });
    for (const f of Object.values(this.fields)) {
      errorList.push(...f.validate(true));
    }

    this.error = this.#validate?.(this.getValue(), this);
    errorList.push(this.error);

    this.isValidated = true;
    if (!silent) this.trigger();
    return errorList.filter((v) => typeof v === "string");
  };

  focusFirstError = (): boolean => {
    if (this.error && this.element) {
      this.element.focus();
      return true;
    }

    for (const field of Object.values(this.fields)) {
      if (field.focusFirstError()) return true;
    }
    // for (const field of this.fields.values()){
    //   if (field.focusFirstError()) return true
    // }
  };
}
