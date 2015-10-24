import 'babel-core/polyfill';
import 'normalize.css/normalize.css';
import './style.css';

import React from 'react';
import MyComponent from './my-component';

window.document.addEventListener('DOMContentLoaded', () => {
  const appEl = window.document.getElementById('app');
  React.render(<MyComponent/>, appEl);
});
