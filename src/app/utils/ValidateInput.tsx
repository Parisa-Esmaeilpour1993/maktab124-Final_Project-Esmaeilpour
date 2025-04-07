import { validateLocalization } from "../constants/localization/fa/localization";

export default function ValidateInput(
  username: string,
  email: string,
  password: string
) {
  const errors = {
    name: "",
    email: "",
    password: "",
  };

  const usernameRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{3,20}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,11}$/;

  if (!usernameRegex.test(username)) {
    errors.name = validateLocalization.usernameRegex;
  }

  if (!emailRegex.test(email)) {
    errors.email = validateLocalization.emailRegex;
  }

  if (!passwordRegex.test(password)) {
    errors.password = validateLocalization.passwordRegex;
  }

  const hasErrors = Object.values(errors).some((error) => error !== "");
  return hasErrors ? errors : null;
}
