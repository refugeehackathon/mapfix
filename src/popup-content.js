import React from 'react';

export default class PopupContent extends React.Component {

  static propTypes = {
    onClose: React.PropTypes.func.isRequired,
  };

  render() {
    return (
      <div className="popup-container">
          <div>
            <img src={require('./icons/placeholder-150x93.jpg')}/><br />
            <input id="popup-input" type="text" name="name" />&nbsp;
            <button onClick={() => this.props.onClose()}>:-)</button>
          </div>
      </div>
    );
  }
}
