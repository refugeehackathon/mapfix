import React from 'react';
import {DragSource as dragSource} from 'react-dnd';
import categories from './categories.js';
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
    const {connectDragSource, description} = this.props;

    return connectDragSource(
      <div className="sidebar-category-container">
        <img className="sidebar-category-icon" src={require('./icons/' + description.icon)}/>
      </div>
    );
  }
}


export default class Sidebar extends React.Component {

  static propTypes = {};

  render() {
    return (
      <div className="sidebar-container">
        <div className="sidebar-contents">
          {Object.keys(categories).map(catName => <CategoryIcon key={catName} type={catName} description={categories[catName]}/>)}
        </div>
      </div>
    );
  }
}
