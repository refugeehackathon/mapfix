import React from 'react';
import categories from './categories.js';
import './legend.css';

export default class Legend extends React.Component {

  static propTypes = {
    markers: React.PropTypes.array.isRequired,
  };

  render() {
    const existing = new Set(this.props.markers.map(marker => marker.type));

    if (existing.size === 0) return null;

    return (
      <div className="legend-container">
        {Object.keys(categories).filter(catName => existing.has(catName)).map(catName => {
          const description = categories[catName];
          return (
            <div className="legend-entry" key={catName}>
              <img className="sidebar-category-icon" src={require('./icons/' + description.icon)}/>
              <div className="legend-description-list">
                {Object.keys(description.name).map(lang => (
                  <div key={lang} className="legend-description">{description.name[lang]}</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
