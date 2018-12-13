import PropTypes from 'prop-types';
import React from 'react';

const Button = ({text, onChange, defaultClassDiv, additionalClassBackground, defaultClassNameText, additionalClassNameText}) => {
  const classNameBackground = [defaultClassDiv, ...additionalClassBackground].join(' ');
  const classNameText = [defaultClassNameText, ...additionalClassNameText].join(' ');

  return (
    <button className={classNameBackground} type="button" onClick={onChange}>
      <div className={classNameText}>{text}</div>
    </button>
  );
};


Button.propTypes = {
  additionalClassBackground: PropTypes.array,
  additionalClassNameText: PropTypes.array,
  defaultClassDiv: PropTypes.string,
  defaultClassNameText: PropTypes.string,
  onChange: PropTypes.func,
  text: PropTypes.string,
};

Button.defaultProps = {
  text: '',
  defaultClassDiv: 'button__background',
  additionalClassBackground: [],
  defaultClassNameText: 'button__text',
  additionalClassNameText: [],
};

export default Button;
