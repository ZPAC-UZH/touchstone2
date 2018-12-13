import PropTypes from 'prop-types';
import React from 'react';
import connect from 'react-redux/es/connect/connect';

import {insertText} from './TextLoader';


class Help extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    helpType: PropTypes.string,
  };

  render() {
    const {helpType} = this.props;
    return (
      <>
        {insertText(helpType)}
      </>
    );
  }
}


/**
 * map State to Props
 * @param {object} state
 * @return {{blockly: *}}
 */
function mapStateToProps(state: Object) {
  return {
    helpType: state.designs.helpTypeOfClickedDesign,
  };
}

export default connect(mapStateToProps)(Help);
