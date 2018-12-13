import PropTypes from 'prop-types';
import React from 'react';
import connect from 'react-redux/es/connect/connect';
import {TitleTexts} from '../constants/index';
import Help from './Help';
import TitlePane from './TitlePane';
import BasicChart from './modules/PowerAnalysis/BasicChart';
import TrialPreview from './modules/TrialTable/TrialPreview';
import {
  WORKING_MODE_POWER_ANALYSIS,
  WORKING_MODE_STANDARD,
} from '../store/app/workingModeConfigurations';

class Sidebar extends React.PureComponent {
  render() {
    const {workingMode} = this.props;

    /**
     * Sidebar Components that dynamically can be loaded in
     * @type {{TrialPreview, BasicChart, Help}}
     */
    const components = {
      TrialPreview,
      BasicChart,
      Help,
    };

    let sidebar = [];

    switch (workingMode) {
      case (WORKING_MODE_POWER_ANALYSIS):
        sidebar = ['BasicChart'];
        break;
      case (WORKING_MODE_STANDARD):
        sidebar = ['TrialPreview', 'Help', 'BasicChart'];
        break;
    }

    return (
      <div className="index__sidebar">
        {
          sidebar.map(item => {
            const SidebarElement = components[item];
            return (
              <div key={item} className="index__sidebar-element">
                <TitlePane title={TitleTexts[item]}/>
                <div className="index__sidebar-content">
                  <SidebarElement/>
                </div>
              </div>
            );
          })
        }
      </div>

    );
  }
}

Sidebar.propTypes = {
  workingMode: PropTypes.string,
};

function mapStateToProps(state: Object) {
  return {
    workingMode: state.app.workingMode,
  };
}

export default connect(mapStateToProps)(Sidebar);
