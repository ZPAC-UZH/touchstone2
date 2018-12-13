import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import Header from '../components/Header';
import {BlocklyWrapper} from '../components/modules/Blockly';
import {TrialTable} from '../components/modules/TrialTable';
import Sidebar from '../components/Sidebar';
import Warning from '../components/Warning';


export class Index extends React.PureComponent {
  render() {
    const {warning} = this.props;

    return (
      <>
        <Header/>

        <div className="app-container">
          <div className="index">
            <BlocklyWrapper/>
            <Sidebar/>
          </div>
          <Warning
            value={warning}
          />
          <TrialTable/>
        </div>
      </>
    );
  }
}

Index.propTypes = {
  warning: PropTypes.string,
};

/**
 * map State to Props
 * @param {object} state
 * @return {{designs: *}}
 */
function mapStateToProps(state: Object) {
  return {
    warning: state.error.warning,
  };
}

export default connect(mapStateToProps)(Index);
