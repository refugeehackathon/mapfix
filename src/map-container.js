import React from 'react';
import Mapper from './mapper';
import Leaflet from 'leaflet';

import './map-container.css';

const DEFAULT_ICON = Leaflet.icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconSize: [25, 41],
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  shadowRetinaUrl: require('leaflet/dist/images/marker-shadow.png'),
  shadowSize: [41, 41],
});

export default class MapContainer extends React.Component {

  static propTypes = {};

  state = {
    markers: [
      [51.505, -0.09],
      [52.51, 13.37],
    ],
  }

  componentDidMount() {
    this.map = new Mapper(React.findDOMNode(this));
    this.setMarkers();
  }

  componentDidUpdate() {
    this.setMarkers();
  }

  setMarkers() {
    if (this.markers) this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = this.state.markers.map(pos => Leaflet.marker(pos, {icon: DEFAULT_ICON}).addTo(this.map));
  }


  render() {
    return (
      <div className="map-container"/>
    );
  }
}
