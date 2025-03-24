const form = document.querySelector("form") as HTMLFormElement;

interface FormSchema {
  name: string;
  email: string;
  password: string;
}

initForm<FormSchema>({
  form,
  onError: displayErrors,
  onSubmit: (data) => {
    console.log({ data });
  },
  customErrors: {
    email: "Invalid Email Field",
  },
  defaultValues: {
    email: "kareemSouhsa@dev.com",
  },
});

// user should implement this funciton
function displayErrors(errors: Partial<Record<keyof FormSchema, string>>) {
  console.log({errors})
  Object.entries(errors).forEach(([key, message]) => {
    let input = document.querySelector(`input[name="${key}"]`);
    if (input) {
      let errorElement = input.nextElementSibling as HTMLSpanElement;
      if (!errorElement || !errorElement.classList.contains("error-message")) {
        errorElement = document.createElement("span");
        errorElement.classList.add("error-message");
        input.after(errorElement);
      }
      errorElement.textContent = message;
    }
  });
}

// simple library to manage forms
function initForm<T>({
  form,
  onError,
  defaultValues,
  onSubmit,
  customErrors,
}: {
  form: HTMLFormElement;
  defaultValues?: Partial<Record<keyof T, string>>;
  onSubmit: (data: T) => void;
  onError: (errData: Partial<Record<keyof T, string>>) => void;
  customErrors?: Partial<Record<keyof T, string>>;
}) {
   const formInputs = form.querySelectorAll(
    "input",
  ) as NodeListOf<HTMLInputElement>;
  if (defaultValues) {
    setDefaultValues({ defaultValues, formInputs });
  }
  form.noValidate = true;
  form.addEventListener("submit", (e) => {
  const formInputs = form.querySelectorAll(
    "input",
  ) as NodeListOf<HTMLInputElement>;
    e.preventDefault();
    const [isValid, errData] = validateForm<T>({
      form,
      formInputs,
      customErrors,
    });

    if (isValid) {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData) as T;
      onSubmit(data);
    } else {
      onError(errData);
    }
  });
}

function validateForm<T>({
  form,
  formInputs,
  customErrors,
}: {
  form: HTMLFormElement;
  formInputs: NodeListOf<HTMLInputElement>;
  customErrors?: Partial<Record<keyof T, string>>;
}): [boolean, Partial<Record<keyof T, string>>] {
  const errData: Partial<Record<keyof T, string>> = {};
  if (!form.checkValidity()) {
    for (const input of formInputs) {
      if (!input.validity.valid) {
        const errMessage =
          customErrors && customErrors[input.name]
            ? customErrors[input.name]
            : input.validationMessage;
        errData[input.name] = errMessage;
        input.setCustomValidity(errMessage);
      }
    }
    return [false, errData];
  }
  return [true, errData];
}

function setDefaultValues<T>({
  defaultValues,
  formInputs,
}: {
  defaultValues: T;
  formInputs: NodeListOf<HTMLInputElement>;
}) {
  for (const input of formInputs) {
    if (defaultValues[input.name]) {
      input.value = defaultValues[input.name];
    }
  }
}
