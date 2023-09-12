import { generateRandomString } from "../helpers/primitive.helper";

export const PrimaryNotificationModel = (severity, message) => {
  const uid = generateRandomString();

  return {
    uid: uid,
    severity: severity,
    message: message,
  };
};
