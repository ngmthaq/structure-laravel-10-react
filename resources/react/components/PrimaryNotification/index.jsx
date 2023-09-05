import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Alert, Box } from "@mui/material";

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
            setNotifications((state) => [
                ...state,
                { ...primaryNotification, isOpen: true },
            ]);

            setTimeout(() => {
                onClose(primaryNotification.uid);
            }, 6000);
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
            }}
        >
            {notifications.map((notification) =>
                notification.isOpen ? (
                    <Alert
                        severity={notification.severity}
                        key={notification.uid}
                        sx={{
                            margin: "4px 8px",
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
