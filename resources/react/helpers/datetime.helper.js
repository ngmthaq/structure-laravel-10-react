import { DateTime } from "luxon";

export const convertDateTime = (datetime, format) => {
  return DateTime.fromISO(datetime).toFormat(format);
};
