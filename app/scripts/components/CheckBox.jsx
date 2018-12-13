import PropTypes from 'prop-types';
import React from 'react';

const CheckBox = ({
  text,
  value,
  name,
  disabled,
  checked,
  onChange,
  divClassNameDefault,
  divClassName,
  inputClassNameDefault,
  inputClassName,
}) => {
  const classNameDiv = [divClassNameDefault, ...divClassName].join(' ');
  const classNameInput = [inputClassNameDefault, ...inputClassName].join(' ');

  return (
    <div className={classNameDiv}>
      <label>
        <input
          type="checkbox"
          name={name}
          value={value}
          onChange={onChange}
          className={classNameInput}
          checked={checked}
          disabled={disabled}
        />
        {text}
      </label>
    </div>
  );
};


CheckBox.propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  divClassName: PropTypes.array,
  divClassNameDefault: PropTypes.string,
  inputClassName: PropTypes.array,
  inputClassNameDefault: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  text: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

CheckBox.defaultProps = {
  divClassNameDefault: 'radio-button-container',
  divClassName: [],
  inputClassNameDefault: '',
  inputClassName: [],
  checked: false,
};

export default CheckBox;
