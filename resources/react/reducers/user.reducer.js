import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { camelizeKeys, decamelize, decamelizeKeys } from "humps";
import { DateTime } from "luxon";
import { AuthStaffApi } from "../api/auth.staff.api";
import { API_ENDPOINTS } from "../const/api.const";
import { convertDateTime } from "../helpers/datetime.helper";

const state = {
    name: "user",
    users: {},
};

export const userAsyncActions = {
    getAllUsers: createAsyncThunk(
        "user/getAllUsers",
        async (payload, thunk) => {
            try {
                const api = new AuthStaffApi();

                const processedPayload = {
                    ...payload,
                    sortCol: payload.sortCol
                        ? decamelize(payload.sortCol)
                        : null,
                };

                const response = await api.get(
                    API_ENDPOINTS.adminGetAllUsers,
                    decamelizeKeys(processedPayload)
                );

                return thunk.fulfillWithValue(camelizeKeys(response.data));
            } catch (error) {
                console.error(error);

                return thunk.rejectWithValue(
                    camelizeKeys({
                        status: error.response.status,
                        data: error.response.data,
                    })
                );
            }
        }
    ),
};

const slice = createSlice({
    name: state.name,
    initialState: state,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            userAsyncActions.getAllUsers.fulfilled,
            (state, action) => {
                state.users = action.payload;
            }
        );
    },
});

export const userActions = slice.actions;

export const userReducer = slice.reducer;
