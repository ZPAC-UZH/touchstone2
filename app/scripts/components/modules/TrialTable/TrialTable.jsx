import * as moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {CssClasses, TitleTexts} from '../../../constants';
import {setFishEye} from '../../../store/trialTable/TrialTableAction';
import Button from '../../Button';
import TitlePane from '../../TitlePane';
import TrialColumn from './TrialColumn';
import {triggerDownload} from './TrialTableHelper';

/**
 * Visual representation of the trialTable
 */
class TrialTable extends React.PureComponent {
  static propTypes = {
    clickedDesignId: PropTypes.string,
    designs: PropTypes.array,
    dispatch: PropTypes.func,
    fishEyeMode: PropTypes.bool,
  };


  /**
   * Downloads the trial table of an Experiment Design as .csv
   * @param {design} design
   */
  static downloadAsCsv(design) {
    const timestamp = moment()
      .format('YYMMDD HHmmss');
    const fileName = `${design.designName} - ${timestamp}.csv`;
    const {trialTable} = design;
    const fileType = 'data:text/csv;charset=utf-8';

    const {variables} = design;
    const variableNames = [];
    for (let i = 0; i < variables.length; i++) {
      for (let j = 0; j < variables[i].length; j++) {
        const {name: varName} = variables[i][j];
        variableNames.push(varName);
      }
    }

    let csvContent = 'DesignName,ParticipantID,TrialID,';
    variables.forEach((item, idx) => {
      csvContent += `Block${idx + 1},`;
    });
    csvContent += `${variableNames.join(',')}\n`;

    for (let i = 0; i < trialTable.length; i++) {
      const participantTrialTable = trialTable[i];
      const participantId = i + 1;
      const blockCounts = this.getBlockCount(participantTrialTable, variables);

      for (let j = 0; j < participantTrialTable.length; j++) {
        const blockCountStr = blockCounts[j].join(',');
        const rowArray = participantTrialTable[j];
        const row = rowArray.join(',');
        const trialId = j + 1 + participantTrialTable.length * i;
        csvContent += `${design.designName},${participantId},${trialId},${blockCountStr},${row}\r\n`;
      }
    }
    triggerDownload(csvContent, fileType, fileName);
  }

  static getBlockCount(trialTable, blocks) {
    const numberOfIvsPerBlock = blocks.map(block => block.length);

    let ivCounter = 0;
    const counts = [];
    blocks.forEach((block, blockIdx) => {
      let counter = 1;
      trialTable.forEach((row, rowIdx) => {
        if (rowIdx < (trialTable.length - 1)) {
          let counterResetted = false;
          const nextRow = trialTable[rowIdx + 1];
          if (counts.length >= (trialTable.length - 1)) {
            const current = counts[rowIdx][counts[rowIdx].length - 1];
            const next = counts[rowIdx + 1][counts[rowIdx + 1].length - 1];
            counts[rowIdx].push(counter);
            if (current !== next) {
              counter = 1;
              counterResetted = true;
            }
          }
          else {
            counts.push([counter]);
          }
          let same = true;
          for (let tmp = ivCounter; tmp < (ivCounter + numberOfIvsPerBlock[blockIdx]); tmp++) {
            if (row[tmp] !== nextRow[tmp]) {
              same = false;
              break;
            }
          }
          if (!same && !counterResetted) {
            counter++;
          }
        }
        else {
          const lastRow = trialTable[rowIdx - 1];
          if (counts.length >= (trialTable.length)) {
            counts[rowIdx].push(counter);
          }
          else {
            counts.push([counter]);
          }
          let same = true;
          for (let tmp = ivCounter; tmp < (ivCounter + numberOfIvsPerBlock[blockIdx]); tmp++) {
            if (row[tmp] !== lastRow[tmp]) {
              same = false;
              break;
            }
          }
          if (!same) {
            counter++;
          }
        }
      });
      ivCounter += numberOfIvsPerBlock[blockIdx];
    });
    return counts;
  }

  /**
   * Downloads the Experiment Design as TSL
   * @param {design} design
   */
  static downloadAsTsl(design) {
    const timestamp = moment()
      .format('YYMMDD HHmmss');
    const fileName = `${design.designName} - ${timestamp}.tsl`;
    const {tsl} = design;
    const fileType = 'data:text/plain;charset=utf-8';
    triggerDownload(tsl, fileType, fileName);
  }

  /**
   * Downloads the Blockly Design brick as .xml
   * @param {design} design
   */
  static downloadAsXml(design) {
    const timestamp = moment()
      .format('YYMMDD HHmmss');
    const fileName = `${design.designName} - ${timestamp}.xml`;
    const {xml} = design;
    const fileType = 'data:text/xml;charset=utf-8';
    triggerDownload(xml, fileType, fileName);
  }

  /**
   * Extract each Design
   * @return {any[]}
   */
  extractDesigns() {
    const {clickedDesignId, designs} = this.props;
    return designs.map((item, index) => {
      let clicked = '';
      if (item.designId === clickedDesignId) {
        const style = {
          width: 0,
          height: 0,
          borderTop: '10px solid transparent',
          borderBottom: '10px solid transparent',
          borderRight: '10px solid #FFCC33',
          display: 'inline-block',
        };
        clicked = <span style={style}/>;
      }

      const {color} = item;
      const designColorIndicator = {
        borderLeft: `5px solid ${color}`,
      };

      return (
        <div key={item.designName + index}>
          <div className="trial-table__header">
            <p>Design: {item.designName} {clicked}</p>
            <div>
              <span>Export design:</span>
              <Button
                text={'XML'}
                onChange={() => TrialTable.downloadAsXml(item)}
              />
              <Button
                text={'TSL'}
                onChange={() => TrialTable.downloadAsTsl(item)}
              />
                Export trial table:
              <Button
                text={'CSV'}
                onChange={() => TrialTable.downloadAsCsv(item)}
              />
            </div>
          </div>
          <div className="trial-table__container" style={designColorIndicator}>
            {this.extractParticipant(item.designId, item.trialTable)}
          </div>
        </div>
      );
    },
    );
  }

  /**
   * Extract each participant
   * @param {string} id - ID of experiment design
   * @param {array} trialTable
   * @return {*}
   */
  extractParticipant(id, trialTable) {
    const {fishEyeMode} = this.props;
    return trialTable.map((item, index) => (
      <div
        className="trial-table__subheader"
        key={item + index}
      >Participant {index + 1}
        <TrialColumn
          row={item} trialIdStart={index * item.length}
          fishEyeMode={fishEyeMode}
          designId={id}
        />
      </div>
    ));
  }

  /**
   * Toggle the fisheye feature
   */
  toggleFisheye() {
    const {fishEyeMode, dispatch} = this.props;
    dispatch(setFishEye(!fishEyeMode));
    // [...document.querySelectorAll('.trial-table__entry')].forEach(item => item.classList.toggle('trial-table__entry--fisheye'));
  }

  /**
   * Render function of react
   * @return {*}
   */
  render() {
    return (
      <div className="full-trial-tables">
        <TitlePane
          title={TitleTexts.TRIALPANETITLE}
          additionalClassBackground={['full-trial-tables__title-pane']}
        >
          <Button
            text={TitleTexts.TOGGLE}
            onChange={() => this.toggleFisheye()}
            additionalClassBackground={[CssClasses.BUTTONTRANSPARENT]}
            additionalClassNameText={[CssClasses.BUTTONTEXTGREY]}
          />
        </TitlePane>
        {this.extractDesigns()}
      </div>
    );
  }
}

/**
 * Map state to props
 * @param {object} state
 * @return {{trialtable: *}}
 */
function mapStateToProps(state) {
  return {
    designs: state.designs.designData,
    clickedDesignId: state.designs.clickedDesign.designId,
    fishEyeMode: state.trialtable.fishEyeMode,
  };
}

export default connect(mapStateToProps)(TrialTable);
