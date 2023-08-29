import { createTheme } from "@mui/material/styles";

const palette = {};

const theme = createTheme({ palette });

const makeStyle = (callback) => () => callback(theme);

export { palette, theme, makeStyle };
