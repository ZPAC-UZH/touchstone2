import PropTypes from 'prop-types';
import React from 'react';

/**
 * Visual of the row of a Trial Table
 */
class TrialEntry extends React.PureComponent {
  static propTypes = {};

  /**
   * Builds classname for row
   * @return {*}
   */
  buildClassName() {
    const {fishEyeMode, classNameEntry, classNameEntryFisheye, children} = this.props;

    if (fishEyeMode) {
      return `${classNameEntryFisheye} trial-table__${children}`;
    }
    else {
      return `${classNameEntry} trial-table__${children}`;
    }
  }


  /**
   * Highlights the Classnames
   */
  highlightClassNames(e) {
    const {children} = this.props;
    e.stopPropagation();
    [...document.querySelectorAll(`.trial-table__${children}`)].forEach(item => {
      item.classList.toggle('trial-table__selected');
    });
  }

  /**
   * Render function of react,
   * @return {*}
   */
  render() {
    const {children, fishEyeMode} = this.props;
    if (!(children instanceof Array)) {
      return (
        <div
          className={this.buildClassName()}
          onClick={(e) => this.highlightClassNames(e)}
        >
          {children}
        </div>
      );
    }
    else {
      return children.map((item, index) => <TrialEntry key={`${item}${index}`} fishEyeMode={fishEyeMode}>{item}</TrialEntry>);
    }
  }
}

TrialEntry.defaultProps = {
  classNameEntry: 'trial-table__entry',
  classNameEntryFisheye: 'trial-table__entry--fisheye',
};

TrialEntry.propTypes = {
  children: PropTypes.any,
  classNameEntry: PropTypes.string,
  classNameEntryFisheye: PropTypes.string,
  fishEyeMode: PropTypes.bool,
};


export default TrialEntry;
