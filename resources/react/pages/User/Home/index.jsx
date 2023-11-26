import React from "react";
import { Box, Typography, TextField, Grid, Button } from "@mui/material";
import { FloorMap } from "../../../components/FloorMap";

export const PageUserHome = () => {
  return (
    <Box sx={{ background: "#1d1f1e", height: "100%", width: "100%" }}>
      <Box sx={{ width: "100%", maxWidth: 900, margin: "0 auto", minHeight: "100vh", background: "#fff" }}>
        <Box component="img" src="/img/banner.jpg" sx={{ width: "100%", height: "auto" }} />
        <Typography variant="h2" textAlign="center" marginTop="16px">
          Welcome back
        </Typography>
        <Typography textAlign="center">
          Please fill the following application form to complete the reservation
        </Typography>
        <form style={{ padding: "56px 24px" }}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                InputLabelProps={{ shrink: true }}
                id="outlined-basic"
                label="What is your phone number?"
                placeholder="Your phone number"
                required={true}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                InputLabelProps={{ shrink: true }}
                id="outlined-basic"
                label="What is your email?"
                placeholder="Your email"
                required={false}
                variant="outlined"
                fullWidth
                type="email"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                InputLabelProps={{ shrink: true }}
                id="outlined-basic"
                label="What is your name?"
                placeholder="Your name"
                required={true}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                InputLabelProps={{ shrink: true }}
                id="outlined-basic"
                label="How many adults?"
                placeholder="Adults"
                required={true}
                variant="outlined"
                fullWidth
                type="number"
                value={0}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                InputLabelProps={{ shrink: true }}
                id="outlined-basic"
                label="How many children?"
                placeholder="Children"
                required={true}
                variant="outlined"
                fullWidth
                type="number"
                value={0}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="outlined-basic"
                label="When will you come here?"
                required={true}
                variant="outlined"
                fullWidth
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="outlined-basic"
                label="When do you want to leave?"
                required={true}
                variant="outlined"
                fullWidth
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2">Which table(s) do you want to use? *</Typography>
              <Box position="relative" height="500px" border="1px solid grey">
                <FloorMap></FloorMap>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button variant="contained" size="large">
                  Complete the reservation
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
};
