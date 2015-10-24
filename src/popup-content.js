import React from 'react';

export default class PopupContent extends React.Component {

  state = {countArray: [1]}

  render() {
    const {countArray} = this.state;
    return (
      <div className="popup-container">
        pop pop huzzah!
        {countArray.map((count, index) => (
          <div key={index}>
            <button onClick={() => this.setState({countArray: [...countArray, 1]})}>hit me</button>
          </div>
        ))}
      </div>
    );
  }
}
