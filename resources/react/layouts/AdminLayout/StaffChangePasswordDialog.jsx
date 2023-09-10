import React, { useContext, useState } from "react";
import { useDispatch } from "react-redux";
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
import { authAsyncActions } from "../../reducers/auth.reducer";
import { isObjDeepEqual } from "../../helpers/reference.helper";

export const StaffChangePasswordDialog = () => {
    const initialPayload = {
        password: "",
        newPassword: "",
        passwordConfirmation: "",
    };

    const dispatch = useDispatch();

    const { isOpenChangePasswordDialog, setIsOpenChangePasswordDialog } =
        useContext(AdminLayoutContext);

    const [payload, setPayload] = useState(Object.assign({}, initialPayload));

    const onChangeInput = (e) => {
        const key = e.target.id;
        const value = e.target.value;
        setPayload((state) => ({ ...state, [key]: value }));
    };

    const onClose = () => {
        if (isObjDeepEqual(payload, initialPayload)) {
            setIsOpenChangePasswordDialog(false);
            setPayload(initialPayload);
        } else {
            if (confirm(__("custom.confirm-lost-changed"))) {
                setIsOpenChangePasswordDialog(false);
                setPayload(initialPayload);
            }
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(authAsyncActions.staffChangePassword(payload));
    };

    return (
        <Dialog
            open={isOpenChangePasswordDialog}
            onClose={onClose}
            fullWidth
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
                    {capitalize(__("custom.change-password-title"))}
                </DialogTitle>
                <IconButton onClick={onClose} sx={{ marginRight: "8px" }}>
                    <Close />
                </IconButton>
            </Box>
            <DialogContent>
                <Box component="form" onSubmit={onSubmit}>
                    <TextField
                        fullWidth
                        type="password"
                        onChange={onChangeInput}
                        label={__("custom.password")}
                        id="password"
                        sx={{
                            marginBottom: "16px",
                            textTransform: "capitalize",
                        }}
                    />
                    <TextField
                        fullWidth
                        type="password"
                        onChange={onChangeInput}
                        label={__("custom.new-password")}
                        id="newPassword"
                        sx={{
                            marginBottom: "16px",
                            textTransform: "capitalize",
                        }}
                    />
                    <TextField
                        fullWidth
                        type="password"
                        onChange={onChangeInput}
                        label={__("custom.password-confirmation")}
                        id="passwordConfirmation"
                        sx={{
                            marginBottom: "16px",
                            textTransform: "capitalize",
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                    >
                        {__("custom.update")}
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};
