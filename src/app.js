import 'babel-core/polyfill';
import 'normalize.css/normalize.css';
import 'leaflet/dist/leaflet.css';
import './style.css';
import './print.css';

import React from 'react';
import AppContainer from './app-container';

window.document.addEventListener('DOMContentLoaded', () => {
  const appEl = window.document.getElementById('app');
  React.render(<AppContainer/>, appEl);
});
