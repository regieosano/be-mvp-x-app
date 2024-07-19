import Joi from "joi";
import { User } from "@src/types";

export const userValidation = function (userBodyData: User) {
  const userBodyDataForChecking = { ...userBodyData };

  function validateUserBodyData() {
    return Joi.object({
      name: Joi.string().min(2).max(255).required(),
      address: Joi.string().min(2).max(255).optional(),
      dob: Joi.date().optional(),
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),
      cellNumber: Joi.string().min(0).max(25).optional(),
      gender: Joi.string().min(0).max(25).optional(),
      password: Joi.string().min(8).max(25).optional(),
    });
  }

  return async function () {
    const { name, address, dob, email, cellNumber, gender, password } =
      userBodyDataForChecking;

    try {
      const result = await validateUserBodyData().validateAsync({
        name,
        address,
        dob,
        email,
        cellNumber,
        gender,
        password,
      });

      return result;
    } catch (error: unknown) {
      throw `${error}`;
    }
  };
};
