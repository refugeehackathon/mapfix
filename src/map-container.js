import React from 'react';
import Mapper from './mapper';

import './map-container.css';

export default class MapContainer extends React.Component {

  static propTypes = {};

  componentDidMount() {
    this.map = new Mapper(React.findDOMNode(this));
  }

  render() {
    return (
      <div className="map-container"/>
    );
  }
}
