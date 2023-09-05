import React from "react";
import { useDispatch } from "react-redux";
import { commonActions } from "../../../reducers/common.reducer";
import { PrimaryNotificationModel } from "../../../models/primary-notification.model";
import { generateRandomString } from "../../../helpers/primitive.helper";
import { __ } from "../../../plugins/i18n.plugin";

export const PageStaffLogin = () => {
    const dispatch = useDispatch();

    const openNotification = () => {
        dispatch(
            commonActions.appendPrimaryNotification(
                PrimaryNotificationModel(
                    generateRandomString(),
                    "error",
                    generateRandomString()
                )
            )
        );
    };

    return (
        <div>
            <button onClick={openNotification}>{__("custom.hello")}</button>
        </div>
    );
};
