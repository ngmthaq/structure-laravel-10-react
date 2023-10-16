import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { camelizeKeys, decamelize, decamelizeKeys } from "humps";
import { AuthStaffApi } from "../api/auth.staff.api";
import { API_ENDPOINTS } from "../const/api.const";

const state = {
  name: "bill",
};

export const billAsyncActions = {};

const slice = createSlice({
  name: state.name,
  initialState: state,
  reducers: {},
  extraReducers: (builder) => {},
});

export const billActions = slice.actions;

export const billReducer = slice.reducer;
