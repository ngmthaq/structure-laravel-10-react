import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { camelizeKeys, decamelizeKeys } from "humps";
import { KEY_STAFF_ACCESS_TOKEN, KEY_USER_ACCESS_TOKEN } from "../const/key.const";
import { GenericApi } from "../api/generic.api";
import { API_ENDPOINTS } from "../const/api.const";
import { __ } from "../plugins/i18n.plugin";
import { authRoutes, staffRoutes } from "../const/path.const";
import { AuthStaffApi } from "../api/auth.staff.api";

const staffAccessToken = localStorage.getItem(KEY_STAFF_ACCESS_TOKEN) || "";
const userAccessToken = localStorage.getItem(KEY_USER_ACCESS_TOKEN) || "";

const state = {
  name: "auth",
  staffAccessToken: staffAccessToken,
  userAccessToken: userAccessToken,
};

export const authAsyncActions = {
  staffLogin: createAsyncThunk("auth/staffLogin", async (payload, thunk) => {
    try {
      const api = new GenericApi();
      const response = await api.post(API_ENDPOINTS.staffLogin, decamelizeKeys(payload));

      return thunk.fulfillWithValue(camelizeKeys(response.data));
    } catch (error) {
      console.error(error);

      return thunk.rejectWithValue(
        camelizeKeys({
          status: error.response.status,
          data: error.response.data,
        }),
      );
    }
  }),

  staffLogout: createAsyncThunk("auth/staffLogout", async (payload, thunk) => {
    try {
      const api = new AuthStaffApi();
      await api.post(API_ENDPOINTS.staffLogout);

      return thunk.fulfillWithValue(true);
    } catch (error) {
      return thunk.fulfillWithValue(true);
    }
  }),

  staffUpdateInfo: createAsyncThunk("auth/staffUpdateInfo", async (payload, thunk) => {
    try {
      const api = new AuthStaffApi();
      const response = await api.put(API_ENDPOINTS.updateStaffInfo, decamelizeKeys(payload));

      return thunk.fulfillWithValue(camelizeKeys(response.data));
    } catch (error) {
      console.error(error);

      return thunk.rejectWithValue(
        camelizeKeys({
          status: error.response.status,
          data: error.response.data,
        }),
      );
    }
  }),

  staffChangePassword: createAsyncThunk("auth/staffChangePassword", async (payload, thunk) => {
    try {
      const api = new AuthStaffApi();
      const response = await api.put(API_ENDPOINTS.staffChangePassword, decamelizeKeys(payload));

      return thunk.fulfillWithValue(response.data);
    } catch (error) {
      console.error(error);

      return thunk.rejectWithValue(
        camelizeKeys({
          status: error.response.status,
          data: error.response.data,
        }),
      );
    }
  }),

  dashboard: createAsyncThunk("auth/dashboard", async (payload, thunk) => {
    try {
      const api = new AuthStaffApi();
      const response = await api.get(API_ENDPOINTS.dashboard, decamelizeKeys(payload));

      return thunk.fulfillWithValue(camelizeKeys(response.data));
    } catch (error) {
      console.error(error);

      return thunk.rejectWithValue(
        camelizeKeys({
          status: error.response.status,
          data: error.response.data,
        }),
      );
    }
  }),
};

const slice = createSlice({
  name: state.name,
  initialState: state,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(authAsyncActions.staffLogin.fulfilled, (state, action) => {
      state.staffAccessToken = action.payload.token;
      localStorage.setItem(KEY_STAFF_ACCESS_TOKEN, action.payload.token);
      location.href = staffRoutes.tableManagement.path;
    });
    builder.addCase(authAsyncActions.staffLogout.fulfilled, () => {
      localStorage.clear();
      location.href = authRoutes.staffLogin.path;
    });
    builder.addCase(authAsyncActions.staffUpdateInfo.fulfilled, () => {
      alert(__("custom.update-profile-success"));
      location.reload();
    });
    builder.addCase(authAsyncActions.staffChangePassword.fulfilled, () => {
      alert(__("custom.update-password-success"));
      location.reload();
    });
  },
});

export const authActions = slice.actions;

export const authReducer = slice.reducer;
