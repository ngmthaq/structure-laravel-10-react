import React, {useState} from "react";
import {Box, Popover, Typography} from "@mui/material";
import {SEATS, TABLES} from "../../const/app.const.jsx";

export const SquareTable = (props) => {
    const [data, setData] = useState(props.props);

    return (
        <Box
            sx={{
                width: TABLES.length + "px",
                height: (Math.round(data.seats.length / 2)) * TABLES.length + "px",
                border: "1px solid black",
                position: "absolute",
                top: data.positionY + "px",
                left: data.positionX + "px",
                cursor: "pointer",
            }}>
            <Box sx={{
                width: "initial",
                height: "-webkit-fill-available",
                backgroundColor: data.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <Typography sx={{color: "black", userSelect: "none",}}>{data.id}</Typography>
                {data.seats.map((value, index) =>
                    <Box key={value.id} sx={{
                        position: "absolute",
                        top: 10 + Math.floor(index / 2) * TABLES.length + "px",
                        left: (index + 1) % 2 ? "-12px" : "32px",
                        width: TABLES.length / 2 + "px",
                        height: TABLES.length / 2 + "px",
                        borderRadius: "50%",
                        border: "1px solid " + value.active ? SEATS.active : SEATS.inactive,
                        background: value.active ? SEATS.active : SEATS.inactive,
                        zIndex: -1,
                    }}></Box>)}
            </Box>
        </Box>
    );
};
