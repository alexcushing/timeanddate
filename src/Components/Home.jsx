import React, { Component } from "react";
import axios from "axios";
import kelvinToCelsius from "kelvin-to-celsius";
import kelvinToFahrenheit from "kelvin-to-fahrenheit";
import { Card } from "material-ui/Card";
import CircularProgress from "material-ui/CircularProgress";
import "./Styles/Home.css";
import RaisedButton from "material-ui/RaisedButton";
import { Redirect } from "react-router-dom";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import IconButton from "material-ui/IconButton";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import Clock from "react-live-clock";
class Home extends Component {
  state = {
    latitude: 0,
    longitude: 0,
    loading: false,
    cached: false,
    timezone: "America/New_York",
    description: "",
    icon: "",
    town: "",
    temp: 0,
    max: 0,
    min: 0,
    fahrenheit: true,
    redirect: false,
    standardTime: true
  };
  componentDidMount = () => {
    if (
      localStorage.getItem("f") === null ||
      localStorage.getItem("12") === null
    ) {
      this.setState({ redirect: true });
    } else {
      localStorage.getItem("f") === "false" &&
        this.setState({ fahrenheit: false });
      localStorage.getItem("12") === "false" &&
        this.setState({ standardTime: false });
    }

    let localData = localStorage["weatherdata"];
    if (localData == null) {
      this.setState({ loading: true, cached: false });
    } else {
      localData = JSON.parse(localData);
      this.setState({
        cached: true,
        town: localData.name,
        temp: localData.main.temp,
        max: localData.main.temp_max,
        min: localData.main.temp_min,
        description: localData.weather[0].description
      });
    }
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        loading: false
      });
      axios
        .get(
          `http://api.openweathermap.org/data/2.5/weather?lat=${this.state
            .latitude}&lon=${this.state
            .longitude}&appid=b0eac06c9a33cde35412c3c1af49fdd9`
        )
        .then(({ data }) => {
          localStorage.setItem("weatherdata", JSON.stringify(data));
          this.setState({
            cached: false,
            town: data.name,
            temp: data.main.temp,
            max: data.main.temp_max,
            min: data.main.temp_min,
            description: data.weather[0].description,
            icon: data.weather[0].icon
          });
        });

      axios
        .get(
          `https://maps.googleapis.com/maps/api/timezone/json?location=${this
            .state.latitude},${this.state
            .longitude}&timestamp=1458000000&key=AIzaSyBXHdqV3nbssNYnXwMEweUqlrF31ItNrEY`
        )
        .then(response => {
          this.setState({ timezone: response.timeZoneId });
        });
    });
  };
  sendToSettings = () => {
    this.setState({ redirect: true });
  };
  toggleWeather = () => {
    localStorage.setItem("f", `${!this.state.fahrenheit}`);
    this.setState({ fahrenheit: !this.state.fahrenheit });
  };
  toggleTime = () => {
    localStorage.setItem("12", `${!this.state.standardTime}`);
    this.setState({ standardTime: !this.state.standardTime });
  };
  render() {
    if (this.state.redirect) {
      return <Redirect push to="/intro" />;
    }
    return (
      <div className='Home'>
        <IconMenu
          iconButtonElement={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }
          anchorOrigin={{ horizontal: "left", vertical: "top" }}
          targetOrigin={{ horizontal: "left", vertical: "top" }}
        >
          <MenuItem primaryText="Settings" onClick={this.sendToSettings} />
          <MenuItem
            primaryText={`Toggle to ${this.state.fahrenheit
              ? "celcius"
              : "fahrenheit"}`}
            onClick={this.toggleWeather}
          />
          <MenuItem
            primaryText={`Toggle to ${this.state.standardTime
              ? "24hr"
              : "12hr"}`}
            onClick={this.toggleTime}
          />
        </IconMenu>
        {this.state.loading ? (
          <div className="Weather">
            <CircularProgress thickness={7} size={60} />
          </div>
        ) : (
          <div className="Weather">
            {this.state.town}:{" "}
            {this.state.fahrenheit
              ? kelvinToFahrenheit(this.state.temp)
              : kelvinToCelsius(this.state.temp)}°{" "}
            {this.state.fahrenheit ? "F" : "C"}
            <span className="Weather-under">
              <span className="Weather-under--max">
                Max:{" "}
                {this.state.fahrenheit
                  ? kelvinToFahrenheit(this.state.max)
                  : kelvinToCelsius(this.state.max)}°{" "}
                {this.state.fahrenheit ? "F" : "C"}
              </span>
              <span className="Weather-under--min">
                Min:{" "}
                {this.state.fahrenheit
                  ? kelvinToFahrenheit(this.state.min)
                  : kelvinToCelsius(this.state.min)}°{" "}
                {this.state.fahrenheit ? "F" : "C"}
              </span>
              {this.state.description}
            </span>
          </div>
        )}
        <div className='Clock'>
          <Clock
            format={this.state.standardTime ? "hh:mm:ss" : "HH:mm:ss"}
            ticking={true}
            timezone={this.state.timezone}
          />
        </div>
      </div>
    );
  }
}

export default Home;
