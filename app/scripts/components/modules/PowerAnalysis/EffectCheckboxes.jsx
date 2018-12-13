import PropTypes from 'prop-types';
import React from 'react';
import connect from 'react-redux/es/connect/connect';
import CheckBox from '../../CheckBox';
import MeasurementsTable from './MeasurementsTable';

class EffectCheckboxes extends React.Component {
  constructor(props) {
    super(props);

    const activeEffects = this.defaultActiveEffects();
    this.state = {
      activeEffects,
      clickedDesignId: this.props.clickedDesign.designId,
    };
  }

  componentDidUpdate() {
    this.resetActiveEffectsOnDesignSwitch();
  }

  resetActiveEffectsOnDesignSwitch() {
    const {designId: newDesignId} = this.props.clickedDesign;
    const {clickedDesignId: currentDesignId} = this.state;
    if (newDesignId !== currentDesignId) {
      const activeEffects = this.defaultActiveEffects();
      this.setState(state => ({
        ...state,
        clickedDesignId: newDesignId,
        activeEffects,
      }));
    }
  }

  handleCheckboxSwitcher(e) {
    let {activeEffects} = this.state;
    const {value: selection} = e.target;
    if (activeEffects.includes(selection)) {
      activeEffects.splice(activeEffects.indexOf(selection), 1);
    }
    else {
      activeEffects = [...activeEffects, selection];
    }
    this.setState(state => ({
      ...state,
      activeEffects,
    }));
  }

  defaultActiveEffects() {
    const {clickedDesign} = this.props;
    const {variables} = clickedDesign;
    const activeEffects = [];
    variables.forEach(block => {
      block.forEach(iv => {
        activeEffects.push(iv.name);
      });
    });
    return activeEffects;
  }

  getCheckboxes() {
    let checkboxes = [];
    const {clickedDesign} = this.props;
    const {variables} = clickedDesign;
    const {activeEffects} = this.state;
    let variableNames = [];

    variables.forEach((block, blockIdx) => {
      block.forEach((iv, ivIdx) => {
        variableNames = [...variableNames, iv.name];
        const checkBox = <CheckBox
          key={`${blockIdx.toString()}--${ivIdx.toString()}`}
          text={iv.name} value={iv.name}
          name={'effects'}
          checked={activeEffects.includes(iv.name)}
          onChange={e => this.handleCheckboxSwitcher(e)}
        />;
        checkboxes = [...checkboxes, checkBox];
      });
    });

    return checkboxes;
  }

  render() {
    const {clickedDesign, updateEffectSize} = this.props;

    const checkboxes = this.getCheckboxes();
    let measurementsTable;
    if (clickedDesign.trialTable) {
      const [ttParticipantOne] = clickedDesign.trialTable; // pass first participant to measurements table
      const {activeEffects} = this.state;

      measurementsTable = <MeasurementsTable
        clickedDesignId={clickedDesign.designId}
        clickedDesign={clickedDesign}
        variables={clickedDesign.variables}
        trialTable={ttParticipantOne}
        activeEffects={activeEffects}
        callback={updateEffectSize}
      />;
    }
    return (
      <>
        {checkboxes}
        {measurementsTable}
      </>
    );
  }
}

EffectCheckboxes.propTypes = {
  clickedDesign: PropTypes.any,
  updateEffectSize: PropTypes.func,
};

function mapStateToProps(state: Object) {
  return {};
}

export default connect(mapStateToProps)(EffectCheckboxes);
