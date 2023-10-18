import React, { Fragment, useContext, useEffect, useState } from "react";
import { Box, IconButton } from "@mui/material";
import { BLOCKED_TABLE_STATES, FloorMapContext, STATE_EDITED, STATE_EDITING, STATE_ORDERED, STATE_ORDER_AVAILABLE, STATE_ORDER_IN_USE, getTableColor } from "./index";
import { CheckCircle } from "@mui/icons-material";
import { createArrayFromNumber, isObjDeepEqual } from "../../helpers/reference.helper";
import { theme } from "../../plugins/material.plugin";
import { dragElement } from "../../helpers/element.helper";
import { __ } from "../../plugins/i18n.plugin";
import { TABLE_DIR } from "../../const/app.const";

const minSize = 50;

export const SquareTable = ({ id, position, state, usage, seats, seated, onChangePosition, dir, onReservation }) => {
  const { position: floorMapPosition, activeTable, setActiveTable } = useContext(FloorMapContext);

  const initSize = minSize;

  const [size, setSize] = useState(initSize);

  const [currentPosition, setCurrentPosition] = useState([...position]);

  const onDbClick = () => {
    if ((state === STATE_EDITING.value || state === STATE_EDITED.value) && activeTable === null) {
      setActiveTable(id);
      const element = document.querySelector(`.floor-circle-table[data-id="${id}"]`);
      dragElement(element);
    } else if (
      (state === STATE_ORDER_AVAILABLE.value || state === STATE_ORDER_IN_USE.value || state === STATE_ORDERED.value) &&
      onReservation
    ) {
      onReservation(id);
    }
  };

  const onStopDrag = () => {
    const element = document.querySelector(`.floor-circle-table[data-id="${id}"]`);
    if (element.style.top && element.style.left) {
      setCurrentPosition([
        element.style.top.replace("px", "") / floorMapPosition.current.scale,
        element.style.left.replace("px", "") / floorMapPosition.current.scale,
      ]);
      element.onmousedown = null;
      element.style.removeProperty("top");
      element.style.removeProperty("left");
    }
    setActiveTable(null);
  };

  useEffect(() => {
    if (onChangePosition && !isObjDeepEqual(position, currentPosition)) {
      onChangePosition(id, currentPosition);
    }
  }, [currentPosition]);

  useEffect(() => {
    const scale = seats <= 4 ? 1 : seats * 0.3;
    setSize(initSize * floorMapPosition.current.scale * scale);
  }, [floorMapPosition.current.scale, seats]);

  useEffect(() => {
    if (state === STATE_EDITING.value && activeTable === null) {
      setActiveTable(id);
      const element = document.querySelector(`.floor-circle-table[data-id="${id}"]`);
      dragElement(element);
    }
  }, [state]);

  const color = getTableColor(state);

  return (
    <Box
      zIndex={1}
      data-id={id}
      width={dir === TABLE_DIR.horizontal ? size : initSize * floorMapPosition.current.scale}
      height={dir === TABLE_DIR.horizontal ? initSize * floorMapPosition.current.scale : size}
      position="absolute"
      onDoubleClick={onDbClick}
      className="floor-circle-table"
      title={__("custom.db-click-table-tooltips")}
      top={currentPosition[0] * floorMapPosition.current.scale}
      left={currentPosition[1] * floorMapPosition.current.scale}
      sx={{
        userSelect: "none",
        cursor: activeTable === id ? "move" : activeTable ? "not-allowed" : "pointer",
      }}
    >
      {activeTable === id ? (
        <IconButton
          sx={{ position: "absolute", top: "-20px", right: "-20px", zIndex: 3 }}
          onClick={onStopDrag}
          size="small"
          variant="filled"
        >
          <CheckCircle fontSize="small" color="primary" />
        </IconButton>
      ) : (
        <Fragment />
      )}
      <Box
        sx={{
          position: "absolute",
          zIndex: 2,
          color: activeTable === id ? theme.palette.primary.main : "#869AB8",
          fontSize: floorMapPosition.current.scale * 24 + "px",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {id}
      </Box>
      <Box
        overflow={"hidden"}
        position="absolute"
        width="100%"
        height="100%"
        zIndex={1}
        sx={{
          filter: `drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.20)) 
                    drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.12)) 
                    drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.14))`,
          boxShadow:
            activeTable === id || state === STATE_ORDERED.value
              ? "0px 0px 8px 2px " + theme.palette.primary.main
              : "unset",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            position: "absolute",
            background: color.light,
          }}
        />
        <Box
          sx={{
            width: "100%",
            height: usage + "%",
            background: color.main,
            position: "absolute",
            transform: "rotate(180deg)",
            bottom: 0,
          }}
        />
      </Box>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          flexDirection: dir === TABLE_DIR.horizontal ? "column" : "row",
        }}
      >
        {createArrayFromNumber(seats).map((index) => (
          <Box
            key={index}
            sx={{
              width: dir === TABLE_DIR.horizontal ? floorMapPosition.current.scale * 20 + "px" : "50%",
              height: dir === TABLE_DIR.horizontal ? "50%" : floorMapPosition.current.scale * 20 + "px",
              background: BLOCKED_TABLE_STATES.includes(state) ? "#c9ced5" : index + 1 > seated ? "#c9ced5" : "#007296",
              borderRadius: floorMapPosition.current.scale * 30 + "px",
              transform:
                dir === TABLE_DIR.horizontal
                  ? `translateY(${(index + 1) % 2 ? "-12px" : "12px"})`
                  : `translateX(${(index + 1) % 2 ? "-12px" : "12px"})`,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};
