import PropTypes from 'prop-types';
import React from 'react';

const TitlePane = ({title, children, defaultClassBackground, additionalClassBackground, defaultClassNameText, additionalClassNameText, defaultControlButtonClassNameText, additionalControlButtonClassNameText}) => {
  const classNameBackground = [defaultClassBackground, ...additionalClassBackground].join(' ');
  const classNameText = [defaultClassNameText, ...additionalClassNameText].join(' ');
  const classNameControlButtons = [defaultControlButtonClassNameText, ...additionalControlButtonClassNameText.join(' ')];

  return (
    <div className={classNameBackground}>
      <p className={classNameText}>{title}</p>
      <div className={classNameControlButtons}>
        {children}
      </div>
    </div>
  );
};


TitlePane.propTypes = {
  additionalClassBackground: PropTypes.array,
  additionalClassNameText: PropTypes.array,
  additionalControlButtonClassNameText: PropTypes.array,
  children: PropTypes.any,
  defaultClassBackground: PropTypes.string,
  defaultClassNameText: PropTypes.string,
  defaultControlButtonClassNameText: PropTypes.string,
  title: PropTypes.any,
};

TitlePane.defaultProps = {
  title: 'default',
  defaultClassBackground: 'title-pane',
  additionalClassBackground: [],
  defaultClassNameText: 'title-pane__text',
  additionalClassNameText: [],
  defaultControlButtonClassNameText: 'title-pane__control-buttons',
  additionalControlButtonClassNameText: [],
};

export default TitlePane;
