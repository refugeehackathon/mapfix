import React from 'react';

export default class MyComponent extends React.Component {

  static propTypes = {
    initialCount: React.PropTypes.number,
  };

  static defaultProps = {initialCount: 0}

  state = {count: this.props.initialCount}

  handleClick() {
    this.setState({count: this.state.count + 1});
  }

  render() {
    return (
      <div>
        <div>Clicks: {this.state.count}</div>
        <button onClick={::this.handleClick}>Add 1</button>
      </div>
    );
  }
}
