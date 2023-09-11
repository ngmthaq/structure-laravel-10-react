import React, {useState} from "react";
import {Box, Popover, Typography} from "@mui/material";
import {SEATS, TABLES} from "../../const/app.const.jsx";

export const CircleTable = (props) => {
    const [data, setData] = useState(props.props);

    return (
        <Box
            sx={{
                width: data.seats.length > 2 ? data.seats.length * TABLES.length * 0.4 - 16 + "px" : "40px",
                height: data.seats.length > 2 ? data.seats.length * TABLES.length * 0.4 - 16 + "px" : "40px",
                border: "1px solid black",
                borderRadius: "50%",
                position: "absolute", top: data.positionY + "px", left: data.positionX + "px", cursor: "pointer",
            }}>
            <Box sx={{
                borderRadius: "50%",
                height: "-webkit-fill-available",
                backgroundColor: data.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <Typography sx={{color: "black", userSelect: "none",}}>{data.id}</Typography>
                {data.seats.map((value, index) =>
                    <Box key={value.id} sx={{
                        width: TABLES.length / 2 + "px",
                        height: data.seats.length > 2 ? data.seats.length * TABLES.length * 0.4 - 15 + "px" : "20px",
                        borderTop: "1px solid " + value.active ? SEATS.active : SEATS.inactive,
                        background: value.active ? SEATS.active : SEATS.inactive,
                        position: "absolute",
                        borderTopLeftRadius: "15px",
                        borderTopRightRadius: "15px",
                        transform: "rotate(" + 360 / data.seats.length * index + "deg) " + (data.seats.length > 2 ? "translateY(-10px)" : "translateY(-20px)"),
                        zIndex: -1,
                    }}></Box>)}
            </Box>
        </Box>
    );
};
