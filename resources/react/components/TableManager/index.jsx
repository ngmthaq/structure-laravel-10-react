import {useCallback, useEffect, useRef, useState} from "react";
import {Box, Button} from "@mui/material";
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import {Table} from "./Table.jsx";

const MIN_SCALE = 0.1;
const MAX_SCALE = 3;
const DB_FAKE = {
    id: 124,
    seats: [{id: 1, active: true}, {id: 2, active: true}, {id: 3, active: true}, {id: 4, active: true}, {id: 5, active: true}],
    positionX: 123,
    positionY: 123,
    isBlock: false,
    type: 1,
    direction: 0,
    time: 1694415770,
    color: "#A9EAFF",
}

const DB_FAKE_1 = {
    id: 126,
    seats: [{id: 11, active: true}, {id: 12, active: true}, {id: 13, active: true}, {id: 14, active: true}, {id: 15, active: true}],
    positionX: 323,
    positionY: 323,
    isBlock: false,
    type: 0,
    direction: 0,
    time: 1694415770,
    color: "#A9EAFF",
}

function diffPoints(p1, p2) {
    return {x: p1.x - p2.x, y: p1.y - p2.y};
}

function addPoints(p1, p2) {
    return {x: p1.x + p2.x, y: p1.y + p2.y};
}

export const TableManagerComponent = () => {
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({x: 0, y: 0});

    let lastMousePosRef = useRef({x: 0, y: 0});

    const mouseMove = useCallback((event) => {
        const lastMousePos = lastMousePosRef.current;
        const currentMousePos = {x: event.offsetX, y: event.offsetY};
        lastMousePosRef.current = currentMousePos;
        const mouseDiff = diffPoints(currentMousePos, lastMousePos);
        setOffset((prevOffset) => addPoints(prevOffset, mouseDiff));
    }, [lastMousePosRef]);

    const mouseUp = useCallback(() => {
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);
    }, [mouseMove]);

    const dragAndDrop = useCallback((event) => {
        if (event.target.id == "containerTableManager") {
            document.addEventListener("mousemove", mouseMove);
            document.addEventListener("mouseup", mouseUp);
            lastMousePosRef.current = {x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY};
        }
    }, [mouseMove, mouseUp]);

    const clickZoomIn = () => {
        if (scale + 0.1 < MAX_SCALE && scale + 0.1 > MIN_SCALE) {
            setScale(scale + 0.1);
        }
    }

    const clickZoomOut = () => {
        if (scale - 0.1 < MAX_SCALE && scale - 0.1 > MIN_SCALE) {
            setScale(scale - 0.1);
        }
    }

    useEffect(() => {
        const containerTableManager = document.getElementById("containerTableManager");
        containerTableManager.style.transform = "scale(" + scale + ")";
    }, [scale]);

    useEffect(() => {
        const containerTableManager = document.getElementById("containerTableManager");
        containerTableManager.style.top = offset.y * scale + "px";
        containerTableManager.style.left = offset.x * scale + "px";
    }, [offset]);


    return (<Box sx={{
        width: "2000px", height: "2000px", position: "relative", overflow: "hidden", cursor: "grab",
    }}>
        <Box sx={{
            width: "100%", height: "100%", position: "absolute", transition: "all 0.05s",
        }} id="containerTableManager"
             onMouseDown={(e) => dragAndDrop(e)}>
            <Table props={DB_FAKE}/>
            <Table props={DB_FAKE_1}/>
        </Box>
        <Button onClick={() => clickZoomIn()} sx={{
            top: "10px",
            right: "10px",
            position: "absolute",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            height: "64px",
            borderRadius: "12px",
            background: "white",
            "&:hover": {
                backgroundColor: 'lightblue'
            },
        }}><ZoomInIcon sx={{fontSize: 35}}/></Button>
        <Button onClick={() => clickZoomOut()} sx={{
            top: "90px",
            right: "10px",
            position: "absolute",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            height: "64px",
            borderRadius: "12px",
            background: "white",
            "&:hover": {
                backgroundColor: 'lightblue'
            },
        }}><ZoomOutIcon sx={{fontSize: 35}}/></Button>
    </Box>)
};
