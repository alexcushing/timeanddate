import React, { Component } from "react";
import axios from "axios";
import fahrenheitToCelsius from "fahrenheit-to-celsius";
import CircularProgress from "material-ui/CircularProgress";
import "./Styles/Home.css";
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
    state: "",
    feels: "",
    temp: 0,
    max: 0,
    min: 0,
    fahrenheit: true,
    redirect: false,
    standardTime: true
  };
  componentWillMount = () => {
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
    if (localData === null || localData === undefined) {
      this.setState({ loading: true, cached: false });
    } else {
      console.log('getting stuff')
      localData = JSON.parse(localData);
      this.setState({
        cached: true,
        town: localData.location.name,
        state: localData.location.region,
        temp: localData.current.temp_f,
        feels: localData.current.feelslike_f,
        description: localData.current.condition.text,
        icon: localData.current.condition.icon,
        timezone: localData.location.tz_id
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
          `http://api.apixu.com/v1/current.json?key=129414658c224dda95b44931171611&q=${this
            .state.latitude},${this.state.longitude}`
        )
        .then(({ data }) => {
          console.log(data)
          localStorage.setItem("weatherdata", JSON.stringify(data));
          this.setState({
            cached: false,
            town: data.location.name,
            state: data.location.region,
            temp: data.current.temp_f,
            feels: data.current.feelslike_f,
            description: data.current.condition.text,
            icon: data.current.condition.icon,
            timezone: data.location.tz_id
          });
        })
        .catch(err=> {
          console.error(err);
        });
    }, err => {
      console.error(err);
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
      <div className="Home">
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
            <div className="Weather-over">
              <span>{this.state.town}, {this.state.state}</span>
              <span>{this.state.fahrenheit
                ? this.state.temp
                : Math.round(fahrenheitToCelsius(this.state.temp) * 100) /
                  100}° {this.state.fahrenheit ? "F" : "C"}</span>
              </div>
            <span className="Weather-under">
              {this.state.description}
              <img src={this.state.icon} alt='weather' className="Weather--icon"/>
            </span>
          </div>
        )}
        <div className="Clock">
          <span className="Clock-top"><Clock
              format="ddd, MM/DD/YYYY"
              ticking={true}
              timezone={this.state.timezone}
              interval= {60000}
            />{" "}</span>
          <Clock
            format={this.state.standardTime ? "h:mm a" : "HH:mm"}
            ticking={true}
            timezone={this.state.timezone}
            interval={5000}
          />
        </div>
      </div>
    );
  }
}

export default Home;
