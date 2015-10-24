import React from 'react';
import Mapper from './mapper';

export default class MapContainer extends React.Component {

  static propTypes = {};

  componentDidMount() {
    new Mapper().init();
  }

  render() {
    return (
      <div id="map" />
    );
  }
}
