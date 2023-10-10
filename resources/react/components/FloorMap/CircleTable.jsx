import React, { Fragment, useContext, useEffect, useState } from "react";
import { Box, IconButton } from "@mui/material";
import { BLOCKED_TABLE_STATES, FloorMapContext, STATE_EDITING, getTableColor } from "./index";
import { createArrayFromNumber } from "../../helpers/reference.helper";
import { Cancel } from "@mui/icons-material";
import { theme } from "../../plugins/material.plugin";
import { dragElement } from "../../helpers/element.helper";

const minSize = 50;

export const CircleTable = ({ id, position, state, usage, seats, seated }) => {
  const { position: floorMapPosition, activeTable, setActiveTable } = useContext(FloorMapContext);

  const initSize = minSize;

  const [size, setSize] = useState(initSize);

  const onDbClick = () => {
    if (state === STATE_EDITING.value) {
      setActiveTable(id);
      const element = document.querySelector(`.floor-circle-table[data-id="${id}"]`);
      dragElement(element);
    } else {
      // TODO: Handle db click in another mode
    }
  };

  const onDeActive = () => {
    setActiveTable(id);
    const element = document.querySelector(`.floor-circle-table[data-id="${id}"]`);
    element.onmousedown = null;
    setActiveTable(null);
  };

  useEffect(() => {
    const scale = seats < 6 ? 1 : seats * 0.2;
    setSize(initSize * floorMapPosition.current.scale * scale);
  }, [floorMapPosition.current.scale, seats]);

  const color = getTableColor(state);

  return (
    <Box
      onDoubleClick={onDbClick}
      className="floor-circle-table"
      data-id={id}
      width={size}
      height={size}
      position="absolute"
      top={position[0] * floorMapPosition.current.scale}
      left={position[1] * floorMapPosition.current.scale}
      zIndex={1}
      sx={{
        userSelect: "none",
        cursor: activeTable === id ? "move" : "pointer",
      }}
    >
      {activeTable === id ? (
        <IconButton
          sx={{ position: "absolute", top: "-20px", right: "-20px", zIndex: 3 }}
          onClick={onDeActive}
          size="small"
          variant="filled"
        >
          <Cancel fontSize="small" />
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
        borderRadius="50%"
        width="100%"
        height="100%"
        zIndex={1}
        sx={{
          filter: `drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.20)) 
                    drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.12)) 
                    drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.14))`,
          boxShadow: activeTable === id ? "0px 0px 8px 2px " + theme.palette.primary.main : "unset",
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
          justifyContent: "center",
        }}
      >
        {createArrayFromNumber(seats).map((index) => (
          <Box
            key={index}
            sx={{
              height: "100%",
              width: floorMapPosition.current.scale * 20 + "px",
              background: BLOCKED_TABLE_STATES.includes(state) ? "#c9ced5" : index + 1 > seated ? "#c9ced5" : "#007296",
              borderRadius: floorMapPosition.current.scale * 30 + "px",
              position: "absolute",
              transform: `rotate(${(360 / seats) * index}deg) translateY(-${floorMapPosition.current.scale * 10}px)`,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};
