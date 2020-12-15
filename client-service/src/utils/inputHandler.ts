export interface Requirements {
  required?: boolean;
  minlength?: number;
  maxlength?: number;
  isEmail?: boolean;
}

const checkValidity = (
  value: string,
  requirements: Requirements | undefined
): Boolean => {
  let valid = true;
  if (!requirements) return true;

  if (requirements.required) {
    valid = valid && value !== "";
  }
  if (requirements.minlength) {
    valid = valid && value.length >= requirements.minlength;
  }

  if (requirements.maxlength) {
    valid = valid && value.length <= requirements.maxlength;
  }
  if (requirements.isEmail) {
    valid = valid && !!value.match(/\S+@\S+\.\S+/);
  }
  return valid;
};

export const inputChangedHandler = (
  e: React.ChangeEvent<HTMLInputElement>,
  inputIdentifier: string,
  setState: Function
) => {
  const inputValue: string = e.target.value;

  setState((prevState: any) => {
    return {
      ...prevState,
      [inputIdentifier]: {
        ...prevState[inputIdentifier],
        touched: true,
        value: inputValue,
        valid: checkValidity(
          inputValue,
          prevState[inputIdentifier].requirements
        ),
      },
    };
  });
};
