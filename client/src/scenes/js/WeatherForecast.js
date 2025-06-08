import { useState, useEffect } from "react";
import axios from "axios";

import "../css/WeatherForecast.css";

import WeatherForecastDay from "./WeatherForecastDay";

export default function WeatherForecast(props) {
  const [loaded, setLoaded] = useState(false);
  const [forecastData, setForecastData] = useState(null);

  // When coordinates change, set loaded to false to fetch new city data
  useEffect(() => {
    setLoaded(false);
  }, [props.coords]);

  function handleResponse(response) {
    console.log(response);
    setForecastData(response.data);
    setLoaded(true);
  }

  // Get weather forecast for next days
  function getWeatherForecast() {
    const apiKey = "af572b83d0ddfa6de9d54d44ef972148";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${props.coords.lat}&lon=${props.coords.lon}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(handleResponse);
  }

  if (loaded) {
    return (
      <div className="WeatherForecast row">
        <div className="col-6 col-md-4 col-lg-2 WeatherForecast-elem">
          <WeatherForecastDay data={forecastData} />
        </div>
      </div>
    );
  } else {
    getWeatherForecast();
    return null;
  }
}
