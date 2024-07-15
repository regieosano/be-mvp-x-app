import express from "express";
import composeRouter from "@src/routes/_router_declaration";
import {
  OK,
  INTERNAL_SERVER_ERROR_CODE,
  INTERNAL_SERVER_MESSAGE,
  USER_DOES_NOT_EXIST,
} from "@src/values/constants";
import { findAUser } from "@src/utilities/user";
import { authenticateUser } from "@src/services/controllers/authentication";
import { otpDataValidation } from "@src/validations/otpdata_validations";
import { checkJSONBodyData } from "@src/utilities/misc";

export function getAuthenticationRouters(expressRouter: express.Router) {
  const authenticationRouters = composeRouter(expressRouter)();

  authenticationRouters.post(
    "/users/otp-verify",
    async (req: express.Request, res: express.Response) => {
      try {
        let userOTPData;
        try {
          userOTPData = { ...checkJSONBodyData(req.body) };
        } catch (error: unknown) {
          throw `${error}`;
        }

        const callOTPDataValidate = otpDataValidation(userOTPData);
        const isResultError = await callOTPDataValidate();

        if (isResultError) {
          const message = isResultError.error;
          throw new Error(message);
        }

        try {
          const { id, otp } = userOTPData;

          const userToBeVerified = await findAUser(id);

          if (!userToBeVerified) {
            throw USER_DOES_NOT_EXIST;
          }

          const result = await authenticateUser(userToBeVerified, otp);

          res.status(OK).send(result);
        } catch (error: unknown) {
          throw `${error}`;
        }
      } catch (error: any) {
        res
          .status(INTERNAL_SERVER_ERROR_CODE)
          .send(`${INTERNAL_SERVER_MESSAGE} ${error}`);
      }
    },
  );

  return function () {
    return authenticationRouters;
  };
}