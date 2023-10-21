import React from "react";
import { Avatar, Box, Card, CardContent, CardHeader, Grid } from "@mui/material";
import { AdminLayout } from "../../../layouts/AdminLayout";

export const BillManagement = () => {
  return (
    <AdminLayout>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Card elevation={3}>
            <CardHeader avatar={<Avatar>N</Avatar>} title="Nguyễn Mạnh Thắng" subheader="20/10/20213 11:00 AM" />
            <CardContent></CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};
