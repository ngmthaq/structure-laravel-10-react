import React, { useEffect, useRef } from "react";
import dayjs from "dayjs";
import { Chart, registerables } from "chart.js";
import { Box, Grid, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdminLayout } from "../../../layouts/AdminLayout";
import { __ } from "../../../plugins/i18n.plugin";
import { AdminPanelSettings, KeyboardArrowRight } from "@mui/icons-material";
import { theme } from "../../../plugins/material.plugin";
import { useDispatch } from "react-redux";
import { commonActions } from "../../../reducers/common.reducer";
import { authAsyncActions } from "../../../reducers/auth.reducer";

Chart.register(...registerables);

const DashboardConditionInput = ({ onChange }) => {
  const onChangeDateTime = (value) => {
    onChange(dayjs(value).format("YYYY"));
  };

  const views = ["year"];

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <DatePicker views={views} defaultValue={dayjs()} onChange={onChangeDateTime} label={__("custom.choose-time")} />
    </Box>
  );
};

export const Dashboard = () => {
  const chart1 = useRef(null);
  const chart2 = useRef(null);
  const chart3 = useRef(null);
  const chart4 = useRef(null);
  const chart5 = useRef(null);
  const chart6 = useRef(null);

  const initChart1 = (ref) => {
    if (ref && !chart1.current) {
      chart1.current = new Chart(ref, {
        type: "line",
        data: {
          labels: [],
          datasets: [
            {
              label: "User(s)",
              data: [],
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
    if (ref && !chart2.current) {
      chart2.current = new Chart(ref, {
        type: "line",
        data: {
          labels: [],
          datasets: [
            {
              fill: true,
              label: "Order(s)",
              data: [],
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
    if (ref && !chart3.current) {
      chart3.current = new Chart(ref, {
        type: "pie",
        data: {
          labels: [],
          datasets: [
            {
              label: "%",
              data: [],
              borderWidth: 2,
              backgroundColor: [],
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
            legend: {
              display: true,
            },
          },
          maintainAspectRatio: false,
        },
      });
    }
  };

  const initChart4 = (ref) => {
    if (ref && !chart4.current) {
      chart4.current = new Chart(ref, {
        type: "doughnut",
        data: {
          labels: [],
          datasets: [
            {
              label: "%",
              data: [],
              borderWidth: 2,
              backgroundColor: [],
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
            legend: {
              display: true,
            },
          },
          maintainAspectRatio: false,
        },
      });
    }
  };

  const initChart5 = (ref) => {
    if (ref && !chart5.current) {
      chart5.current = new Chart(ref, {
        type: "bar",
        data: {
          labels: [],
          datasets: [
            {
              label: "Staff(s)",
              data: [],
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
    if (ref && !chart6.current) {
      chart6.current = new Chart(ref, {
        type: "bar",
        data: {
          labels: [],
          datasets: [
            {
              label: "Staff(s)",
              data: [],
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

  const dispatch = useDispatch();

  const onGetDashboardData = async (dateTime = dayjs().format("YYYY")) => {
    dispatch(commonActions.openLinearLoading());
    const response = await dispatch(authAsyncActions.dashboard({ time: dateTime })).unwrap();

    chart1.current.data.labels = response.newUsers.labels;
    chart1.current.data.datasets[0].data = response.newUsers.data;
    chart1.current.update();

    chart2.current.data.labels = response.newBills.labels;
    chart2.current.data.datasets[0].data = response.newBills.data;
    chart2.current.update();

    chart3.current.data.labels = response.userReservationRate.labels;
    chart3.current.data.datasets[0].data = response.userReservationRate.percent;
    chart3.current.data.datasets[0].backgroundColor = response.userReservationRate.colors;
    chart3.current.update();

    chart4.current.data.labels = response.tableReservationRate.labels;
    chart4.current.data.datasets[0].data = response.tableReservationRate.percent;
    chart4.current.data.datasets[0].backgroundColor = response.tableReservationRate.colors;
    chart4.current.update();

    chart5.current.data.labels = response.newStaffs.labels;
    chart5.current.data.datasets[0].data = response.newStaffs.data;
    chart5.current.update();

    chart6.current.data.labels = response.firedStaffs.labels;
    chart6.current.data.datasets[0].data = response.firedStaffs.data;
    chart6.current.update();
    dispatch(commonActions.closeLinearLoading());
  };

  useEffect(() => {
    onGetDashboardData();
  }, []);

  return (
    <AdminLayout>
      <Box
        component="form"
        sx={{ padding: "16px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}
      >
        <Box>
          <Typography variant="h5" sx={{ textTransform: "capitalize", marginBottom: "4px" }}>
            {__("custom.admin-dashboard-title")}
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
            <Box component="span">{__("custom.admin-dashboard-title")}</Box>
          </Typography>
        </Box>
        <DashboardConditionInput onChange={onGetDashboardData} />
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
