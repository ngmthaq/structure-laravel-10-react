import { createBrowserRouter } from "react-router-dom";
import { adminRoutes, authRoutes, staffRoutes, userRoutes } from "../const/path.const";

export const router = createBrowserRouter([
  ...Object.values(userRoutes),
  ...Object.values(staffRoutes),
  ...Object.values(adminRoutes),
  ...Object.values(authRoutes),
]);
