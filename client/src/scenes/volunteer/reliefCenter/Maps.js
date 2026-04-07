import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = () => {
  const [userData, setUserData] = useState([]);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/user-data");
        const data = await response.json();
        const updatedUserData = data.map((user) => ({
          name: user.CenterName,
          latitude: user.latitude,
          longitude: user.longitude,
        }));
        setUserData(updatedUserData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!map) {
      const newMap = L.map("map").setView([20.5937, 78.9629], 5); // Default view set to India
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(newMap);

      setMap(newMap);
    }

    const displayStaticMarkers = () => {
      const staticMarkers = userData.map((user) => ({
        name: user.name,
        latitude: parseFloat(user.latitude),
        longitude: parseFloat(user.longitude),
      }));

      staticMarkers.forEach((marker) => {
        const customIcon = L.divIcon({
          className: "custom-marker",
          html: `<div style="background-color: blue" class="marker"></div>`,
        });

        if (map) {
          L.marker([marker.latitude, marker.longitude], { icon: customIcon })
            .addTo(map)
            .bindPopup(
              `<strong>${marker.name}</strong><br/>Latitude: ${marker.latitude}<br/>Longitude: ${marker.longitude}`
            )
            .openPopup();
        }
      });
    };

    if (map && userData.length > 0) {
      displayStaticMarkers();
    }
  }, [map, userData]);

  return <div id="map" style={{ height: "500px" }}></div>;
};

export default MapComponent;
