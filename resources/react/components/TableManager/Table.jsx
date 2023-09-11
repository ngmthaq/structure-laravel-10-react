import React, {useState} from "react";
import {CircleTable} from "./CircleTable.jsx";
import {SquareTable} from "./SquareTable.jsx";
import {TABLES} from "../../const/app.const.jsx";

export const Table = (props) => {
    const [data, setData] = useState(props.props);

    return data.type == TABLES.circle ? <CircleTable props={data}/> : <SquareTable props={data}/>
};
