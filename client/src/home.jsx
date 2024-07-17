import React, { useState, useRef } from "react";
import MapComponents from "./components/MapComponents/MapComponents";
import Weather from "./scenes/js/Weather";
import FloodPredict from "./scenes/js/App";
import "./Mapweather.css";
function MapAndWeather() {
  const [isSOSClicked, setIsSOSClicked] = useState(false);

  const handleSOS = () => {
    setIsSOSClicked(true);
    // Call the callback function in MapComponents
    if (mapComponentsRef.current && mapComponentsRef.current.handleSOSClick) {
      mapComponentsRef.current.handleSOSClick();
    }
  };

  const mapComponentsRef = useRef();

  return (
    <>
      {/* SOS Button with 3D effect */}
      <div className="text-center mt-1 mb-1">
        <button
          className="btn btn-3d btn-danger"
          style={{ width: "100px", height: "100px", borderRadius: "50%" }}
          onClick={handleSOS}
        >
          SOS
        </button>
      </div>

      {/* Map and Flood Predictor side by side */}
      <div className="container-fluid mt-3">
        <div className="row">
          <div className="col-lg-6 col-md-12">
            <FloodPredict />
          </div>
          <div className="col-lg-6 col-md-12">
            <MapComponents ref={mapComponentsRef} isSOSClicked={isSOSClicked} />
          </div>
        </div>
      </div>
    </>
  );
}

export default MapAndWeather;
