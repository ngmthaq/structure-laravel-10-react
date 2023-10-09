import { Box } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { generateRandomString } from "../../helpers/primitive.helper";

const FLOOR_WIDTH = 600;
const FLOOR_HEIGHT = 600;

const Floor = ({ top, left, id }) => {
  const [pTop, setPTop] = useState(top);
  const [pLeft, setPLeft] = useState(left);

  useEffect(() => {
    if (top !== pTop) setPTop(top);
    if (left !== setPLeft) setPLeft(left);
  }, [top, left]);

  return (
    <Box
      top={pTop + "px"}
      left={pLeft + "px"}
      position="absolute"
      width={FLOOR_WIDTH + "px"}
      height={FLOOR_HEIGHT + "px"}
      border="1px solid lightblue"
      sx={{ pointerEvents: "none" }}
      data-id={id}
    />
  );
};

export const FloorMap = () => {
  const containerRef = useRef(null);
  const prevContainerBoundRef = useRef({ top: 0, left: 0, width: 0, height: 0 });
  const containerBoundRef = useRef({ top: 0, left: 0, width: 0, height: 0 });
  const isMouseInside = useRef(false);
  const isDragging = useRef(false);
  const moveDebounce = useRef();

  const [isContainerRendered, setIsContainerRendered] = useState(false);
  const [floors, setFloors] = useState([]);

  const initRef = (ref) => {
    if (containerRef.current === null && isContainerRendered === false) {
      containerRef.current = ref;
      containerBoundRef.current.top = containerRef.current.clientTop;
      containerBoundRef.current.left = containerRef.current.clientLeft;
      containerBoundRef.current.width = containerRef.current.clientWidth;
      containerBoundRef.current.height = containerRef.current.clientHeight;
      setIsContainerRendered(true);
    }
  };

  const initFloors = () => {
    let top = 0;
    let left = 0;

    while (top <= containerBoundRef.current.height) {
      while (left <= containerBoundRef.current.width) {
        const floor = { top: top, left: left, id: generateRandomString(16) };
        setFloors((state) => [...state, floor]);
        left += FLOOR_WIDTH;
      }

      top += FLOOR_HEIGHT;
      left = 0;
    }

    prevContainerBoundRef.current.top = containerBoundRef.current.top;
    prevContainerBoundRef.current.left = containerBoundRef.current.left;
    prevContainerBoundRef.current.width = containerBoundRef.current.width;
    prevContainerBoundRef.current.height = containerBoundRef.current.height;
  };

  const onCheckMouseInside = () => {
    containerRef.current.addEventListener("wheel", (e) => {
      e.preventDefault();
      return false;
    });

    containerRef.current.addEventListener("mouseover", (e) => {
      document.body.style.cursor = "grab";
      isMouseInside.current = true;
    });

    containerRef.current.addEventListener("mouseout", (e) => {
      isMouseInside.current = false;
      if (!isDragging.current) {
        document.body.style.cursor = "auto";
      }
    });
  };

  const onDrag = () => {
    document.addEventListener("mousedown", () => {
      if (isMouseInside.current) {
        document.body.style.cursor = "grabbing";
        isDragging.current = true;
      }
    });

    document.addEventListener("mouseup", () => {
      isDragging.current = false;
      if (isMouseInside.current) {
        document.body.style.cursor = "grab";
      } else {
        document.body.style.cursor = "auto";
      }
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging.current) {
        containerBoundRef.current.top += e.movementY;
        containerBoundRef.current.left += e.movementX;
        containerRef.current.style.top = containerBoundRef.current.top + "px";
        containerRef.current.style.left = containerBoundRef.current.left + "px";
        clearTimeout(moveDebounce.current);
        moveDebounce.current = setTimeout(() => {
          prevContainerBoundRef.current.top = containerBoundRef.current.top;
          prevContainerBoundRef.current.left = containerBoundRef.current.left;
          prevContainerBoundRef.current.width = containerBoundRef.current.width;
          prevContainerBoundRef.current.height = containerBoundRef.current.height;
        }, 500);
      }
    });
  };

  useEffect(() => {
    if (isContainerRendered) {
      initFloors();
      onCheckMouseInside();
      onDrag();
    }
  }, [isContainerRendered]);

  return (
    <Box sx={{ width: "100%", height: "100%", overflow: "hidden" }}>
      <Box sx={{ width: "100%", height: "100%", position: "relative" }} ref={initRef}>
        {floors.map((floor) => (
          <Floor key={floor.id} id={floor.id} top={floor.top} left={floor.left} />
        ))}
      </Box>
    </Box>
  );
};
