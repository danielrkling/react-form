import { Control, ControlProps, KeyOf, ValueOf, Fields } from ".";

export type FieldControlProps<
  TParent extends object,
  TKey extends KeyOf<TParent> = KeyOf<TParent>,
  TValue extends any = ValueOf<TParent, TKey>
> = ControlProps<TValue> & {
  name: TKey;
  control: Control<TParent>;
};

export class FieldControl<
  TParent extends object,
  TKey extends KeyOf<TParent> = KeyOf<TParent>,
  TValue extends any = ValueOf<TParent, TKey>
> extends Control<TValue> {
  #parent: Control<TParent>;
  name: TKey;
  isTouched: boolean;

  constructor(props: FieldControlProps<TParent, TKey, TValue>) {
    super(props);
    this.name = props.name;
    this.#parent = props.control;
    this.method ??= this.#parent.method;
    this.isTouched = false;

    this.initialValue = this.getValue();
    this.fields= (Array.isArray(this.initialValue) ? [] : {}) as Fields<TValue>
    // this.register()
  }

  register = () => {
    // this.#parent.fields.set(this.name as keyof TParent, this);
    // return () => {
    //   this.#parent.fields.delete(this.name as keyof TParent);
    // };

    //@ts-expect-error
    this.#parent.fields[this.name] = this
    return ()=>{
      //@ts-expect-error
       delete this.#parent.fields[this.name as KeyOf<TParent>]
    }
  };

  trigger = (): void => {
    this.#parent.trigger();
  };

  subscribe = (listener: () => void) => this.#parent.subscribe(listener);

  get isSubmitted() {
    return this.#parent.isSubmitted;
  }

  setValue = (value: TValue, silent: boolean = false): void => {
    const prev = this.#parent.getValue();
    if (Array.isArray(prev)) {
      const array = [...prev] as TParent;
      array[this.name as number] = value as TValue;
      this.#parent.setValue(array, true);
    } else {
      this.#parent.setValue(
        {
          ...prev,
          [this.name]: value,
        },
        true
      );
    }

    this.isValidated = false;
    if (
      this.method === "onChange" ||
      (this.method === "afterSubmit" && this.isSubmitted) ||
      (this.method === "afterBlur" && this.isTouched)
    ) {
      this.validate(true);
    }
    if (!silent) this.trigger();
  };

  getValue = (): TValue => {
    return this.#parent.getValue()[this.name as keyof TParent] as TValue;
  };

  touch = (): void => {
    this.isTouched = true;
    if (this.method === "afterBlur" || this.method === "onBlur") {
      this.validate(true);
    }
    this.trigger();
  };
}
