import PropTypes from 'prop-types';
import React from 'react';
import TrialEntry from './TrialEntry';

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

  extractEntry() {
    const {row, fishEyeMode} = this.props;
    return row.map((item, index) => (
      <div
        className={this.backgroundColor(index, item)}
        onClick={() => this.highlightClassNames(item)}
        key={`column${item}${index}`}
      >
        <TrialEntry key={`index${item}${index}`} fishEyeMode={fishEyeMode}>{index + 1 + this.props.trialIdStart}</TrialEntry>
        <TrialEntry key={`item${index}${item}`} fishEyeMode={fishEyeMode}>{item}</TrialEntry>
      </div>
    ));
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
  row: PropTypes.array,
  trialIdStart: PropTypes.number,
  fishEyeMode: PropTypes.bool,
};


export default TrialColumn;
