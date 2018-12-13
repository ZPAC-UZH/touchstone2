import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {
  setForceUpdate,
  updateTSLData,
  updateWorkspace,
} from '../../../store/designs/DesignsAction';
import {sendXML} from '../../../store/history/HistoryAction';
import BlocklyDrawer from './BlocklyDrawer';

/**
 * Visual representation of the trialTable
 */
class BlocklyWrappper extends React.PureComponent {
  static propTypes = {
    designData: PropTypes.any,
    designs: PropTypes.any,
    dispatch: PropTypes.func,
    forceUpdateProps: PropTypes.bool,

    // Props passed down from parent
    injectOptions: PropTypes.object,
    nonUpdating: PropTypes.bool,
    workspace: PropTypes.any,
    workspaceStyle: PropTypes.object,
    workspaceXML: PropTypes.string,
  };


  /**
   * Render function of react
   * @return {*}
   */
  render() {
    const {dispatch, workspace, designData, workspaceStyle, workspaceXML, designs, injectOptions, nonUpdating, forceUpdateProps, workingMode} = this.props;
    return (
      <div className="index__blockly-workspace">
        <BlocklyDrawer
          dispatch={dispatch}
          style={(workspaceStyle) ? workspaceStyle : workspace.style}
          tools={workspace.tools}
          rawTsl={workspace.rawTsl}
          playground={workspace.playground}
          forceUpdate={(forceUpdateProps) ? forceUpdateProps : designs.forceUpdate}
          forceUpdateCB={() => {
            if (!nonUpdating) {
              dispatch(setForceUpdate(false));
            }
          }}
          designData={designData}
          getWorkspaceChange={(xml) => {
            // dispatch(sendXML(xml));
          }}

          toolbox={workspace.toolbox}
          workspaceXML={(workspaceXML) ? workspaceXML : designs.workspaceXML}

          injectOptions={(injectOptions) ? injectOptions : workspace.injectOptions}
          appearance={workspace.appearance}

          onCodeChange={(code) => {
            if (!nonUpdating) {
              dispatch(updateTSLData(code));
            }
          }}
          onXmlChange={(workspace) => {
            if (!nonUpdating) {
              dispatch(updateWorkspace(workspace));
            }
          }}

          onUpdate={() => 'variable that could update'}
          workingMode={workingMode}
        />
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
    designs: state.designs,
    workspace: state.workspace,
    designData: state.designs.designData,
    workingMode: state.app.workingMode,
  };
}

export default connect(mapStateToProps)(BlocklyWrappper);
