import { createSlice } from "@reduxjs/toolkit";
import { authAsyncActions } from "./auth.reducer";
import { __ } from "../plugins/i18n.plugin";
import { handleRejectedExtraReducerFormNotification } from "../helpers/redux.helper";

const state = {
    name: "common",
    isOpenLinearLoading: false,
    primaryNotification: null,
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
        builder.addCase(
            authAsyncActions.staffLogin.rejected,
            (state, action) => {
                handleRejectedExtraReducerFormNotification(state, action);
                state.isOpenLinearLoading = false;
            }
        );
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
        builder.addCase(
            authAsyncActions.staffUpdateInfo.rejected,
            (state, action) => {
                handleRejectedExtraReducerFormNotification(state, action);
                state.isOpenLinearLoading = false;
            }
        );
        builder.addCase(
            authAsyncActions.staffChangePassword.pending,
            (state) => {
                state.isOpenLinearLoading = true;
            }
        );
        builder.addCase(
            authAsyncActions.staffChangePassword.fulfilled,
            (state) => {
                state.isOpenLinearLoading = false;
            }
        );
        builder.addCase(
            authAsyncActions.staffChangePassword.rejected,
            (state, action) => {
                handleRejectedExtraReducerFormNotification(state, action);
                state.isOpenLinearLoading = false;
            }
        );
    },
});

export const commonActions = slice.actions;

export const commonReducer = slice.reducer;
