import { createSlice } from "@reduxjs/toolkit";
import { authAsyncActions } from "./auth.reducer";
import { PrimaryNotificationModel } from "../models/primary.notification.model";
import { __ } from "../plugins/i18n.plugin";

const state = {
    name: "common",
    isPrimaryLoading: false,
    primaryNotification: null,
};

const slice = createSlice({
    name: state.name,
    initialState: state,
    reducers: {
        openPrimaryLoading: (state) => {
            state.isPrimaryLoading = true;
        },
        closePrimaryLoading: (state) => {
            state.isPrimaryLoading = false;
        },
        appendPrimaryNotification: (state, action) => {
            state.primaryNotification = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(authAsyncActions.staffLogin.pending, (state) => {
            state.isPrimaryLoading = true;
        });
        builder.addCase(authAsyncActions.staffLogin.fulfilled, (state) => {
            state.isPrimaryLoading = false;
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
                }

                state.isPrimaryLoading = false;
            }
        );
    },
});

export const commonActions = slice.actions;

export const commonReducer = slice.reducer;
