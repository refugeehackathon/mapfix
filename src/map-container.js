import React from 'react';
import Mapper from './mapper';
import Leaflet from 'leaflet';
import {DropTarget as dropTarget} from 'react-dnd';

import './map-container.css';

const DEFAULT_ICON = Leaflet.icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconSize: [25, 41],
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  shadowRetinaUrl: require('leaflet/dist/images/marker-shadow.png'),
  shadowSize: [41, 41],
});

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

@dropTarget('CategoryIcon', cardTarget, (connect) => ({
  connectDropTarget: connect.dropTarget(),
}))

export default class MapContainer extends React.Component {

  static propTypes = {
    connectDropTarget: React.PropTypes.func.isRequired,
  };

  state = {
    markers: [
      [51.505, -0.09],
      [52.51, 13.37],
    ],
  }

  componentDidMount() {
    const node = React.findDOMNode(this);
    this.map = new Mapper(node);
    this.setMarkers();

    this.map.on('click', this.handleMapClick);

    dropListener.listener = ({type, x, y}) => {
      this.justDroppedType = type;
      const evt = new MouseEvent('click', {clientX: x, clientY: y});
      evt._simulated = true; // don't ask. Just believe me, it's necessary...
      React.findDOMNode(this).dispatchEvent(evt);
    };
  }

  componentDidUpdate() {
    this.setMarkers();
  }

  setMarkers() {
    if (this.markers) this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = this.state.markers.map(pos => Leaflet.marker(pos, {icon: DEFAULT_ICON}).addTo(this.map));
  }

  handleMapClick = event => {
    if (!this.justDroppedType) return; // it has been a normal click, not a synthetic one
    this.justDroppedType = null;
    this.setState({markers: [...this.state.markers, event.latlng]});
  }

  render() {
    const {connectDropTarget} = this.props;

    return connectDropTarget(
      <div className="map-container"/>
    );
  }
}
