import config from 'config';
import PropTypes from 'prop-types';
import React from 'react';
import SVG from 'react-inlinesvg';

const Logo = ({file}) => (
  <div className="app__logo">
    <SVG src={require(`assets/media/brand/${file}.svg`)}>
      <img src={require(`assets/media/brand/${file}.png`)} alt={config.title}/>
    </SVG>
  </div>
);

Logo.propTypes = {
  file: PropTypes.string,
};

Logo.defaultProps = {
  file: 'touchstone-horiz',
};

export default Logo;
