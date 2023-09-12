import { KEY_STAFF_ACCESS_TOKEN } from "../const/key.const";
import { AxiosPlugin } from "../plugins/axios.plugin";

export class AuthStaffApi extends AxiosPlugin {
  onRequestSuccess(config) {
    const token = localStorage.getItem(KEY_STAFF_ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }

    return config;
  }
}
