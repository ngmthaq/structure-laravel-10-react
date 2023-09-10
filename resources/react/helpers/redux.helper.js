import { __ } from "../plugins/i18n.plugin";
import { PrimaryNotificationModel } from "../models/primary.notification.model";

export const handleRejectedExtraReducerFormNotification = (state, action) => {
    if (action.payload.status === 403) {
        state.primaryNotification = PrimaryNotificationModel(
            "error",
            __("custom.access-deny")
        );
    } else if (action.payload.status === 422) {
        const notifications = Object.values(action.payload.data.errors).map(
            (error) => PrimaryNotificationModel("error", error[0])
        );
        state.primaryNotification = JSON.stringify(notifications);
    } else if (action.payload.status === 401) {
        alert(__("custom.login-expired"));
        localStorage.clear();
        location.reload();
    } else {
        state.primaryNotification = PrimaryNotificationModel(
            "error",
            __("custom.something-wrong")
        );
    }
};
