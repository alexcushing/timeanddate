
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './Components/Home.jsx';
import Intro from './Components/Intro.jsx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Navigation from './Components/Navigation.jsx';

class Routes extends Component {
  render() {
    return (
        <MuiThemeProvider>
        <Router>
          <div>
            <Navigation />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/intro" component={Intro} />
              <Route exact path="/settings" component={Intro} />
              <Route path="/*" render={() => <h1 style={{textAlign: 'center'}}>PAGE NOT FOUND</h1>} />
            </Switch>
          </div>
        </Router>
        </MuiThemeProvider>
    );
  }
}

export default Routes;