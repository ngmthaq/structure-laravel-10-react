import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { camelizeKeys } from "humps";
import {
    KEY_STAFF_ACCESS_TOKEN,
    KEY_USER_ACCESS_TOKEN,
} from "../const/key.const";
import { GenericApi } from "../api/generic.api";
import { API_ENDPOINTS } from "../const/api.const";
import { __ } from "../plugins/i18n.plugin";
import { adminRoutes } from "../const/path.const";

const staffAccessToken = localStorage.getItem(KEY_STAFF_ACCESS_TOKEN) || "";
const userAccessToken = localStorage.getItem(KEY_USER_ACCESS_TOKEN) || "";

const state = {
    name: "auth",
    staffAccessToken: staffAccessToken,
    userAccessToken: userAccessToken,
};

export const authAsyncActions = {
    staffLogin: createAsyncThunk("auth/staffLogin", async (payload, store) => {
        try {
            const api = new GenericApi();
            const response = await api.post(API_ENDPOINTS.staffLogin, payload);

            return store.fulfillWithValue(camelizeKeys(response.data));
        } catch (error) {
            console.error(error);

            return store.rejectWithValue(
                camelizeKeys({
                    status: error.response.status,
                    data: error.response.data,
                })
            );
        }
    }),
};

const slice = createSlice({
    name: state.name,
    initialState: state,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            authAsyncActions.staffLogin.fulfilled,
            (state, action) => {
                state.staffAccessToken = action.payload.token;
                localStorage.setItem(
                    KEY_STAFF_ACCESS_TOKEN,
                    action.payload.token
                );
                location.href = adminRoutes.dashboard.path;
            }
        );
    },
});

export const authActions = slice.actions;

export const authReducer = slice.reducer;
