import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { camelizeKeys, decamelize, decamelizeKeys } from "humps";
import { AuthStaffApi } from "../api/auth.staff.api";
import { API_ENDPOINTS } from "../const/api.const";

const state = {
  name: "bill",
};

export const billAsyncActions = {
  staffOrder: createAsyncThunk("bill/staffOrder", async (payload, thunk) => {
    try {
      const api = new AuthStaffApi();
      const response = await api.post(API_ENDPOINTS.staffOrder, decamelizeKeys(payload));

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
  extraReducers: (builder) => {},
});

export const billActions = slice.actions;

export const billReducer = slice.reducer;
