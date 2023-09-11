import React, { Fragment, useEffect, useState } from "react";
import {
    Box,
    FormControl,
    IconButton,
    Input,
    InputAdornment,
    MenuItem,
    Pagination,
    Select,
    Typography,
    capitalize,
} from "@mui/material";
import { __ } from "../../plugins/i18n.plugin";
import { isArray } from "../../helpers/reference.helper";
import {
    ArrowDownward,
    ArrowUpward,
    MoreVert,
    Search,
    SwapVert,
} from "@mui/icons-material";
import { theme } from "../../plugins/material.plugin";

export const SORT_DIR_ASC = "asc";

export const SORT_DIR_DESC = "desc";

export const DataTable = ({
    header,
    fullWidth,
    body,
    total,
    initPage,
    onFilter,
    onChangePage,
    onChangeLimit,
    onChangeSortOrder,
}) => {
    const [filterTimeout, setFilterTimeout] = useState(null);

    const [headerColumns, setHeaderColumns] = useState([]);

    const [bodyRows, setBodyRows] = useState([]);

    const [page, setPage] = useState(initPage ?? 1);

    const [limitation, setLimitation] = useState([
        { number: 25, selected: true },
        { number: 50, selected: false },
        { number: 100, selected: false },
        { number: 200, selected: false },
        { number: 400, selected: false },
        { number: 800, selected: false },
        { number: 1600, selected: false },
    ]);

    const onChangeLimitation = (e) => {
        const value = e.target.value;
        setLimitation((state) =>
            state.map((limit) => {
                if (limit.number === value) {
                    return { ...limit, selected: true };
                } else {
                    return { ...limit, selected: false };
                }
            })
        );
        onChangeLimit(value);
    };

    const onChangePagination = (e, page) => {
        setPage(page);
        onChangePage(page);
    };

    const onClickSortable = (col) => {
        const newHeaderColumns = headerColumns.map((h) => {
            if (h.sortCol !== col) return { ...h, sortDir: "" };
            if (h.sortDir === "") {
                h.sortDir = SORT_DIR_ASC;
                if (onChangeSortOrder)
                    onChangeSortOrder({ col: col, dir: SORT_DIR_ASC });
            } else if (h.sortDir === SORT_DIR_ASC) {
                h.sortDir = SORT_DIR_DESC;
                if (onChangeSortOrder)
                    onChangeSortOrder({ col: col, dir: SORT_DIR_DESC });
            } else {
                h.sortDir = "";
                if (onChangeSortOrder) onChangeSortOrder({ col: "", dir: "" });
            }

            return h;
        });

        setHeaderColumns(newHeaderColumns);
    };

    const getLimit = () => {
        return limitation.find((limit) => limit.selected).number;
    };

    const onChangeFilterInput = (e) => {
        if (filterTimeout) clearTimeout(filterTimeout);

        let id = setTimeout(() => {
            if (onFilter) onFilter(e.target.value);
        }, 500);

        setFilterTimeout(id);
    };

    useEffect(() => {
        if (isArray(header) && header.length > 0) {
            const newHeaderColumns = header.map((h) => ({
                ...h,
                sortDir: "",
            }));

            setHeaderColumns(newHeaderColumns);
        }
    }, [header]);

    useEffect(() => {
        if (isArray(body) && body.length > 0) {
            setBodyRows(body);
        }
    }, [body]);

    return (
        <Box>
            <Box
                sx={{
                    padding: "16px 0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Typography>
                    {capitalize(
                        __("custom.showing", {
                            start: getLimit() * (page - 1) + 1,
                            end: getLimit() * (page - 1) + bodyRows.length,
                            total: total,
                        })
                    )}
                </Typography>
                <FormControl variant="standard">
                    <Input
                        onChange={onChangeFilterInput}
                        startAdornment={
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        }
                    />
                </FormControl>
            </Box>
            <Box
                component="table"
                sx={{
                    width: fullWidth ? "100%" : "auto",
                    border: "1px solid black",
                    borderCollapse: "collapse",
                    "& td, th": {
                        border: "1px solid black",
                        padding: "4px 8px",
                    },
                }}
            >
                {headerColumns.length > 0 ? (
                    <Box component="thead">
                        <Box component="tr">
                            {headerColumns.map((col, index) => (
                                <Box
                                    component="th"
                                    sx={{
                                        width:
                                            (col.widthPercent / 100) * 98 + "%",
                                        textAlign: "left",
                                    }}
                                    key={index}
                                >
                                    <Box
                                        sx={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyItems: "center",
                                            cursor: col.sortable
                                                ? "pointer"
                                                : "default",
                                            userSelect: col.sortable
                                                ? "none"
                                                : "auto",
                                        }}
                                        component="span"
                                        onClick={() =>
                                            onClickSortable(col.sortCol)
                                        }
                                    >
                                        <Box component="span">{col.title}</Box>
                                        <Box component="span">
                                            {col.sortable ? (
                                                col.sortDir === "" ? (
                                                    <SwapVert
                                                        htmlColor={
                                                            theme.palette
                                                                .grey[400]
                                                        }
                                                        fontSize="small"
                                                    />
                                                ) : col.sortDir ===
                                                  SORT_DIR_ASC ? (
                                                    <ArrowDownward fontSize="small" />
                                                ) : (
                                                    <ArrowUpward fontSize="small" />
                                                )
                                            ) : (
                                                <Fragment />
                                            )}
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                            <Box component="th" sx={{ width: "2%" }} />
                        </Box>
                    </Box>
                ) : (
                    <Fragment />
                )}
                <Box component="tbody">
                    {bodyRows.map((row, index) => (
                        <Box component="tr" key={index}>
                            {headerColumns.map((col) => (
                                <Box
                                    component="td"
                                    key={col.sortCol}
                                    sx={{ textAlign: "left", fontSize: "14px" }}
                                >
                                    {row[col.sortCol]}
                                </Box>
                            ))}
                            <Box
                                component="td"
                                sx={{ textAlign: "center", fontSize: "14px" }}
                            >
                                <IconButton size="small">
                                    <MoreVert />
                                </IconButton>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
            <Box
                sx={{
                    padding: "16px 0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <FormControl
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        flexDirection: "row",
                        gap: "6px",
                    }}
                >
                    <Typography>{capitalize(__("custom.show"))}</Typography>
                    <Select
                        size="small"
                        onChange={onChangeLimitation}
                        value={getLimit()}
                    >
                        {limitation.map((limit) => (
                            <MenuItem value={limit.number} key={limit.number}>
                                {limit.number}
                            </MenuItem>
                        ))}
                    </Select>
                    <Typography>{__("custom.records")}</Typography>
                </FormControl>
                <Pagination
                    page={page}
                    onChange={onChangePagination}
                    count={
                        Number.isNaN(Math.ceil(total / getLimit()))
                            ? 1
                            : Math.ceil(total / getLimit())
                    }
                    color="primary"
                />
            </Box>
        </Box>
    );
};
