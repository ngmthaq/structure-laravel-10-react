import { createSlice } from "@reduxjs/toolkit";
import { authAsyncActions } from "./auth.reducer";
import { PrimaryNotificationModel } from "../models/primary.notification.model";
import { __ } from "../plugins/i18n.plugin";

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
                if (action.payload.status === 401) {
                    state.primaryNotification = PrimaryNotificationModel(
                        "error",
                        __("custom.wrong-email-password")
                    );
                } else if (action.payload.status === 422) {
                    const notifications = Object.values(
                        action.payload.data.errors
                    ).map((error) =>
                        PrimaryNotificationModel("error", error[0])
                    );

                    state.primaryNotification = JSON.stringify(notifications);
                } else {
                    state.primaryNotification = PrimaryNotificationModel(
                        "error",
                        __("custom.something-wrong")
                    );
                }

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
                if (action.payload.status === 403) {
                    state.primaryNotification = PrimaryNotificationModel(
                        "error",
                        __("custom.access-deny")
                    );
                } else if (action.payload.status === 422) {
                    const notifications = Object.values(
                        action.payload.data.errors
                    ).map((error) =>
                        PrimaryNotificationModel("error", error[0])
                    );

                    state.primaryNotification = JSON.stringify(notifications);
                } else {
                    state.primaryNotification = PrimaryNotificationModel(
                        "error",
                        __("custom.something-wrong")
                    );
                }

                state.isOpenLinearLoading = false;
            }
        );
    },
});

export const commonActions = slice.actions;

export const commonReducer = slice.reducer;
