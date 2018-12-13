import PropTypes from 'prop-types';
import {
  experimentalBlockBrick,
  experimentalDesignBrick,
  independentVariableBrick,
  levelBrick,
} from '../../components/modules/Blockly/blocks';
import {workinput} from '../../constants';
import boxOfTools from './lib/toolbox';

const style = {
  height: {
    height: '100%',
  },
  wrapper: {
    minHeight: '89vh',
    width: '69vw',
    position: 'relative',
  },
  content: {
    position: 'absolute',
  },
};

export const compareStyle = {
  height: {
    height: '100%',
  },
  wrapper: {
    minHeight: '550px',
    width: '450px',
    position: 'relative',
  },
  content: {
    position: 'absolute',
  },
};
export const compareOptions = {
  horizontalLayout: true,
  sounds: false,
  zoom: {
    controls: true,
    wheel: false,
    startScale: 0.75,
    maxScale: 3,
    minScale: 0.3,
    scaleSpeed: 1.2,
  },
  trashcan: false,
};
const initOptiStyle = {
  height: {
    height: '100%',
  },
  wrapper: {
    minHeight: '80vh',
    width: '50vw',
    position: 'relative',
  },
  content: {
    position: 'absolute',
  },
};

const injectOptions = {
  horizontalLayout: true,
  sounds: false,
  zoom: {
    controls: true,
    wheel: false,
    startScale: 1,
    maxScale: 3,
    minScale: 0.3,
    scaleSpeed: 1.2,
  },
};

const appearance =
  {
    categories: {
      'Add Brick': {
        colour: '270',
      },
    },
  };

const initialWorkspaceState = {
  tools: [experimentalDesignBrick,
    experimentalBlockBrick,
    independentVariableBrick,
    levelBrick],
  toolbox: boxOfTools.boxOfTools.template,
  playground: {},
  language: '',
  className: '',
  appearance,
  injectOptions,
  style,
  optiStyle: initOptiStyle,
  rawTsl: '',
};

const workspaceShape = {
  tools: PropTypes.array,
  toolbox: PropTypes.string,
  workspacePlayground: PropTypes.any,
  workspaceXML: workinput,
  language: PropTypes.any,
  className: PropTypes.any,
  appearance: PropTypes.any,
  injectOptions: PropTypes.any,
  style: PropTypes.any,
  rawTsl: PropTypes.string,
};

export {workspaceShape, initialWorkspaceState};
