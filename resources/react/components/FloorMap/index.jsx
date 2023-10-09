import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { Box, Button, ButtonGroup } from "@mui/material";
import { theme } from "../../plugins/material.plugin";
import { Add, Remove } from "@mui/icons-material";

const square = 400;

export const FloorMap = ({ children }) => {
  const { conf } = useLoaderData();

  const floor = useRef();

  const floorContainer = useRef();

  const position = useRef({ top: 0, left: 0, x: 0, y: 0, scale: 1, scaleStep: 0.05, minScale: 0.5, maxScale: 2 });

  const width = useMemo(() => {
    const data = conf.find((config) => config.key === "ROOM_WIDTH_KEY");
    if (data) return data.value * 1000;
    return 1000;
  }, [conf]);

  const height = useMemo(() => {
    const data = conf.find((config) => config.key === "ROOM_HEIGHT_KEY");
    if (data) return data.value * 1000;
    return 1000;
  }, [conf]);

  const [lats, setLats] = useState([]);
  const [longs, setLongs] = useState([]);

  const mouseMoveHandler = (e) => {
    const dx = e.clientX - position.current.x;
    const dy = e.clientY - position.current.y;
    floorContainer.current.scrollTop = position.current.top - dy;
    floorContainer.current.scrollLeft = position.current.left - dx;
  };

  const mouseUpHandler = function () {
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
    floorContainer.current.style.cursor = "grab";
    floorContainer.current.style.removeProperty("user-select");
  };

  const mouseDownHandler = (e) => {
    position.current.left = floorContainer.current.scrollLeft;
    position.current.top = floorContainer.current.scrollTop;
    position.current.x = e.clientX;
    position.current.y = e.clientY;
    floorContainer.current.style.cursor = "grabbing";
    floorContainer.current.style.userSelect = "none";
    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  };

  const zoomIn = () => {
    if (floor.current) {
      position.current.scale += position.current.scaleStep;
      position.current.scale =
        position.current.scale > position.current.maxScale ? position.current.maxScale : position.current.scale;
      floor.current.style.transform = `scale(${position.current.scale})`;
    }
  };

  const zoomOut = () => {
    if (floor.current) {
      position.current.scale -= position.current.scaleStep;
      position.current.scale =
        position.current.scale < position.current.minScale ? position.current.minScale : position.current.scale;
      floor.current.style.transform = `scale(${position.current.scale})`;
    }
  };

  useEffect(() => {
    if (floorContainer.current) {
      floorContainer.current.addEventListener("mousedown", mouseDownHandler);
    }
  }, [floorContainer]);

  useEffect(() => {
    if (width > 0 && height > 0) {
      let currentLatPosition = square;
      let currentLongPosition = square;
      let newLats = [];
      let newLongs = [];

      while (currentLatPosition < width) {
        newLats.push({ top: 0, left: currentLatPosition });
        currentLatPosition += square;
      }

      while (currentLongPosition < height) {
        newLongs.push({ top: currentLongPosition, left: 0 });
        currentLongPosition += square;
      }

      setLats(newLats);
      setLongs(newLongs);
    }
  }, [width, height]);

  return (
    <Fragment>
      <ButtonGroup orientation="vertical" sx={{ position: "absolute", top: "16px", left: "16px", zIndex: 1 }}>
        <Button
          sx={{ width: "40px", height: "40px", background: "#fff", color: theme.palette.primary.main }}
          variant="outlined"
          onClick={zoomIn}
        >
          <Add fontSize="small" />
        </Button>
        <Button
          sx={{ width: "40px", height: "40px", background: "#fff", color: theme.palette.primary.main }}
          variant="outlined"
          onClick={zoomOut}
        >
          <Remove fontSize="small" />
        </Button>
      </ButtonGroup>
      <Box sx={{ width: "100%", height: "100%", overflow: "auto", cursor: "grab" }} ref={floorContainer}>
        <Box
          ref={floor}
          sx={{
            position: "relative",
            width: width + "px",
            height: height + "px",
            border: "1px solid " + theme.palette.primary.main,
            transformOrigin: "top left",
          }}
        >
          {lats.map((lat, index) => (
            <Box
              key={index}
              sx={{
                position: "absolute",
                top: lat.top,
                left: lat.left,
                height: "100%",
                borderRight: "1px solid " + theme.palette.primary.light,
                pointerEvents: "none",
              }}
            />
          ))}
          {longs.map((long, index) => (
            <Box
              key={index}
              sx={{
                position: "absolute",
                top: long.top,
                left: long.left,
                width: "100%",
                borderBottom: "1px solid " + theme.palette.primary.light,
                pointerEvents: "none",
              }}
            />
          ))}
          {children}
        </Box>
      </Box>
    </Fragment>
  );
};
