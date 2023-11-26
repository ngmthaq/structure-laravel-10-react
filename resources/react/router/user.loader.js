import { camelizeKeys } from "humps";
import { API_ENDPOINTS } from "../const/api.const";
import { authRoutes } from "../const/path.const";
import { StaffModel } from "../models/staff.model";
import { closeLinearLoading, openLinearLoading } from "../helpers/element.helper";
import { GenericApi } from "../api/generic.api";

export const userLoader = async ({ params, request }) => {
  openLinearLoading();
  const api = new GenericApi();
  const confResponse = await api.get(API_ENDPOINTS.adminGetConfigurations);
  const conf = camelizeKeys(confResponse.data);
  closeLinearLoading();

  return {
    conf: conf,
  };
};
