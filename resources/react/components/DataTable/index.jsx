import React, { Fragment, useEffect, useState } from "react";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Pagination,
  Popover,
  Select,
  Typography,
  capitalize,
} from "@mui/material";
import { __ } from "../../plugins/i18n.plugin";
import { isArray } from "../../helpers/reference.helper";
import { ArrowDownward, ArrowUpward, MoreVert, Search, SwapVert } from "@mui/icons-material";
import { theme } from "../../plugins/material.plugin";

export const SORT_DIR_ASC = "asc";

export const SORT_DIR_DESC = "desc";

export const DataTable = ({ header, fullWidth, body, total, initPage, actions, onChange }) => {
  const [filterTimeout, setFilterTimeout] = useState(null);

  const [headerColumns, setHeaderColumns] = useState([]);

  const [bodyRows, setBodyRows] = useState([]);

  const [page, setPage] = useState(initPage ?? 1);

  const [input, setInput] = useState("");

  const [iconButton, setIconButton] = useState({ element: null, data: null });

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
      }),
    );
  };

  const onChangePagination = (e, page) => {
    setPage(page);
  };

  const onClickSortable = (col, sortable) => {
    if (sortable) {
      const newHeaderColumns = headerColumns.map((h) => {
        if (h.sortCol !== col) return { ...h, sortDir: "" };
        if (h.sortDir === "") {
          h.sortDir = SORT_DIR_ASC;
        } else if (h.sortDir === SORT_DIR_ASC) {
          h.sortDir = SORT_DIR_DESC;
        } else {
          h.sortDir = "";
        }

        return h;
      });

      setHeaderColumns(newHeaderColumns);
    }
  };

  const getLimit = () => {
    return limitation.find((limit) => limit.selected).number;
  };

  const onChangeFilterInput = (e) => {
    if (filterTimeout) clearTimeout(filterTimeout);

    let id = setTimeout(() => {
      setInput(e.target.value);
    }, 500);

    setFilterTimeout(id);
  };

  const onClickIconButton = (e, data) => {
    setIconButton({ element: e.currentTarget, data: data });
  };

  const onCloseActionPopover = () => {
    setIconButton({ element: null, data: null });
  };

  const onClickAction = (callback) => {
    callback(iconButton.data);
    onCloseActionPopover();
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

  useEffect(() => {
    const limit = getLimit();
    const head = headerColumns.find((header) => header.sortDir !== "");
    const sortCol = head ? head.sortCol : null;
    const sortDir = head ? head.sortDir : null;
    onChange({
      limit: limit,
      sortCol: sortCol,
      sortDir: sortDir,
      filter: input,
      page: page,
    });
  }, [headerColumns, page, limitation, input]);

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
            }),
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
          border: "1px solid grey",
          borderCollapse: "collapse",
          "& td, th": {
            borderTop: "1px solid grey",
            borderBottom: "1px solid grey",
            padding: "4px 8px",
          },
        }}
      >
        {headerColumns.length > 0 ? (
          <Box component="thead">
            <Box component="tr" sx={{ background: "#212529", color: "whitesmoke" }}>
              {headerColumns.map((col, index) => (
                <Box
                  component="th"
                  sx={{
                    width: (col.widthPercent / 100) * 98 + "%",
                    textAlign: "left",
                  }}
                  key={index}
                >
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyItems: "center",
                      cursor: col.sortable ? "pointer" : "default",
                      userSelect: col.sortable ? "none" : "auto",
                    }}
                    component="span"
                    onClick={() => onClickSortable(col.sortCol, col.sortable)}
                  >
                    <Box component="span">{col.title}</Box>
                    <Box component="span">
                      {col.sortable ? (
                        col.sortDir === "" ? (
                          <SwapVert htmlColor={theme.palette.grey[400]} fontSize="small" />
                        ) : col.sortDir === SORT_DIR_ASC ? (
                          <ArrowDownward fontSize="small" htmlColor={theme.palette.primary.main} />
                        ) : (
                          <ArrowUpward fontSize="small" htmlColor={theme.palette.primary.main} />
                        )
                      ) : (
                        <Fragment />
                      )}
                    </Box>
                  </Box>
                </Box>
              ))}
              {isArray(actions) && actions.length > 0 ? <Box component="th" sx={{ width: "2%" }} /> : <Fragment />}
            </Box>
          </Box>
        ) : (
          <Fragment />
        )}
        <Box component="tbody">
          {bodyRows.map((row, index) => (
            <Box component="tr" key={index}>
              {headerColumns.map((col) => (
                <Box component="td" key={col.sortCol} sx={{ textAlign: "left", fontSize: "14px" }}>
                  {row[col.sortCol]}
                </Box>
              ))}
              {isArray(actions) && actions.length > 0 ? (
                <Box
                  component="td"
                  sx={{
                    textAlign: "center",
                    fontSize: "14px",
                  }}
                >
                  <IconButton size="small" onClick={(e) => onClickIconButton(e, row)}>
                    <MoreVert />
                  </IconButton>
                </Box>
              ) : (
                <Fragment />
              )}
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
          <Select size="small" onChange={onChangeLimitation} value={getLimit()}>
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
          count={Number.isNaN(Math.ceil(total / getLimit())) ? 1 : Math.ceil(total / getLimit())}
          color="primary"
        />
        <Popover
          open={Boolean(iconButton.element)}
          anchorEl={iconButton.element}
          onClose={onCloseActionPopover}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuList>
            {actions ? (
              actions.map((action, index) => (
                <MenuItem key={index} onClick={() => onClickAction(action.handler)}>
                  <ListItemIcon>{action.icon}</ListItemIcon>
                  <ListItemText>{__(action.title)}</ListItemText>
                </MenuItem>
              ))
            ) : (
              <Fragment />
            )}
          </MenuList>
        </Popover>
      </Box>
    </Box>
  );
};
