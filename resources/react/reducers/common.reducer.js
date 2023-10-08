import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authAsyncActions } from "./auth.reducer";
import { __ } from "../plugins/i18n.plugin";
import { handleRejectedExtraReducerFormNotification } from "../helpers/redux.helper";
import { userAsyncActions } from "./user.reducer";
import { AuthStaffApi } from "../api/auth.staff.api";
import { API_ENDPOINTS } from "../const/api.const";
import { camelizeKeys, decamelizeKeys } from "humps";

const state = {
  name: "common",
  isOpenLinearLoading: false,
  primaryNotification: null,
};

export const commonAsyncActions = {
  getConfigurations: createAsyncThunk("common/getConfigurations", async (payload, thunk) => {
    try {
      const api = new AuthStaffApi();
      const response = await api.get(API_ENDPOINTS.adminGetConfigurations);

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
  setConfigurations: createAsyncThunk("common/setConfigurations", async (payload, thunk) => {
    try {
      const api = new AuthStaffApi();
      const response = await api.post(API_ENDPOINTS.adminSetConfigurations, payload);

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
  reducers: {
    openLinearLoading: (state) => {
      state.isOpenLinearLoading = true;
    },
    closeLinearLoading: (state) => {
      state.isOpenLinearLoading = false;
    },
    appendPrimaryNotification: (state, action) => {
      state.primaryNotification = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(authAsyncActions.staffLogin.pending, (state) => {
      state.isOpenLinearLoading = true;
    });
    builder.addCase(authAsyncActions.staffLogin.fulfilled, (state) => {
      state.isOpenLinearLoading = false;
    });
    builder.addCase(authAsyncActions.staffLogin.rejected, (state, action) => {
      handleRejectedExtraReducerFormNotification(state, action);
      state.isOpenLinearLoading = false;
    });
    builder.addCase(authAsyncActions.staffLogout.pending, (state) => {
      state.isOpenLinearLoading = true;
    });
    builder.addCase(authAsyncActions.staffLogout.fulfilled, (state) => {
      state.isOpenLinearLoading = false;
    });
    builder.addCase(authAsyncActions.staffUpdateInfo.pending, (state) => {
      state.isOpenLinearLoading = true;
    });
    builder.addCase(authAsyncActions.staffUpdateInfo.fulfilled, (state) => {
      state.isOpenLinearLoading = false;
    });
    builder.addCase(authAsyncActions.staffUpdateInfo.rejected, (state, action) => {
      handleRejectedExtraReducerFormNotification(state, action);
      state.isOpenLinearLoading = false;
    });
    builder.addCase(authAsyncActions.staffChangePassword.pending, (state) => {
      state.isOpenLinearLoading = true;
    });
    builder.addCase(authAsyncActions.staffChangePassword.fulfilled, (state) => {
      state.isOpenLinearLoading = false;
    });
    builder.addCase(authAsyncActions.staffChangePassword.rejected, (state, action) => {
      handleRejectedExtraReducerFormNotification(state, action);
      state.isOpenLinearLoading = false;
    });
    builder.addCase(userAsyncActions.getAllUsers.pending, (state) => {
      state.isOpenLinearLoading = true;
    });
    builder.addCase(userAsyncActions.getAllUsers.fulfilled, (state) => {
      state.isOpenLinearLoading = false;
    });
    builder.addCase(userAsyncActions.getAllUsers.rejected, (state, action) => {
      handleRejectedExtraReducerFormNotification(state, action);
      state.isOpenLinearLoading = false;
    });
  },
});

export const commonActions = slice.actions;

export const commonReducer = slice.reducer;
