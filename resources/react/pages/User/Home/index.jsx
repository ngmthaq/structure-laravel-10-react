import React from "react";
import { Typography } from "@mui/material";
import { makeStyle } from "../../../plugins/material.plugin";

const PageUserHome = () => {
    const style = useStyle();

    return <Typography sx={style.typo}>Page User Home</Typography>;
};

export default PageUserHome;

const useStyle = makeStyle((theme) => ({
    typo: {
        fontSize: 16,
        color: theme.palette.primary.main,
    },
}));
