import WeatherIcon from "./WeatherIcon";
import "../css/WeatherForecastDay.css";

export default function WeatherForecastDay(props) {
  function temperature() {
    let temp = Math.round(props.data.main.temp);
    return `${temp}°`;
  }

  function feelsLike() {
    return `Feels like: ${Math.round(props.data.main.feels_like)}°`;
  }

  function day() {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let date = new Date(props.data.dt * 1000);
    return days[date.getDay()];
  }

  return (
    <div>
      <div className="WeatherForecast-day">{day()}</div>
      <div className="WeatherForecast-icon">
        <WeatherIcon code={props.data.weather[0].icon} size={40} />
      </div>
      <div className="WeatherForecast-temperature">
        <span>{temperature()}</span>
        <div>{feelsLike()}</div>
      </div>
    </div>
  );
}
