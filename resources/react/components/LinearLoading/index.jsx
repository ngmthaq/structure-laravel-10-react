import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Box, CircularProgress, LinearProgress } from "@mui/material";

export const LINEAR_LOADING_ID = "linear-loading-id";

export const SPINNING_LOADING_ID = "spinning-loading-id";

export const LinearLoadingComponent = () => {
  const isOpenLinearLoading = useSelector((state) => state.common.isOpenLinearLoading);

  return (
    <Fragment>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "none",
          background: "rgba(0, 0, 0, 0.1)",
          zIndex: 11,
          alignItems: "center",
          justifyContent: "center",
        }}
        id={SPINNING_LOADING_ID}
      >
        <CircularProgress />
      </Box>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: isOpenLinearLoading ? "block" : "none",
          background: "rgba(0, 0, 0, 0.001)",
          zIndex: 10,
        }}
        id={LINEAR_LOADING_ID}
      >
        <LinearProgress sx={{ height: 4 }} />
      </Box>
    </Fragment>
  );
};
