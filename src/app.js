import 'babel-core/polyfill';
import 'normalize.css/normalize.css';
import 'leaflet/dist/leaflet.css';
import './style.css';

import React from 'react';
import MapContainer from './map-container';

window.document.addEventListener('DOMContentLoaded', () => {
  const appEl = window.document.getElementById('app');
  React.render(<MapContainer/>, appEl);
});
