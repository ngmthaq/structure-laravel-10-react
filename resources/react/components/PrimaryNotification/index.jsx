import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Alert, Box } from "@mui/material";
import { isJsonString } from "../../helpers/primitive.helper";

export const PRIMARY_NOTIFICATION_TIMEOUT = 10000;

export const PRIMARY_NOTIFICATION_CONTAINER_ID =
    "primary-notification-container-id";

export const PrimaryNotificationComponent = () => {
    const primaryNotification = useSelector(
        (state) => state.common.primaryNotification
    );

    const [notifications, setNotifications] = useState([]);

    const onClose = (uid) => {
        setNotifications((notifications) => {
            return notifications.map((notification) => {
                if (notification.uid === uid) {
                    notification.isOpen = false;
                }

                return notification;
            });
        });
    };

    useEffect(() => {
        if (primaryNotification) {
            if (isJsonString(primaryNotification)) {
                const notifications = JSON.parse(primaryNotification).map(
                    (notification) => ({ ...notification, isOpen: true })
                );

                setNotifications((state) => [...state, ...notifications]);

                notifications.forEach((notification) => {
                    setTimeout(() => {
                        onClose(notification.uid);
                    }, PRIMARY_NOTIFICATION_TIMEOUT);
                });
            } else {
                setNotifications((state) => [
                    ...state,
                    { ...primaryNotification, isOpen: true },
                ]);

                setTimeout(() => {
                    onClose(primaryNotification.uid);
                }, PRIMARY_NOTIFICATION_TIMEOUT);
            }
        }
    }, [primaryNotification]);

    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                right: 0,
                width: 400,
                maxWidth: "100vw",
                zIndex: 9999999999,
            }}
            id={PRIMARY_NOTIFICATION_CONTAINER_ID}
        >
            {notifications.map((notification) =>
                notification.isOpen ? (
                    <Alert
                        severity={notification.severity}
                        key={notification.uid}
                        sx={{
                            margin: "4px 8px",
                            whiteSpace: "pre-line",
                        }}
                        onClose={() => onClose(notification.uid)}
                    >
                        {notification.message}
                    </Alert>
                ) : (
                    <Fragment key={notification.uid}></Fragment>
                )
            )}
        </Box>
    );
};
