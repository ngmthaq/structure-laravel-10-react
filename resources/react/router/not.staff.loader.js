import { KEY_STAFF_ACCESS_TOKEN } from "../const/key.const";
import { staffRoutes } from "../const/path.const";

export const notStaffLoader = async ({ params, request }) => {
  const token = localStorage.getItem(KEY_STAFF_ACCESS_TOKEN);

  if (token) {
    location.replace(staffRoutes.tableManagement.path);
  }

  return null;
};
