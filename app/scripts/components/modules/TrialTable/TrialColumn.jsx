import PropTypes from 'prop-types';
import React from 'react';
import TrialEntry from './TrialEntry';
import {setHover} from '../../../store/trialTable/TrialTableAction';
import {connect} from 'react-redux';
import {throttle} from 'throttle-debounce';
import {calculatePowerMargin} from '../../../store/power/PowerAction';

/**
 * Visual of the row of a Trial Table
 */
class TrialColumn extends React.PureComponent {
  /**
   * Builds classname for row
   * @return {*}
   */
  buildClassName() {
    const {classNameRow, additionalClasses} = this.props;

    return `${classNameRow} ${additionalClasses}`;
  }

  /**
   * Modulo check if grey background needed
   * @param {number} index
   * @param {object} item
   * @return {string}
   */
  backgroundColor(index, item) {
    const jsModif = item.reduce((accu, curr) => accu + curr);
    return (index % 2 === 0) ? `trial-table__row trial-table__js${jsModif}` : `trial-table__row trial-table__row--grey trial-table__js${jsModif}`;
  }

  /**
   * Do highlighting toggle
   * @param {number} item
   */
  highlightClassNames(item) {
    const jsModif = item.reduce((accu, curr) => accu + curr);
    [...document.querySelectorAll(`.trial-table__js${jsModif}`)].forEach(item => {
      item.classList.toggle('trial-table__selected');
    });
  }

  getFontSize(idx, hoverIdx) {
    return 2 - Math.abs(idx-hoverIdx) * 0.2;
  }

  dispatchSetHover(designId, index) {
    const {dispatch, hover} = this.props;
    const {designId: hDesignId, rowIdx: hIndex} = hover;
    if (designId !== hDesignId || index !== hIndex) {
      dispatch(setHover(designId, index));
    }
  }

  extractEntry() {
    const {row, fishEyeMode, designId, dispatch, hover} = this.props;

    return row.map((item, index) => {
      let style = {
      };

      if (!fishEyeMode && designId === hover.designId && Math.abs(index - hover.rowIdx) < 4) {
        style = {
          fontSize: `${this.getFontSize(index, hover.rowIdx)}rem`,
        };
      }

      return (
        <div
          className={this.backgroundColor(index, item)}
          onClick={() => this.highlightClassNames(item)}
          onMouseOver={() => this.dispatchSetHover(designId, index)}
          onMouseLeave={() => dispatch(setHover('', 0))}
          key={`column${item}${index}`}
        >
          <TrialEntry key={`index${item}${index}`} style={style} fishEyeMode={fishEyeMode}>{index + 1 + this.props.trialIdStart}</TrialEntry>
          <TrialEntry key={`item${index}${item}`} style={style} fishEyeMode={fishEyeMode}>{item}</TrialEntry>
        </div>
      );
    });
  }

  /**
   * Render function of react
   * @return {*}
   */
  render() {
    return (
      <div className={this.buildClassName()}>
        {this.extractEntry()}
      </div>
    );
  }
}

TrialColumn.defaultProps = {
  classNameRow: 'trial-table__column',
  additionalClasses: '',
};

TrialColumn.propTypes = {
  additionalClasses: PropTypes.string,
  classNameRow: PropTypes.string,
  designId: PropTypes.string,
  dispatch: PropTypes.func,
  fishEyeMode: PropTypes.bool,
  hover: PropTypes.object,
  row: PropTypes.array,
  trialIdStart: PropTypes.number,
};


function mapStateToProps(state) {
  return {
    hover: state.trialtable.hover,
  };
}

export default connect(mapStateToProps)(TrialColumn);
