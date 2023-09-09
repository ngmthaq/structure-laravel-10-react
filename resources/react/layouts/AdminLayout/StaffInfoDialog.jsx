import React, { Fragment, useContext, useState } from "react";
import { useLoaderData } from "react-router-dom";
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    capitalize,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { AdminLayoutContext } from ".";
import { __ } from "../../plugins/i18n.plugin";
import { convertHex2Rgba } from "../../helpers/primitive.helper";
import { theme } from "../../plugins/material.plugin";
import { isObjDeepEqual } from "../../helpers/reference.helper";

export const StaffInfoDialog = () => {
    const { isOpenStaffInfoDialog, setIsOpenStaffInfoDialog } =
        useContext(AdminLayoutContext);

    const { staff } = useLoaderData();

    const [isEditMode, setIsEditMode] = useState(false);

    const [info, setInfo] = useState(Object.assign({}, staff));

    const onClose = () => {
        setIsOpenStaffInfoDialog(false);
    };

    const onOpenEditMode = () => {
        setIsEditMode(true);
    };

    const onExitEditMode = () => {
        if (isObjDeepEqual(staff, info)) {
            setIsEditMode(false);
        } else if (confirm(__("custom.confirm-lost-changed"))) {
            setIsEditMode(false);
            setInfo((state) => ({ ...state, ...staff }));
        }
    };

    const onTextFieldChange = (e) => {
        const key = e.target.id;
        const value = e.target.value;
        setInfo((state) => ({ ...state, [key]: value }));
    };

    const onSubmit = (e) => {
        if (isEditMode) {
            e.preventDefault();
            console.log(info);
        }
    };

    return (
        <Dialog
            open={isOpenStaffInfoDialog}
            onClose={onClose}
            fullWidth={true}
            maxWidth="sm"
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <DialogTitle>
                    {capitalize(__("custom.hello"))} {staff.name}
                </DialogTitle>
                <IconButton onClick={onClose}>
                    <Close />
                </IconButton>
            </Box>
            <DialogContent>
                <Box component="form" onSubmit={onSubmit}>
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Box
                            className={isEditMode ? "" : "active"}
                            onClick={onExitEditMode}
                            sx={{
                                flex: 1,
                                textAlign: "center",
                                cursor: "pointer",
                                padding: "16px",
                                borderRadius: "4px 0 0 0",
                                background: convertHex2Rgba(
                                    theme.palette.primary.main,
                                    0.1
                                ),
                                transition: "all 0.1s linear",
                                borderBottom:
                                    "1px solid " + theme.palette.grey[500],
                                "&:hover": {
                                    background: convertHex2Rgba(
                                        theme.palette.primary.main,
                                        0.05
                                    ),
                                },
                                "&.active": {
                                    background: "white",
                                    border:
                                        "1px solid " + theme.palette.grey[500],
                                    borderBottom: "none",
                                    fontWeight: 600,
                                    cursor: "default",
                                },
                            }}
                        >
                            {__("custom.your-info")}
                        </Box>
                        <Box
                            className={isEditMode ? "active" : ""}
                            onClick={onOpenEditMode}
                            sx={{
                                flex: 1,
                                textAlign: "center",
                                cursor: "pointer",
                                padding: "16px",
                                borderRadius: "0 4px 0 0",
                                background: convertHex2Rgba(
                                    theme.palette.primary.main,
                                    0.1
                                ),
                                transition: "all 0.1s linear",
                                borderBottom:
                                    "1px solid " + theme.palette.grey[500],
                                "&:hover": {
                                    background: convertHex2Rgba(
                                        theme.palette.primary.main,
                                        0.05
                                    ),
                                },
                                "&.active": {
                                    background: "white",
                                    border:
                                        "1px solid " + theme.palette.grey[500],
                                    borderBottom: "none",
                                    fontWeight: 600,
                                    cursor: "default",
                                },
                            }}
                        >
                            {__("custom.edit-your-info")}
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            maxHeight: 560,
                            height: "100%",
                            width: "100%",
                            border: "1px solid " + theme.palette.grey[500],
                            borderTop: "none",
                            overflowY: "scroll",
                            borderRadius: "0 0 4px 4px",
                            padding: "24px 16px",
                        }}
                        className="hide-scrollbar"
                    >
                        <TextField
                            fullWidth
                            disabled={!isEditMode}
                            label={__("custom.name")}
                            value={info.name}
                            id="name"
                            onChange={onTextFieldChange}
                            sx={{
                                marginBottom: "16px",
                                textTransform: "capitalize",
                            }}
                        />
                        <TextField
                            fullWidth
                            disabled
                            label={__("custom.email")}
                            value={info.email}
                            id="email"
                            sx={{
                                marginBottom: "16px",
                                textTransform: "capitalize",
                            }}
                        />
                        <TextField
                            fullWidth
                            disabled={!isEditMode}
                            type="tel"
                            label={__("custom.phone-number")}
                            value={info.phone}
                            id="phone"
                            onChange={onTextFieldChange}
                            sx={{
                                marginBottom: "16px",
                                textTransform: "capitalize",
                            }}
                        />
                        <TextField
                            fullWidth
                            disabled={!isEditMode}
                            label={__("custom.date-of-birth")}
                            value={info.dateOfBirth}
                            id="dateOfBirth"
                            onChange={onTextFieldChange}
                            sx={{
                                marginBottom: "16px",
                                textTransform: "capitalize",
                            }}
                            type="date"
                        />
                        <TextField
                            fullWidth
                            disabled={!isEditMode}
                            label={__("custom.address")}
                            value={info.address}
                            id="address"
                            onChange={onTextFieldChange}
                            sx={{
                                marginBottom: "16px",
                                textTransform: "capitalize",
                            }}
                        />
                        {isEditMode ? (
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                type="submit"
                                sx={{ margin: "8px 0 0" }}
                            >
                                {__("custom.update").toUpperCase()}
                            </Button>
                        ) : (
                            <Fragment />
                        )}
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};
