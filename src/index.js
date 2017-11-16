import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import Router from './Router.js';


ReactDOM.render(<Router />, document.getElementById('root'));
registerServiceWorker();
