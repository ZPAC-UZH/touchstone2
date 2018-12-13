import React, {Component} from 'react';


class Toolbar extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {};


  render() {
    return (
      <div className='toolbar'>
        <div className="toolbar__border">
          <a href="/compare">
            <div className="toolbar__element toolbar__element--eye"/>
          </a>
          <a href="/history">
            <div className="toolbar__element icon icon__history"/>
          </a>
          <div className="toolbar__element toolbar__element--layers"/>
          <div className="toolbar__element toolbar__element--layers"/>
        </div>
      </div>
    );
  }
}


export default Toolbar;
