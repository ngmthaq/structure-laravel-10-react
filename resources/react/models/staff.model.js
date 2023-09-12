import { ROLES } from "../const/app.const";

export const StaffModel = (id, name, email, phone, address, dateOfBirth, role) => {
  const isAdmin = role === ROLES.admin;

  return {
    id,
    name,
    email,
    phone,
    address,
    dateOfBirth,
    role,
    isAdmin,
  };
};
