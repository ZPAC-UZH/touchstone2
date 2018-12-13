import Blockly from 'node-blockly/browser';

/* Helper functions */

/**
 * Converts brick from statementToCode to string for TSL
 * @param {string} subBrickString - brick received from statementToCode
 * @param {string} concatString - concatenation string for the return String
 * @return {string}
 */
function convertSubBrickToString(subBrickString, concatString) {
  const levelsArr = subBrickString.split('\n')
    .map((item) => item.trim());

  levelsArr.splice(-1, 1); // Remove last element because it will be empty

  let levelsArrWithoutComments = [];
  levelsArr.forEach(item => {
    if (!item.includes('//')) {
      levelsArrWithoutComments = [...levelsArrWithoutComments, item];
    }
  });

  let ret = '';
  for (let i = 0; i < levelsArrWithoutComments.length; i++) {
    ret += levelsArrWithoutComments[i];
    if (i < (levelsArrWithoutComments.length - 1)) {
      ret += concatString;
    }
  }
  return ret;
}

/**
 * Repeats a string multiple times
 * @param {string} string
 * @param {number} times
 * @return {string}
 */
function pushString(string, times) {
  let ret = '';
  for (let i = 0; i < times; i++) {
    ret += string;
  }
  return ret;
}

/**
 * Removes comments that start with //
 * @param {string} str
 * @return {string}
 */
export function checkComment(str) {
  const arr = str.split('\n');
  let ret = [];
  arr.forEach(item => {
    if (!item.includes('// ')) {
      ret = [...ret, item];
    }
  });
  return ret.join('\n');
}

/**
 * Removes any character that is not a letter or number
 * @param {string} str
 * @return {string}
 */
function validateString(str) {
  const regExp = /([^A-Za-z0-9])+/g;
  return str.replace(regExp, '_');
}

/* TSL grammar Stubs */

const categoryName = 'Add Brick';

const experimentalDesignBrick = {
  name: 'design',
  category: categoryName,
  block: {
    init() {
      this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput('Design Name'), 'designName')
        .appendField(new Blockly.FieldColour('#ffff00'), 'designColor');
      this.appendStatementInput('blockInput')
        .setCheck('block');
      this.appendDummyInput()
        .appendField('Suitable for a multiple of')
        .appendField('1', 'multipleCB')
        .appendField('Participant(s)');
      this.appendDummyInput()
        .appendField('I plan to recruit')
        .appendField(new Blockly.FieldNumber(1, 1, Infinity, 1), 'numberOfParticipants')
        .appendField('Participant(s)');
      this.appendDummyInput()
        .appendField('Order effect coverage')
        .appendField('100%', 'orderEffectCoverage');
      this.appendDummyInput();
      this.appendDummyInput()
        .appendField('Average duration per trial')
        .appendField(new Blockly.FieldNumber(2, 0), 'averageDuration')
        .appendField('sec');
      this.appendDummyInput()
        .appendField('Delay after each trial')
        .appendField(new Blockly.FieldNumber(1, 0), 'intertrialTime')
        .appendField('sec');
      this.appendDummyInput()
        .appendField('Delay after each block')
        .appendField(new Blockly.FieldNumber(30, 0), 'interblockTime')
        .appendField('sec');
      this.appendDummyInput()
        .appendField('Each session takes')
        .appendField('00:24:23', 'duration')
        .appendField('per particpant');
      this.setColour(230);
      this.setTooltip('');
      this.setHelpUrl('');
    },
  },
  generator: (brick) => {
    let tsl = '<';
    let blocks = Blockly.JavaScript.statementToCode(brick, 'blockInput');
    blocks = checkComment(blocks);
    tsl += blocks.trimLeft();
    const numRows = blocks.split('\n').length;
    tsl += pushString(')', numRows);
    tsl += '>';

    const blockId = brick.id;
    const designName = brick.getFieldValue('designName');
    const numberOfParticipants = parseInt(brick.getFieldValue('numberOfParticipants'));
    const averageDuration = parseFloat(brick.getFieldValue('averageDuration'));
    const interTrialTime = parseFloat(brick.getFieldValue('intertrialTime'));
    const interBlockTime = parseFloat(brick.getFieldValue('interblockTime'));
    const color = brick.getFieldValue('designColor');

    const ret = {
      tsl,
      designId: blockId,
      designName,
      numberOfParticipants,
      averageDuration,
      interTrialTime,
      interBlockTime,
      color,
    };
    return JSON.stringify(ret);
  },
};

export {experimentalDesignBrick};


const experimentalBlockBrick = {
  name: 'block',
  category: categoryName,
  block: {
    init() {
      this.appendStatementInput('independentVariables')
        .setCheck('independentvariable');
      this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([['Fixed order', 'fixed'], ['Latin square', 'latin'], ['Random', 'random'], ['Complete', 'complete']]), 'counterbalancingStrategy')
        .appendField('of')
        .appendField(new Blockly.FieldNumber(1, 1), 'replications')
        .appendField('replication(s)')
        .appendField(new Blockly.FieldDropdown([['not serial', 'false'], ['serial', 'true']]), 'serial');
      this.appendStatementInput('blocks')
        .setCheck('block');
      this.setPreviousStatement(true, ['design', 'block']);
      this.setColour(220);
      this.setTooltip('');
      this.setHelpUrl('');
    },
  },
  generator: (brick) => {
    let ret = '';

    const isSerial = brick.getFieldValue('serial');
    if (isSerial === 'true') {
      ret += 'Serial(';
    }

    const counterbalancingStrategy = brick.getFieldValue('counterbalancingStrategy');
    switch (counterbalancingStrategy) {
      case 'fixed':
        ret += 'Fix(';
        break;
      case 'latin':
        ret += 'Latin(';
        break;
      case 'random':
        ret += 'Random(';
        break;
      case 'complete':
        ret += 'Complete(';
        break;
      default:
        ret += 'ERROR(';
    }

    const independentVariables = Blockly.JavaScript.statementToCode(brick, 'independentVariables');
    const ivString = convertSubBrickToString(independentVariables, ' x ');
    ret += `${ivString}, `;
    const replications = brick.getFieldValue('replications');
    ret += `${replications}`;

    try {
      let childBlock = Blockly.JavaScript.statementToCode(brick, 'blocks');
      childBlock = checkComment(childBlock);
      // console.log('childBlock', childBlock);
      if (childBlock.length > 0) {
        ret += `,\n${childBlock}`;
      }
    }
    catch (e) {
      // bottom block
    }

    if (isSerial === 'true') {
      ret += ')';
    }

    return ret;
  },
};

export {experimentalBlockBrick};


const independentVariableBrick = {
  name: 'independentvariable',
  category: categoryName,
  block: {
    init() {
      this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput('IV'), 'ivID')
        .appendField(new Blockly.FieldTextInput('Independent Variable'), 'ivName');
      this.appendStatementInput('levels')
        .setCheck('level');
      this.setPreviousStatement(true, ['independentvariable']);
      this.setNextStatement(true, 'independentvariable');
      this.setColour(200);
      this.setTooltip('');
      this.setHelpUrl('');
    },
  },
  generator: (brick) => {
    const ivName = brick.getFieldValue('ivName');
    let ivID = brick.getFieldValue('ivID');
    ivID = validateString(ivID);
    const levels = Blockly.JavaScript.statementToCode(brick, 'levels');
    const levelsStr = convertSubBrickToString(levels, ', ');
    return `${ivID} = {${levelsStr}}\n`;
  },
};

export {independentVariableBrick};


const levelBrick = {
  name: 'level',
  category: categoryName,
  block: {
    init() {
      this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput('Name'), 'levelName');
      this.setPreviousStatement(true, 'level');
      this.setNextStatement(true, 'level');
      this.setColour(180);
      this.setTooltip('');
      this.setHelpUrl('');
    },
  },
  generator: (brick) => {
    let levelName = `${brick.getFieldValue('levelName')}` || '\'\'';
    levelName = validateString(levelName);
    return `${levelName}\n`;
  },
};

export {levelBrick};
