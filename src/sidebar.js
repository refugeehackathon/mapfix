import React from 'react';
import {DragSource as dragSource} from 'react-dnd';

const cardSource = {
  beginDrag(props) {
    return {type: props.type};
  },
};

@dragSource('CategoryIcon', cardSource, (connect) => ({
  connectDragSource: connect.dragSource(),
}))
class CategoryIcon {

  static propTypes = {
    type: React.PropTypes.string.isRequired,
  }

  render() {
    const {connectDragSource} = this.props;

    return connectDragSource(
      <div>Drag Me</div>
    );
  }
}


export default class Sidebar extends React.Component {

  static propTypes = {};

  render() {
    return (
      <div className="sidebar-container">
        <CategoryIcon type="fun"/>
      </div>
    );
  }
}
