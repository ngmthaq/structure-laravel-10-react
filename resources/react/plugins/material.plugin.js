import { createTheme } from "@mui/material/styles";

export const palette = {};

export const theme = createTheme({ palette });

export const makeStyle = (callback) => () => callback(theme);
