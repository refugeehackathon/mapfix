import React from 'react';
import MapContainer from './map-container';

export default class AppContainer extends React.Component {

  static propTypes = {};

  render() {
    return (
      <div className="app-container">
        <MapContainer/>
        <div>SIDEBAR</div>
      </div>
    );
  }
}
