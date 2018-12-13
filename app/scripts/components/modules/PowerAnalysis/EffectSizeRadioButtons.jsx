import PropTypes from 'prop-types';
import React from 'react';
import connect from 'react-redux/es/connect/connect';
import RadioButton from '../../RadioButton';

class EffectSizeRadioButtons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.EFFECTSIZE_SWITCHER_NAME = 'EFFECTSIZE_SWITCHER_NAME';
    this.EFFECTSIZE_MODE_SMALL = 'EFFECTSIZE_MODE_SMALL';
    this.EFFECTSIZE_MODE_MEDIUM = 'EFFECTSIZE_MODE_MEDIUM';
    this.EFFECTSIZE_MODE_LARGE = 'EFFECTSIZE_MODE_LARGE';
    this.EFFECTSIZE_MODE_CUSTOM = 'EFFECTSIZE_MODE_CUSTOM';
  }

  handleEffectSizeSwitcher(e) {
    const effectSizeMode = e.target.value;
    this.setState(state => ({
      ...state,
      effectSizeMode,
    }));

    const {updateEffectSize} = this.props;
    switch (effectSizeMode) {
      case this.EFFECTSIZE_MODE_SMALL:
        updateEffectSize(0.15);
        break;
      case this.EFFECTSIZE_MODE_MEDIUM:
        updateEffectSize(0.25);
        break;
      case this.EFFECTSIZE_MODE_LARGE:
        updateEffectSize(0.4);
        break;
      default:
        // CUSTOM
        console.log('custom');
    }
  }

  getRadioButtons() {
    const {effectSizeMode} = this.props;
    return <div>
      <RadioButton
        text={'small (0.15)'} value={this.EFFECTSIZE_MODE_SMALL}
        onChange={e => this.handleEffectSizeSwitcher(e)}
        name={this.EFFECTSIZE_SWITCHER_NAME}
        checked={effectSizeMode === this.EFFECTSIZE_MODE_SMALL}
      />
      <RadioButton
        text={'medium (0.25)'} value={this.EFFECTSIZE_MODE_MEDIUM}
        onChange={e => this.handleEffectSizeSwitcher(e)}
        name={this.EFFECTSIZE_SWITCHER_NAME}
        checked={effectSizeMode === this.EFFECTSIZE_MODE_MEDIUM}
      />
      <RadioButton
        text={'large (0.4)'} value={this.EFFECTSIZE_MODE_LARGE}
        onChange={e => this.handleEffectSizeSwitcher(e)}
        name={this.EFFECTSIZE_SWITCHER_NAME}
        checked={effectSizeMode === this.EFFECTSIZE_MODE_LARGE}
      />
      <RadioButton
        text={'calculate from the means of the dependent variables'}
        value={this.EFFECTSIZE_MODE_CUSTOM}
        disabled={true}
        onChange={e => this.handleEffectSizeSwitcher(e)}
        name={this.EFFECTSIZE_SWITCHER_NAME}
        checked={effectSizeMode === this.EFFECTSIZE_MODE_CUSTOM}
      />
    </div>;
  }

  render() {
    const radioButtons = this.getRadioButtons();
    return (
      <>
        {radioButtons}
      </>
    );
  }
}

EffectSizeRadioButtons.propTypes = {
  effectSizeMode: PropTypes.string,
  updateEffectSize: PropTypes.func.isRequired,
};

function mapStateToProps(state: Object) {
  return {};
}

export default connect(mapStateToProps)(EffectSizeRadioButtons);
