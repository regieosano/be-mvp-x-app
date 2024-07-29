import { User } from "@src/types";
import mO from "@src/messages/constants/others";
import { encryptPassword } from "@src/utilities/password";
import { generateOTPAndExpiry } from "@src/utilities/otp";
import { findAUserAndUpdateFields } from "@src/utilities/user";

export const createNewUserObject: Function = async (
  candidateUser: User,
): Promise<User> => {
  try {
    // OTP Generation and Expiry
    const { generatedOTP, expiry } = generateOTPAndExpiry();

    // Password encryption
    let encryptedPassword;
    try {
      const { password } = candidateUser;
      encryptedPassword = await encryptPassword(password);
    } catch (error: unknown) {
      throw `${error}`;
    }

    // Store new values for new user
    const qualifiedNewUser = {
      ...candidateUser,
      password: encryptedPassword,
      otp: generatedOTP,
      expiresAt: expiry,
    };

    return await qualifiedNewUser;
  } catch (error: unknown) {
    throw `${error}`;
  }
};

export const setResendCodeToTrue: Function = async (_id: string) => {
  try {
    return await findAUserAndUpdateFields(_id, { isResendCode: mO.yes });
  } catch (error: unknown) {
    throw `${error}`;
  }
};