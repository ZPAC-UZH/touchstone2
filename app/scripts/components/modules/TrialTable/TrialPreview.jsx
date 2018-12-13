import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import TrialColumn from './TrialColumn';

/**
 * Visual representation of the trialTable
 */
class TrialPreview extends React.PureComponent {
  static propTypes = {
    design: PropTypes.object,
  };


  /**
   * Extract each participant
   * @param {array} trialTable
   * @param {string} designName
   * @return {*}
   */
  extractParticipant(trialTable, designName) {
    if (trialTable) {
      return trialTable.map((item, index) => {
        if (index === 0) {
          return (
            <div className="trial-table__preview" key={item + index}>
              <div className="trial-table__subheader">Design: {designName}
                <TrialColumn
                  row={item}
                  trialIdStart={index * item.length}
                  additionalClasses="trial-table__column-preview"
                  fishEyeMode={true}
                />
              </div>
            </div>
          );
        }
      });
    }
  }


  /**
   * Render function of react
   * @return {*}
   */
  render() {
    const {trialTable, designName} = this.props.design || [];
    return (
      <div className="trial-table__preview-container">
        {this.extractParticipant(trialTable, designName)}
      </div>
    );
  }
}

/**
 * Map state to props
 * @param {object} state
 * @return {{trialtable: *}}
 */
function mapStateToProps(state) {
  return {
    design: state.designs.clickedDesign,
  };
}

export default connect(mapStateToProps)(TrialPreview);
