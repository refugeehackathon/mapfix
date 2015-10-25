import React from 'react';
import {Map, Marker, TileLayer} from 'react-leaflet';
import Leaflet from 'leaflet';
import {DropTarget as dropTarget} from 'react-dnd';
import PopupContent from './popup-content';

import './map-container.css';
import 'leaflet.locatecontrol';

class DropListener {
  listener = null;

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
    Leaflet.control.locate().addTo(this.refs.map.getLeafletElement());
    dropListener.listener = ({type, x, y}) => {
      this.justDroppedType = type;
      const evt = new MouseEvent('click', {clientX: x, clientY: y});
      evt._simulated = true; // don't ask. Just believe me, it's necessary...
      React.findDOMNode(this.refs.map).dispatchEvent(evt);
    };
  }

  componentDidUpdate() {
    const {openMarkerId} = this.state;
    if (this.lastOpenMarkerId === openMarkerId) return;
    this.unmountCurrentPopup();
    if (openMarkerId) {
      this.refs[`marker-${openMarkerId}`].getLeafletElement().bindPopup("<div id='popup'/>").openPopup();
      this.openPopupNode = document.getElementById('popup');
      React.render(<PopupContent markerId={openMarkerId}/>, this.openPopupNode);
    }
    this.lastOpenMarkerId = openMarkerId;
  }

  unmountCurrentPopup() {
    if (this.lastOpenMarkerId && this.openPopupNode) {
      React.unmountComponentAtNode(this.openPopupNode);
      this.refs[`marker-${this.lastOpenMarkerId}`].getLeafletElement().unbindPopup();
      this.openPopupNode = null;
    }
  }

  handlePopupClose = () => {
    this.unmountCurrentPopup();
  }

  handleMapClick = event => {
    if (!this.justDroppedType) return; // it has been a normal click, not a synthetic one
    this.setState({markers: [...this.state.markers, {id: nextMarkerId, latlng: event.latlng, type: this.justDroppedType}], openMarkerId: nextMarkerId});
    this.justDroppedType = null;
    nextMarkerId += 1;
  }

  handleMarkerDragEnd = (event, markerId) => {
    const {markers} = this.state;
    markers.find(marker => marker.id === markerId).latlng = event.target._latlng;
    this.setState({markers});
  }

  renderMarker(marker) {
    return (
      <Marker
        draggable
        position={marker.latlng}
        key={marker.id}
        ref={`marker-${marker.id}`}
        onLeafletClick={() => this.setState({openMarkerId: marker.id})}
        onLeafletDragend={(event) => this.handleMarkerDragEnd(event, marker.id)}
      />
    );
  }

  render() {
    const {connectDropTarget} = this.props;
    const {markers} = this.state;

    return connectDropTarget(
      <div className="map-container">
        <Map ref="map" className="map-content" center={[52.51, 13.37]} zoom={13} onLeafletClick={this.handleMapClick} onLeafletPopupclose={this.handlePopupClose}>
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
      </div>
    );
  }
}
