import React, { Component } from "react";
import SelectField from "material-ui/SelectField";
import FlatButton from "material-ui/FlatButton";
import MenuItem from "material-ui/MenuItem";
import { Redirect } from "react-router-dom";
class Intro extends Component {
  state = {
    fahreneheit: true,
    standardTime: true,
    value: 1,
    formatvalue: 1,
    redirect: false
  };
  componentWillMount = () => {
    localStorage.setItem("12", true);
    localStorage.setItem("f", true);
  };
  handleChange = (event, index, value) => {
    let fahreneheit = true;
    localStorage.setItem("f", true);
    if (value == 2) {
      fahreneheit = false;
      localStorage.setItem("f", false);
    }
    this.setState({ value, fahreneheit });
  };
  handleHoursFormat = (event, index, value) => {
    localStorage.setItem("12", true);
    let standardTime = true;
    if (value == 2) {
      standardTime = false;
      localStorage.setItem("12", false);
    }
    this.setState({ formatvalue: value, standardTime });
  };
  continue = () => {
    this.setState({ redirect: true });
  };
  render() {
    if (this.state.redirect) {
      return <Redirect push to="/" />;
    }
    return (
      <div className="Intro">
        <span className="Intro-top">
          <h2 className="Intro-top--header">Welcome</h2>
          <div className="Intro-selects">
            <SelectField
              floatingLabelText="Fahrenheit or Celsius"
              value={this.state.value}
              onChange={this.handleChange}
            >
              <MenuItem value={1} primaryText="F" />
              <MenuItem value={2} primaryText="C" />
            </SelectField>
            <SelectField
              floatingLabelText="Hour Format"
              value={this.state.formatvalue}
              onChange={this.handleHoursFormat}
            >
              <MenuItem value={1} primaryText="12" />
              <MenuItem value={2} primaryText="24" />
            </SelectField>
          </div>
        </span>
        <FlatButton
          label="Continue"
          fullWidth={false}
          primary={true}
          onClick={this.continue}
        />
      </div>
    );
  }
}

export default Intro;
