import React from 'react';
import MapContainer from './map-container';
import Sidebar from './sidebar';
import {DragDropContext as dragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';

@dragDropContext(HTML5Backend)
export default class AppContainer extends React.Component {

  static propTypes = {};

  state = {
    markers: [],
  }

  render() {
    const {markers} = this.state;
    return (
      <div className="app-container">
        <MapContainer markers={markers} onMarkersChange={newMarkers => this.setState({markers: newMarkers})}/>
        <Sidebar/>
      </div>
    );
  }
}
