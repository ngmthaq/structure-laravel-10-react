import React, { useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import { Chart, registerables } from "chart.js";
import { Box, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdminLayout } from "../../../layouts/AdminLayout";
import { __ } from "../../../plugins/i18n.plugin";
import { AdminPanelSettings, KeyboardArrowRight } from "@mui/icons-material";
import { theme } from "../../../plugins/material.plugin";

Chart.register(...registerables);

const DashboardConditionInput = ({ type, onChange }) => {
  const [dateTime, setDateTime] = useState(dayjs());
  const onChangeDateTime = (value) => {
    setDateTime(value);
    onChange(value);
  };

  let views = ["day", "month", "year"];
  if (type === "year") {
    views = ["year"];
  } else if (type === "month") {
    views = ["month", "year"];
  }

  return (
    <DatePicker
      views={views}
      openTo={type}
      value={dateTime}
      onChange={onChangeDateTime}
      label={__("custom.choose-time")}
    />
  );
};

export const Dashboard = () => {
  const viewByValues = useMemo(
    () => ({
      day: { title: __("custom.day"), value: "day" },
      month: { title: __("custom.month"), value: "month" },
      year: { title: __("custom.year"), value: "year" },
    }),
    [],
  );

  const [viewBy, setViewBy] = useState(viewByValues.year.value);

  const chart1 = useRef(null);
  const chart2 = useRef(null);
  const chart3 = useRef(null);
  const chart4 = useRef(null);
  const chart5 = useRef(null);
  const chart6 = useRef(null);

  const onChangeViewBy = (e) => {
    setViewBy(e.target.value);
  };

  const initChart1 = (ref) => {
    if (ref) {
      chart1.current = new Chart(ref, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
          datasets: [
            {
              label: "User(s)",
              data: [12, 19, 3, 5, 2, 3, 3, 3],
              borderWidth: 2,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          elements: {},
          plugins: {
            title: {
              text: "New Users Registered Dashboard (Unit: User)",
              display: true,
              position: "bottom",
            },
            legend: {
              display: false,
            },
          },
          maintainAspectRatio: false,
        },
      });
    }
  };

  const initChart2 = (ref) => {
    if (ref) {
      chart2.current = new Chart(ref, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
          datasets: [
            {
              fill: true,
              label: "Order(s)",
              data: [90, 86, 99, 101, 112, 90, 99, 110],
              borderWidth: 2,
              borderColor: "red",
              backgroundColor: "rgb(255, 0, 0, 0.2)",
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          elements: {
            line: {
              tension: 0.4,
            },
          },
          plugins: {
            title: {
              text: "Table Reservations Dashboard (Unit: Order)",
              display: true,
              position: "bottom",
            },
            legend: {
              display: false,
            },
          },
          maintainAspectRatio: false,
        },
      });
    }
  };

  const initChart3 = (ref) => {
    if (ref) {
      chart3.current = new Chart(ref, {
        type: "pie",
        data: {
          labels: ["Thắng", "Ngọc", "Vinh", "Thành", "Hiếu", "Long", "Tiến", "Đức"],
          datasets: [
            {
              label: "%",
              data: [5, 2, 3, 4, 3, 4, 3, 2],
              borderWidth: 2,
              backgroundColor: ["red", "blue", "green", "yellow", "orange", "black", "violet", "pink"],
            },
          ],
        },
        options: {
          scales: {},
          elements: {},
          plugins: {
            title: {
              text: "User Reservation Rate (Unit: %)",
              display: true,
              position: "bottom",
            },
          },
          maintainAspectRatio: false,
        },
      });
    }
  };

  const initChart4 = (ref) => {
    if (ref) {
      chart4.current = new Chart(ref, {
        type: "doughnut",
        data: {
          labels: ["Table 1", "Table 2", "Table 3", "Table 4", "Table 5", "Table 6", "Table 7", "Table 8"],
          datasets: [
            {
              label: "%",
              data: [5, 2, 3, 4, 3, 4, 3, 2],
              borderWidth: 2,
              backgroundColor: ["red", "blue", "green", "yellow", "orange", "black", "violet", "pink"],
            },
          ],
        },
        options: {
          scales: {},
          elements: {},
          plugins: {
            title: {
              text: "Table Reservation Rate (Unit: %)",
              display: true,
              position: "bottom",
            },
          },
          maintainAspectRatio: false,
        },
      });
    }
  };

  const initChart5 = (ref) => {
    if (ref) {
      chart5.current = new Chart(ref, {
        type: "bar",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
          datasets: [
            {
              label: "Staff(s)",
              data: [5, 2, 3, 4, 3, 4, 3, 2],
              borderWidth: 2,
              borderColor: "blue",
              backgroundColor: "rgb(0, 0, 255, 0.5)",
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          elements: {
            line: {
              tension: 0.4,
            },
          },
          plugins: {
            title: {
              text: "New Staff Registered Dashboard (Unit: Staff)",
              display: true,
              position: "bottom",
            },
            legend: {
              display: false,
            },
          },
          maintainAspectRatio: false,
        },
      });
    }
  };

  const initChart6 = (ref) => {
    if (ref) {
      chart6.current = new Chart(ref, {
        type: "bar",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
          datasets: [
            {
              label: "Staff(s)",
              data: [2, 0, 0, 3, 1, 0, 1, 2],
              borderWidth: 2,
              borderColor: "orange",
              backgroundColor: "rgb(255, 165, 0, 0.5)",
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          elements: {
            line: {
              tension: 0.4,
            },
          },
          plugins: {
            title: {
              text: "Number Of Employees Quitting (Unit: Staff)",
              display: true,
              position: "bottom",
            },
            legend: {
              display: false,
            },
          },
          maintainAspectRatio: false,
        },
      });
    }
  };

  return (
    <AdminLayout>
      <Box
        component="form"
        sx={{ padding: "16px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}
      >
        <Box>
          <Typography variant="h5" sx={{ textTransform: "capitalize", marginBottom: "4px" }}>
            {__("custom.admin.dashboard.title")}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              textTransform: "capitalize",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: theme.palette.grey[600],
              "& span:last-child": {
                color: theme.palette.grey[400],
              },
            }}
          >
            <AdminPanelSettings fontSize="small" />
            <KeyboardArrowRight fontSize="small" />
            <Box component="span">{__("custom.admin-role")}</Box>
            <KeyboardArrowRight fontSize="small" />
            <Box component="span">{__("custom.admin.dashboard.title")}</Box>
          </Typography>
        </Box>
        <Box>
          <FormControl sx={{ width: 240, marginRight: "16px" }}>
            <InputLabel id="view-by-label">{__("custom.view-by")}</InputLabel>
            <Select
              value={viewBy}
              id="view-by-select"
              labelId="view-by-label"
              onChange={onChangeViewBy}
              label={__("custom.view-by")}
            >
              {Object.values(viewByValues).map((viewByValue, index) => (
                <MenuItem value={viewByValue.value} key={index}>
                  {viewByValue.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <DashboardConditionInput type={viewBy} onChange={() => {}} />
        </Box>
      </Box>
      <Box sx={{ padding: "16px" }}>
        <Grid container spacing={6}>
          <Grid item xs={12} lg={6}>
            <Box sx={{ height: "400px" }}>
              <Box component="canvas" ref={initChart1} />
            </Box>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Box sx={{ height: "400px" }}>
              <Box component="canvas" ref={initChart2} />
            </Box>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Box sx={{ height: "480px" }}>
              <Box component="canvas" ref={initChart3} />
            </Box>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Box sx={{ height: "480px" }}>
              <Box component="canvas" ref={initChart4} />
            </Box>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Box sx={{ height: "480px" }}>
              <Box component="canvas" ref={initChart5} />
            </Box>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Box sx={{ height: "480px" }}>
              <Box component="canvas" ref={initChart6} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </AdminLayout>
  );
};
