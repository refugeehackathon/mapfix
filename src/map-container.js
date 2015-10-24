import React from 'react';
import {Map, Marker, Popup, TileLayer} from 'react-leaflet';
import {DropTarget as dropTarget} from 'react-dnd';

import './map-container.css';

class DropListener {
  listener = null

  justDropped({type, x, y}) {
    if (this.listener) this.listener({type, x, y});
  }
}

const dropListener = new DropListener();

const cardTarget = {
  drop(props, monitor) {
    const {type} = monitor.getItem();
    const {x, y} = monitor.getClientOffset();
    dropListener.justDropped({type, x, y});
  },
};

let nextMarkerId = 2;

@dropTarget('CategoryIcon', cardTarget, (connect) => ({
  connectDropTarget: connect.dropTarget(),
}))
export default class MapContainer extends React.Component {

  static propTypes = {
    connectDropTarget: React.PropTypes.func.isRequired,
  };

  state = {
    markers: [
      {id: 1, latlng: [52.51, 13.37], type: 'fun'},
    ],
    openMarkerId: null,
  }

  componentDidMount() {
    dropListener.listener = ({type, x, y}) => {
      this.justDroppedType = type;
      const evt = new MouseEvent('click', {clientX: x, clientY: y});
      evt._simulated = true; // don't ask. Just believe me, it's necessary...
      React.findDOMNode(this).dispatchEvent(evt);
    };
  }

  componentDidUpdate() {
    const popupMarkerComp = this.refs.popupMarker;
    popupMarkerComp.leafletElement.openPopup();
  }

  handleMapClick = event => {
    if (!this.justDroppedType) return; // it has been a normal click, not a synthetic one
    this.setState({markers: [...this.state.markers, {id: nextMarkerId, latlng: event.latlng, type: this.justDroppedType}], openMarkerId: nextMarkerId});
    this.justDroppedType = null;
    nextMarkerId += 1;
  }

  renderMarker(marker) {
    const {openMarkerId} = this.state;
    if (marker.id === openMarkerId) {
      return (
        <Marker ref="popupMarker" position={marker.latlng} key={marker.id}>
          <Popup>
            <div>
              <input/>
              <span>A pretty CSS3 popup.<br/>Easily customizable.</span>
            </div>
          </Popup>
        </Marker>
      );
    }
    return <Marker position={marker.latlng} key={marker.id}/>;
  }

  render() {
    const {connectDropTarget} = this.props;
    const {markers} = this.state;

    return connectDropTarget(
      <Map className="map-container" center={[52.51, 13.37]} zoom={13} onLeafletClick={this.handleMapClick}>
        <TileLayer
          url="https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}"
          attribution="<a href='//openstreetmap.org' target='_blank'>OpenStreetMap</a> | <a href='//mapbox.com' target='_blank'>Mapbox</a>"
          accessToken="pk.eyJ1IjoiZG9uc2Nob2UiLCJhIjoiMkN5RUk0QSJ9.FGcEYWjfgcJUmSyN1tkwgQ"
          noWrap
          continuousWorld={false}
          id="mapbox.light"
        />
        {markers.map(marker => this.renderMarker(marker))}
      </Map>
    );
  }
}
