import { createTheme } from "@mui/material/styles";

export const palette = {
  primary: {
    lightest: "rgba(0,153,255, 0.2)",
    main: "#1976d2",
    light: "#42a5f5",
    dark: "#1565c0",
    contrastText: "#fff",
  },
};

export const theme = createTheme({ palette });

export const makeStyle = (callback) => () => callback(theme);
