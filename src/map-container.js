import React from 'react';
import Mapper from './mapper';

import './map-container.css';

export default class MapContainer extends React.Component {

  static propTypes = {};

  componentDidMount() {
    new Mapper().init();
  }

  render() {
    return (
      <div id="map" className="map-container"/>
    );
  }
}
