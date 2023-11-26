import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { camelizeKeys, decamelizeKeys } from "humps";
import { AuthStaffApi } from "../api/auth.staff.api";
import { API_ENDPOINTS } from "../const/api.const";
import { GenericApi } from "../api/generic.api";

const state = {
  name: "bill",
};

export const billAsyncActions = {
  staffOrder: createAsyncThunk("bill/staffOrder", async (payload, thunk) => {
    try {
      const api = new AuthStaffApi();
      const response = await api.post(API_ENDPOINTS.staffOrder, decamelizeKeys(payload));

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

  userOrder: createAsyncThunk("bill/userOrder", async (payload, thunk) => {
    try {
      const api = new GenericApi();
      const response = await api.post(API_ENDPOINTS.userReservation, decamelizeKeys(payload));

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

  getAllBills: createAsyncThunk("bill/getAllBills", async (payload, thunk) => {
    try {
      const api = new AuthStaffApi();
      const response = await api.get(API_ENDPOINTS.getAllBills, decamelizeKeys(payload));

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

  changeStatus: createAsyncThunk("bill/changeStatus", async (payload, thunk) => {
    try {
      const api = new AuthStaffApi();
      const response = await api.put(
        API_ENDPOINTS.changeBillStatus.replace(":billId", payload.id),
        decamelizeKeys({ ...payload, _method: "PUT" }),
      );

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
  extraReducers: (builder) => {},
});

export const billActions = slice.actions;

export const billReducer = slice.reducer;
