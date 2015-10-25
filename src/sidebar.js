import React from 'react';
import {DragSource as dragSource} from 'react-dnd';

import './sidebar.css';

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
    const {connectDragSource, type} = this.props;

    return connectDragSource(
      <div className="sidebar-category-container">{type}</div>
    );
  }
}


export default class Sidebar extends React.Component {

  static propTypes = {};

  render() {
    return (
      <div className="sidebar-container">
        <div className="sidebar-contents">
          <CategoryIcon type="health"/>
          <CategoryIcon type="fun"/>
          <CategoryIcon type="family"/>
          <CategoryIcon type="hot spot"/>
          <CategoryIcon type="food"/>
          <CategoryIcon type="fun"/>
          <CategoryIcon type="shopping"/>
          <CategoryIcon type="pets"/>
          <CategoryIcon type="mobility"/>
        </div>
      </div>
    );
  }
}
