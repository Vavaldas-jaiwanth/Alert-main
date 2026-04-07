import React, { useState, useRef } from "react";
import MapComponents from "./components/MapComponents/MapComponents";
import Weather from "./scenes/js/Weather";
import FloodPredict from "./scenes/js/App";
import { Box, Grid, Fab, Tooltip, Typography, Card } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import "./Mapweather.css";

function MapAndWeather() {
  const [isSOSClicked, setIsSOSClicked] = useState(false);
  const mapComponentsRef = useRef();

  const handleSOS = () => {
    setIsSOSClicked(true);
    if (mapComponentsRef.current?.handleSOSClick) {
      mapComponentsRef.current.handleSOSClick();
    }
  };

  return (
    <Box sx={{ p: 3, position: "relative" }}>
      {/* SOS Floating Button */}
      <Tooltip title="Send SOS Alert" placement="left">
        <Fab
          color="error"
          onClick={handleSOS}
          sx={{
            position: "fixed",
            top: "100px",
            right: "40px",
            width: 80,
            height: 80,
            boxShadow: "0 5px 15px rgba(255,0,0,0.4)",
            zIndex: 1000,
          }}
        >
          <WarningIcon fontSize="large" />
        </Fab>
      </Tooltip>

      {/* Page Heading */}
      <Typography variant="h4" align="center" fontWeight={600} gutterBottom>
        Weather & Map Dashboard
      </Typography>

      {/* Content */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={4} sx={{ p: 2 }}>
            <FloodPredict />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={4} sx={{ p: 2 }}>
            <MapComponents ref={mapComponentsRef} isSOSClicked={isSOSClicked} />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default MapAndWeather;
