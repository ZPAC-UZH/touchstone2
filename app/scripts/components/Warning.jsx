import React from 'react';
import PropTypes from 'prop-types';

const Warning = ({value}) => {
  if (value) {
    return <div className={'warning'}>
      <div className="warning__text">
        <i className="fa fa-warning" /> {value}</div>
    </div>;
  }
  else {
    return <></>;
  }
};


Warning.propTypes = {
  value: PropTypes.string,
};

export default Warning;
