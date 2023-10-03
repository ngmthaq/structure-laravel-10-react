import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { camelizeKeys, decamelize, decamelizeKeys } from "humps";
import { AuthStaffApi } from "../api/auth.staff.api";
import { API_ENDPOINTS } from "../const/api.const";

const state = {
  name: "staff",
  staffs: {},
};

export const staffAsyncActions = {
  getAllStaffs: createAsyncThunk("staff/getAllStaffs", async (payload, thunk) => {
    try {
      const api = new AuthStaffApi();

      const processedPayload = {
        ...payload,
        sortCol: payload.sortCol ? decamelize(payload.sortCol) : null,
      };

      const response = await api.get(API_ENDPOINTS.adminGetAllStaffs, decamelizeKeys(processedPayload));

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
  adminBlockStaff: createAsyncThunk("staff/adminBlockStaff", async (payload, thunk) => {
    try {
      const api = new AuthStaffApi();
      const response = await api.put(API_ENDPOINTS.adminBlockStaff.replace(":staffId", payload.staffId));

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
  adminUnBlockStaff: createAsyncThunk("staff/adminUnBlockStaff", async (payload, thunk) => {
    try {
      const api = new AuthStaffApi();
      const response = await api.put(API_ENDPOINTS.adminUnBlockStaff.replace(":staffId", payload.staffId));

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
  adminUpdateStaff: createAsyncThunk("staff/adminUpdateStaff", async (payload, thunk) => {
    try {
      const api = new AuthStaffApi();
      const processedPayload = decamelizeKeys({ ...payload, _method: "PUT" });
      const response = await api.post(
        API_ENDPOINTS.adminUpdateStaffInfo.replace(":staffId", payload.id),
        processedPayload,
      );

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
    builder.addCase(staffAsyncActions.getAllStaffs.fulfilled, (state, action) => {
      state.staffs = action.payload;
    });
  },
});

export const staffActions = slice.actions;

export const staffReducer = slice.reducer;
