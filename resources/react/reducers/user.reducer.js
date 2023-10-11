import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { camelizeKeys, decamelize, decamelizeKeys } from "humps";
import { AuthStaffApi } from "../api/auth.staff.api";
import { API_ENDPOINTS } from "../const/api.const";

const state = {
  name: "user",
  users: {},
};

export const userAsyncActions = {
  getAllUsers: createAsyncThunk("user/getAllUsers", async (payload, thunk) => {
    try {
      const api = new AuthStaffApi();

      const processedPayload = {
        ...payload,
        sortCol: payload.sortCol ? decamelize(payload.sortCol) : null,
      };

      const response = await api.get(API_ENDPOINTS.adminGetAllUsers, decamelizeKeys(processedPayload));

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
  adminBlockUser: createAsyncThunk("user/adminBlockUser", async (payload, thunk) => {
    try {
      const api = new AuthStaffApi();
      const response = await api.put(API_ENDPOINTS.adminBlockUser.replace(":userId", payload.userId));

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
  adminUnBlockUser: createAsyncThunk("user/adminUnBlockUser", async (payload, thunk) => {
    try {
      const api = new AuthStaffApi();
      const response = await api.put(API_ENDPOINTS.adminUnBlockUser.replace(":userId", payload.userId));

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
  adminCreateUser: createAsyncThunk("user/adminCreateUser", async (payload, thunk) => {
    try {
      const api = new AuthStaffApi();
      const response = await api.post(API_ENDPOINTS.adminCreateUser, decamelizeKeys(payload));

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
};

const slice = createSlice({
  name: state.name,
  initialState: state,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(userAsyncActions.getAllUsers.fulfilled, (state, action) => {
      state.users = action.payload;
    });
  },
});

export const userActions = slice.actions;

export const userReducer = slice.reducer;
