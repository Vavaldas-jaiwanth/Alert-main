import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "./MapComponents.css"; // Import your custom CSS file for additional styling

const getNearestMarkers = (
  currentLatitude,
  currentLongitude,
  limit,
  userData
) => {
  const staticMarkers = userData.map((user) => ({
    name: user.name,
    latitude: parseFloat(user.latitude),
    longitude: parseFloat(user.longitude),
  }));

  staticMarkers.sort((a, b) => {
    const distanceA = Math.sqrt(
      Math.pow(a.latitude - currentLatitude, 2) +
        Math.pow(a.longitude - currentLongitude, 2)
    );
    const distanceB = Math.sqrt(
      Math.pow(b.latitude - currentLatitude, 2) +
        Math.pow(b.longitude - currentLongitude, 2)
    );

    return distanceA - distanceB;
  });

  return staticMarkers.slice(0, limit);
};

const clearMarkers = (map) => {
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });
};

const findNearestMarkers = (
  map,
  userData,
  mail,
  currentLatitude,
  currentLongitude
) => {
  const staticMarkers = getNearestMarkers(
    currentLatitude,
    currentLongitude,
    5,
    userData
  );

  staticMarkers.forEach((marker, index) => {
    const markerColor = index < 5 ? "blue" : "red";

    const customIcon = L.divIcon({
      className: `dynamic-marker ${markerColor}`,
      html: `<div class="marker"></div>`,
    });

    L.marker([marker.latitude, marker.longitude], { icon: customIcon })
      .addTo(map)
      .bindPopup(
        `<strong>${marker.name}</strong><br/>Latitude: ${marker.latitude}<br/>Longitude: ${marker.longitude}`
      )
      .openPopup();
  });
};

const MapComponent = forwardRef((props, ref) => {
  const { isSOSClicked } = props;
  const [userData, setUserData] = useState([]);
  const [mail, setMail] = useState([]);
  const [map, setMap] = useState(null);

  const sendEmailsToServer = async (emailData, latitude, longitude) => {
    try {
      const Nearestlocation = getNearestMarkers(
        latitude,
        longitude,
        5,
        userData
      );
      const agencyEmails = emailData.filter((e) =>
        Nearestlocation.find((l) => l.name === e.name)
      );
      const response = await fetch("/api/send-emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailData: agencyEmails, latitude, longitude }),
      });

      if (response.ok) {
        console.log("Emails sent to the server successfully");
      } else {
        console.error("Failed to send emails to the server");
      }
    } catch (error) {
      console.error("Error sending emails to the server:", error);
    }
  };

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
        const updatedMailData = data.map((user) => ({
          name: user.CenterName,
          email: user.email,
        }));
        setUserData(updatedUserData);
        setMail(updatedMailData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!map) {
      const newMap = L.map("map").setView([0, 0], 2);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(newMap);

      setMap(newMap);
    }

    const showPresentLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = 13.2172;
            const longitude = 79.1003;
            console.log(position);
            if (map) {
              map.setView([latitude, longitude], 15);
            }
            if (map) {
              const customIcon = L.divIcon({ className: "dynamic-marker" });
              L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
            }
            displayStaticMarkers();
          },
          (error) => {
            console.error("Error getting the present location:", error.message);
          },
          { timeout: 5000, enableHighAccuracy: true }
        );
      } else {
        console.error("Geolocation is not supported by your browser");
      }
    };

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

    showPresentLocation();
  }, [map, userData, mail]);
  const Alert = async () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      try {
        const response = await fetch("/notification/addNotification", {
          // Replace '/api/sos' with your SOS endpoint
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ latitude, longitude }),
        });
        console.log(response);
        if (response.ok) {
          console.log("SOS signal sent successfully");
        } else {
          console.error("Failed to send SOS signal");
        }
      } catch (error) {
        console.error("Error sending SOS signal:", error);
      }
    });
  };
  let lastSOSClickTime = 0;
  const SOS_CLICK_INTERVAL = 60000; // 1 minute in milliseconds

  // Function to handle the SOS button click
  const handleSOSClick = async () => {
    const confirmAction = window.confirm(
      "Are you sure you want to send an SOS alert?\n\n" +
        "This action will notify emergency services and nearby contacts of your location.\n\n" +
        "If you are in danger, you can click this.\n\n" +
        "Please use this button only in real emergencies. Misuse of this feature for fun or any non-emergency situations can lead to serious consequences, including legal actions.\n\n" +
        "Thank you for using this feature responsibly."
    );
    if (!confirmAction) {
      return;
    }

    const currentTime = new Date().getTime();
    if (currentTime - lastSOSClickTime < SOS_CLICK_INTERVAL) {
      alert("You can only send an SOS alert once every minute.");
      return;
    }

    lastSOSClickTime = currentTime;
    try {
      if (map) {
        const currentPosition = map.getCenter();
        const latitude = currentPosition.lat;
        const longitude = currentPosition.lng;
        console.log("function0");
        clearMarkers(map);
        findNearestMarkers(map, userData, mail, latitude, longitude);
        Alert();
        console.log(mail, userData);
        await sendEmailsToServer(mail, latitude, longitude);
        console.log("SOS button clicked and emails sent.");
      }
    } catch (error) {
      console.error("Error handling SOS button click:", error);
    }
  };

  useImperativeHandle(ref, () => ({
    handleSOSClick,
  }));
  return (
    <div className="container">
      <div id="map" className="map"></div>
    </div>
  );
});

export default MapComponent;
