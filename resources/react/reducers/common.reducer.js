import { createSlice } from "@reduxjs/toolkit";

const state = {
    name: "common",
    isPrimaryLoading: false,
    primaryNotifications: [],
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
            state.primaryNotifications.push(action.payload);
        },
    },
});

export const commonActions = slice.actions;

export const commonReducer = slice.reducer;
