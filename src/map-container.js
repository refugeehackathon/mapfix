import React from 'react';
import {Map, Marker, TileLayer} from 'react-leaflet';
import Leaflet from 'leaflet';
import {DropTarget as dropTarget} from 'react-dnd';
import PopupContent from './popup-content';
import categories from './categories.js';
import i18n from './i18n.js';

import './map-container.css';
import 'leaflet.locatecontrol';

const iconToCategory = Object.keys(categories).reduce(
  (memo, catName) => {
    const description = categories[catName];
    memo[catName] = Leaflet.icon({
      iconUrl: require('./icons/' + description.icon),
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -50],
    });
    return memo;
  },
  {}
);

class DropListener {
  listener = null;

  justDropped({type, x, y}) {
    if (this.listener) this.listener({type, x, y});
  }
}

const dropListener = new DropListener();

const cardTarget = {
  drop(props, monitor) {
    const {type, width, height} = monitor.getItem();
    const {x, y} = monitor.getSourceClientOffset();
    dropListener.justDropped({type, x: x + width / 2 + 2, y: y + height - 5});
  },
};

let nextMarkerId = 2;
let userLanguage = window.navigator.languages ? window.navigator.languages[0] : null;
userLanguage = userLanguage || window.navigator.language || window.navigator.browserLanguage || window.navigator.userLanguage;
if (userLanguage.indexOf('-') !== -1) {
  userLanguage = userLanguage.split('-')[0];
}
if (userLanguage.indexOf('_') !== -1) {
  userLanguage = userLanguage.split('_')[0];
}

@dropTarget('CategoryIcon', cardTarget, (connect) => ({
  connectDropTarget: connect.dropTarget(),
}))

export default class MapContainer extends React.Component {

  static propTypes = {
    connectDropTarget: React.PropTypes.func.isRequired,
    markers: React.PropTypes.array.isRequired,
    onMarkersChange: React.PropTypes.func.isRequired,
  };

  state = {
    openMarkerId: null,
  }

  componentDidMount() {
    const locateMeStringRoot = i18n.leaflet.locateme;
    const locateMeString = locateMeStringRoot.hasOwnProperty(userLanguage) ? locateMeStringRoot[userLanguage] : locateMeStringRoot.en;
    Leaflet.control.locate({strings: { title: locateMeString}}).addTo(this.refs.map.getLeafletElement());
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
    this.props.onMarkersChange([...this.props.markers, {id: nextMarkerId, latlng: event.latlng, type: this.justDroppedType}]);
    this.setState({openMarkerId: nextMarkerId});
    this.justDroppedType = null;
    nextMarkerId += 1;
  }

  handleMarkerDragEnd = (event, markerId) => {
    const {markers} = this.props;
    markers.find(marker => marker.id === markerId).latlng = event.target._latlng;
    this.props.onMarkersChange(markers);
  }

  renderMarker(marker) {
    return (
      <Marker
        icon={iconToCategory[marker.type]}
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
    const {connectDropTarget, markers} = this.props;

    return connectDropTarget(
      <div className="map-container">
        <Map ref="map" className="map-content" center={[53.1806048, 13.1300446]} zoom={13} onLeafletClick={this.handleMapClick} onLeafletPopupclose={this.handlePopupClose}>
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
