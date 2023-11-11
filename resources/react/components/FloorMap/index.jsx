import React, { Fragment, createContext, useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { Box, Button, ButtonGroup } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { theme } from "../../plugins/material.plugin";
import { shadeColor } from "../../helpers/primitive.helper";
import { useEventBus } from "../../plugins/bus.plugin";
import { EVENT_BUS } from "../../const/event.const";
import { __ } from "../../plugins/i18n.plugin";

const square = 50;

export const FloorMapContext = createContext();

export const floorMapZoomEvent = "floorMapZoomEvent";

export const FloorMap = ({ children, zoom = true }) => {
  const { conf } = useLoaderData();

  const eventBus = useEventBus();

  const floor = useRef();

  const floorContainer = useRef();

  const position = useRef({ top: 0, left: 0, x: 0, y: 0, scale: 1, scaleStep: 0.1, minScale: 0.5, maxScale: 1.5 });

  const getInitWidth = () => {
    const data = conf.find((config) => config.key === "ROOM_WIDTH_KEY");
    if (data) return data.value * 100;
    return 100;
  };

  const getInitHeight = () => {
    const data = conf.find((config) => config.key === "ROOM_HEIGHT_KEY");
    if (data) return data.value * 100;
    return 100;
  };

  const [width, setWidth] = useState(getInitWidth());

  const [height, setHeight] = useState(getInitHeight());

  const [lats, setLats] = useState([]);

  const [longs, setLongs] = useState([]);

  const [activeTable, setActiveTable] = useState(null);

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
      resizeFloor();
    }
  };

  const zoomOut = () => {
    if (floor.current) {
      position.current.scale -= position.current.scaleStep;
      position.current.scale =
        position.current.scale < position.current.minScale ? position.current.minScale : position.current.scale;
      resizeFloor();
    }
  };

  const resizeFloor = () => {
    const newWidth = position.current.scale * getInitWidth();
    setWidth(newWidth);
    floor.current.style.width = newWidth + "px";

    const newHeight = position.current.scale * getInitHeight();
    setHeight(newHeight);
    floor.current.style.height = newHeight + "px";
  };

  useEffect(() => {
    floorContainer.current.addEventListener("mousedown", mouseDownHandler);
  }, []);

  useEffect(() => {
    if (width > 0 && height > 0) {
      const currentSquare = square * position.current.scale;

      let currentLatPosition = currentSquare;
      let currentLongPosition = currentSquare;
      let newLats = [];
      let newLongs = [];

      while (currentLatPosition < width) {
        newLats.push({ top: 0, left: currentLatPosition });
        currentLatPosition += currentSquare;
      }

      while (currentLongPosition < height) {
        newLongs.push({ top: currentLongPosition, left: 0 });
        currentLongPosition += currentSquare;
      }

      setLats(newLats);
      setLongs(newLongs);
    }
  }, [width, height]);

  useEffect(() => {
    eventBus.emit(EVENT_BUS.activeTable, activeTable);
  }, [activeTable]);

  useEffect(() => {
    const onTableDeleted = ({ id }) => {
      setActiveTable(null);
    };

    eventBus.on(EVENT_BUS.deleteTable, onTableDeleted);

    return () => {
      eventBus.off(EVENT_BUS.deleteTable, onTableDeleted);
    };
  }, []);

  const contextValue = {
    position,
    activeTable,
    setActiveTable,
  };

  return (
    <FloorMapContext.Provider value={contextValue}>
      {zoom ? (
        <ButtonGroup orientation="vertical" sx={{ position: "absolute", top: "16px", left: "16px", zIndex: 2 }}>
          <Button
            sx={{ width: "40px", height: "40px", background: "#fff !important", color: theme.palette.primary.main }}
            title={__("custom.zoom-in")}
            variant="outlined"
            onClick={zoomIn}
          >
            <Add fontSize="small" />
          </Button>
          <Button
            sx={{ width: "40px", height: "40px", background: "#fff !important", color: theme.palette.primary.main }}
            title={__("custom.zoom-out")}
            variant="outlined"
            onClick={zoomOut}
          >
            <Remove fontSize="small" />
          </Button>
        </ButtonGroup>
      ) : (
        <Fragment />
      )}
      <Box sx={{ width: "100%", height: "100%", overflow: "auto", cursor: "grab" }} ref={floorContainer}>
        <Box
          ref={floor}
          sx={{
            position: "relative",
            width: width + "px",
            height: height + "px",
            border: "1px solid " + theme.palette.primary.lightest,
            transformOrigin: "top left",
          }}
        >
          {children}
          {lats.map((lat, index) => (
            <Box
              key={index}
              sx={{
                height: "100%",
                top: lat.top,
                left: lat.left,
                position: "absolute",
                pointerEvents: "none",
                borderRight: "1px solid " + theme.palette.primary.lightest,
              }}
            />
          ))}
          {longs.map((long, index) => (
            <Box
              key={index}
              sx={{
                width: "100%",
                top: long.top,
                left: long.left,
                position: "absolute",
                pointerEvents: "none",
                borderBottom: "1px solid " + theme.palette.primary.lightest,
              }}
            />
          ))}
        </Box>
      </Box>
    </FloorMapContext.Provider>
  );
};

export const STATE_EDITING = { value: "Editing", color: "#FFF" };
export const STATE_EDITED = { value: "Edited", color: "#FFF" };
export const STATE_IN_USE = { value: "In Use", color: "#A9EAFF" };
export const STATE_AVAILABLE = { value: "Available", color: "#FFF" };
export const STATE_ORDER_IN_USE = { value: "Order In Use", color: "#FFF" };
export const STATE_ORDER_AVAILABLE = { value: "Order Available", color: "#FFF" };
export const STATE_ORDERED = { value: "Ordered", color: "#FFF" };
export const STATE_ORDER_BLOCKED = { value: "Order Blocked", color: "#DFDFDF" };
export const STATE_OVERSTAY = { value: "Overstay", color: "#FFA4A4" };
export const STATE_BLOCKED = { value: "Blocked", color: "#DFDFDF" };
export const STATE_RESERVED = { value: "Reserved", color: "#A260DD" };
export const STATE_LATED = { value: "Lated", color: "#A260DD" };
export const BLOCKED_TABLE_STATES = [STATE_EDITING.value, STATE_EDITED.value, STATE_BLOCKED.value];

export const getTableColor = (state) => {
  let color = { main: "", light: "" };
  switch (state) {
    case STATE_EDITING.value:
      color.main = STATE_EDITING.color;
      color.light = STATE_EDITING.color;
      break;
    case STATE_EDITED.value:
      color.main = STATE_EDITED.color;
      color.light = STATE_EDITED.color;
      break;
    case STATE_IN_USE.value:
      color.main = STATE_IN_USE.color;
      color.light = shadeColor(STATE_IN_USE.color, 20);
      break;
    case STATE_AVAILABLE.value:
      color.main = STATE_AVAILABLE.color;
      color.light = STATE_AVAILABLE.color;
      break;
    case STATE_OVERSTAY.value:
      color.main = STATE_OVERSTAY.color;
      color.light = STATE_OVERSTAY.color;
      break;
    case STATE_BLOCKED.value:
      color.main = STATE_BLOCKED.color;
      color.light = STATE_BLOCKED.color;
      break;
    case STATE_RESERVED.value:
      color.main = STATE_RESERVED.color;
      color.light = STATE_RESERVED.color;
      break;
    case STATE_ORDER_AVAILABLE.value:
      color.main = STATE_ORDER_AVAILABLE.color;
      color.light = STATE_ORDER_AVAILABLE.color;
      break;
    case STATE_ORDER_BLOCKED.value:
      color.main = STATE_ORDER_BLOCKED.color;
      color.light = STATE_ORDER_BLOCKED.color;
      break;
    case STATE_ORDER_IN_USE.value:
      color.main = STATE_ORDER_IN_USE.color;
      color.light = STATE_ORDER_IN_USE.color;
      break;
    case STATE_ORDERED.value:
      color.main = STATE_ORDERED.color;
      color.light = STATE_ORDERED.color;
      break;
    case STATE_LATED.value:
      color.main = STATE_LATED.color;
      color.light = STATE_LATED.color;
      break;
    default:
      color.main = STATE_EDITING.color;
      color.light = STATE_EDITING.color;
      break;
  }

  return color;
};
