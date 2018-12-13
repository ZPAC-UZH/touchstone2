import PropTypes from 'prop-types';
import React from 'react';
import {Route} from 'react-router-dom';

const RoutePublic = ({component: Component, ...rest}) => (
  <Route
    {...rest}
    render={props => <Component {...props} />}
  />
);

RoutePublic.propTypes = {
  component: PropTypes.func.isRequired,
};

RoutePublic.defaultProps = {};

export default RoutePublic;
