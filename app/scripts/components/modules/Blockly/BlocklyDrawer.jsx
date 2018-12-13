import moment from 'moment';
import Blockly from 'node-blockly/browser';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {round} from '../../../constants/util';
import {clickOnBlock} from '../../../store/designs/DesignsAction';
import {checkComment} from './blocks';
import {WORKING_MODE_POWER_ANALYSIS} from '../../../store/app/workingModeConfigurations';
import {switchToWorkingMode} from '../../../store/app/AppActions';

class BlocklyDrawer extends Component {
  constructor(props) {
    super(props);
    this.wrapper = React.createRef();
    this.content = React.createRef();
    this.onResize = this.onResize.bind(this);
    const {tools} = this.props;
    this.initTools(tools);
  }


  componentDidMount() {
    const {injectOptions, toolbox, dispatch, workingMode} = this.props;

    window.addEventListener('resize', this.onResize, false);
    this.onResize();

    this.workspacePlayground = Blockly.inject(this.content.current, Object.assign({toolbox}, injectOptions));

    if (this.props.workspaceXML) {
      Blockly.Xml.domToWorkspace(
        Blockly.Xml.textToDom(this.props.workspaceXML),
        this.workspacePlayground,
      );

      if (workingMode === WORKING_MODE_POWER_ANALYSIS) {
        dispatch(switchToWorkingMode(WORKING_MODE_POWER_ANALYSIS));
      }
    }

    Blockly.svgResize(this.workspacePlayground);
    this.workspacePlayground.addChangeListener((e) => this.generateOutput(e));
  }


  /**
   * This lifecycle looks if the old and new state are different
   * Then it clears the lib and reloads with the props from the redux store
   * This allows to load dynamically new blocks from any new sources and display them in blockly
   * This method only works, because there exists the onCodeChange and OnXmlChange, without these 2
   * methods there would be a cycle of rerender and reupdate.
   * @param {object} prevProps
   */
  componentDidUpdate(prevProps) {
    // Compares the two workspaces and updates the lib when there is a change
    // There is also an external Variable that forces for a change
    const {forceUpdate, workspaceXML, forceUpdateCB, designData, style} = this.props;
    if (forceUpdate && prevProps.workspaceXML !== workspaceXML) {
      this.workspacePlayground.clear();
      Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(this.props.workspaceXML), this.workspacePlayground);
      // TODO: SET INDEPENDENT set forceupdate false
      forceUpdateCB();
    }

    if (JSON.stringify(prevProps.style) !== JSON.stringify(style)) {
      this.onResize();
    }

    if (designData) {
      // TODO: breaks when no design is in the workspace
      for (let i = 0; i < designData.length; i++) {
        const curDesign = designData[i];
        const designBrick = this.workspacePlayground.getBlockById(curDesign.designId);

        if (designBrick && curDesign && curDesign.multiple && curDesign.averageDuration && curDesign.interTrialTime) {
          // Set multiple number of participants based on counterbalancing
          const {multiple} = curDesign;
          if (designBrick && typeof designBrick.setFieldValue === 'function') {
            designBrick.setFieldValue(multiple, 'multipleCB');

            // Set order effect coverage
            const participants = parseInt(curDesign.numberOfParticipants);
            let orderEffectCoverage = 100;
            if (participants % multiple !== 0) {
              orderEffectCoverage = Math.round(round(participants % multiple / multiple, 2) * 100);
            }
            designBrick.setFieldValue(`${orderEffectCoverage}%`, 'orderEffectCoverage');

            // Set experiment duration
            const {averageDuration, interTrialTime, interBlockTime, variables} = curDesign;
            const [ttP1] = curDesign.trialTable;
            if (ttP1) {
              const seconds = ttP1.length * (averageDuration + interTrialTime) + interBlockTime * variables[0].length;
              const timeFormatted = moment('2015-01-01')
                .startOf('day')
                .seconds(seconds)
                .format('HH:mm:ss');
              designBrick.setFieldValue(timeFormatted, 'duration');
            }
          }
        }
      }
    }
  }


  /**
   * Cleanup
   */
  componentWillUnmount() {
    window.removeEventListener(
      'resize',
      this.onResize,
    );

    // this.workspacePlayground.removeChangeListener((e) => this.generateOutput(e));
  }

  generateOutput(e) {
    this.handleEventData(e);
    this.generateWorkspaceOutput();
  }

  handleEventData(e) {
    const {dispatch} = this.props;


    // Here we listen to a click on a block to then dispatch a onclick event
    if (e.element === 'click') {
      dispatch(clickOnBlock(e.blockId));
    }
  }

  generateWorkspaceOutput() {
    const {rawTsl, workspaceXML, getWorkspaceChange} = this.props;

    let code = this.props.language.workspaceToCode(this.workspacePlayground);
    code = checkComment(code);
    const xml = Blockly.Xml.workspaceToDom(this.workspacePlayground);
    const xmlText = Blockly.Xml.domToText(xml);

    if (getWorkspaceChange) {
      getWorkspaceChange(xmlText);
    }


    if (code !== rawTsl) {
      this.props.onCodeChange(code);
    }

    if (xmlText !== workspaceXML) {
      const workspaceOutput = {
        xmlText,
        designImages: [],
      };
      this.props.onXmlChange(workspaceOutput);
    }
  }

  initTools(tools) {
    tools.forEach((tool) => {
      Blockly.Blocks[tool.name] = tool.block;
      Blockly.JavaScript[tool.name] = tool.generator;
    });
  }

  onResize() {
    this.content.current.style.width = `${this.wrapper.current.offsetWidth}px`;
    this.content.current.style.height = `${this.wrapper.current.offsetHeight}px`;
  }

  render() {
    const {style, className} = this.props;
    const wrapperStyle = {...style.wrapper, ...style.height};

    return (
      <div
        className={className}
        style={wrapperStyle}
        ref={this.wrapper}
      >
        <div
          style={style.content}
          ref={this.content}
        />
      </div>
    );
  }
}

BlocklyDrawer.defaultProps = {
  onCodeChange: () => {
  },
  onXmlChange: () => {
  },
  onUpdate: () => {
  },
  language: Blockly.JavaScript,
  tools: [],
  workspaceXML: '',
  injectOptions: {},
  appearance: {},
  className: '',
  style: {},
  rawTsl: '',
  forceUpdate: false,
};

BlocklyDrawer.propTypes = {
  appearance: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  className: PropTypes.string,
  designData: PropTypes.any,
  dispatch: PropTypes.func,
  forceUpdate: PropTypes.bool,
  forceUpdateCB: PropTypes.func,
  getWorkspaceChange: PropTypes.func,
  injectOptions: PropTypes.object,
  language: PropTypes.object.isRequired,
  onCodeChange: PropTypes.func,
  onXmlChange: PropTypes.func,
  playground: PropTypes.object,
  rawTsl: PropTypes.string,
  style: PropTypes.object,
  toolbox: PropTypes.string,
  tools: PropTypes.arrayOf(PropTypes.shape({
    block: PropTypes.shape({init: PropTypes.func}),
    category: PropTypes.string,
    generator: PropTypes.func,
    name: PropTypes.string,
  })).isRequired,
  workingMode: PropTypes.string,
  workspaceXML: PropTypes.string,
};

export default BlocklyDrawer;
