import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { camelizeKeys, decamelize, decamelizeKeys } from "humps";
import { AuthStaffApi } from "../api/auth.staff.api";
import { API_ENDPOINTS } from "../const/api.const";

const state = {
  name: "table",
  tables: {},
};

export const tableAsyncActions = {
  createTable: createAsyncThunk("table/createTable", async (payload, thunk) => {
    try {
      const api = new AuthStaffApi();
      const response = await api.post(API_ENDPOINTS.adminCreateTable, payload);

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

  getTables: createAsyncThunk("table/getTables", async (payload, thunk) => {
    try {
      const api = new AuthStaffApi();
      const response = await api.get(API_ENDPOINTS.adminGetTables);

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

  changePosition: createAsyncThunk("table/changePosition", async (payload, thunk) => {
    try {
      const api = new AuthStaffApi();
      const response = await api.put(
        API_ENDPOINTS.adminChangeTablePosition.replace(":tableId", payload.id),
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

  adminDeleteTable: createAsyncThunk("table/adminDeleteTable", async (payload, thunk) => {
    try {
      const api = new AuthStaffApi();
      const response = await api.delete(
        API_ENDPOINTS.adminDeleteTable.replace(":tableId", payload.id),
        decamelizeKeys({ ...payload, _method: "DELETE" }),
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

  adminRestoreTable: createAsyncThunk("table/adminRestoreTable", async (payload, thunk) => {
    try {
      const api = new AuthStaffApi();
      const response = await api.put(
        API_ENDPOINTS.adminRestoreTable.replace(":tableId", payload.id),
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

  staffGetAvailableTables: createAsyncThunk("table/staffGetAvailableTables", async (payload, thunk) => {
    try {
      const api = new AuthStaffApi();
      const response = await api.get(
        API_ENDPOINTS.staffGetAvailableTables.replace(":tableId", payload.id),
        decamelizeKeys({ ...payload }),
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

export const tableActions = slice.actions;

export const tableReducer = slice.reducer;
