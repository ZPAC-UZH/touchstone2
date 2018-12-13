import PropTypes from 'prop-types';
import React from 'react';
import connect from 'react-redux/es/connect/connect';
import NumericInput from 'react-numeric-input';
import Button from '../../Button';
import {round} from '../../../constants/util';
import {updateMeasurementsForDesign} from '../../../store/designs/DesignsAction';
import {standardDeviation, mean} from './Calculations';

class MeasurementsTable extends React.Component {
  constructor(props) {
    super(props);

    const {clickedDesign} = this.props;
    let measurements = {};
    if (clickedDesign.measurements) {
      ({measurements} = clickedDesign);
    }

    const measurementDefaultValues = this.getMeasurementDefaultValues(measurements);

    this.state = {
      measurements: measurementDefaultValues,
      variables: clickedDesign.variables,
    };
  }

  componentDidUpdate() {
    this.updateMeasurements();
  }

  updateMeasurements() {
    const {clickedDesign} = this.props;
    const {variables} = this.state;
    if (JSON.stringify(clickedDesign.variables) !== JSON.stringify(variables)) {
      let measurements = {};
      if (clickedDesign.measurements) {
        ({measurements} = clickedDesign);
      }

      const measurementDefaultValues = this.getMeasurementDefaultValues(measurements);

      this.setState(state => ({
        ...state,
        variables: clickedDesign.variables,
        measurements: measurementDefaultValues,
      }));
    }
  }


  static getHeaderRow(variables) {
    let headerColumns = [];
    variables.forEach((iv, ivIdx) => {
      headerColumns = [
        ...headerColumns,
        <div
          className={'trial-table__entry'}
          key={`iv${ivIdx}`}
        >{iv.name}</div>,
      ];
    });
    return <div
      key={'header'}
      className={'trial-table__row'}
    >{headerColumns}</div>;
  }

  getTrialRow(levels, variables, measurements) {
    let id = '';
    let trialRow = levels.map((item, idx) => {
      id += `${variables[idx].name}[${item}]`;
      return <div
        className={'trial-table__entry'}
        key={idx}
      >
        {item}
      </div>;
    });

    let value = round(5 * Math.random() + 1, 3);
    if (id in measurements) {
      value = measurements[id];
    }

    trialRow = [
      ...trialRow,
      <div key={'measurement'}>
        <NumericInput
          onChange={newNumber => this.updateMeasurementsNumber(id, newNumber)}
          value={value}
        />
      </div>,
    ];

    return {
      trialRow,
      measurement: {
        [id]: value,
      },
    };
  }

  updateMeasurementsNumber(id, newNumber) {
    const {measurements} = this.state;
    this.setState(state => ({
      ...state,
      measurements: {
        ...measurements,
        [id]: newNumber,
      },
    }));
  }

  getMeasurementDefaultValues(measurements) {
    const {trialTable, variables} = this.props;
    const flattenedVariables = this.flattenVariables(variables);

    let measurementDefaultValues = {};
    trialTable.forEach(item => {
      const {measurement} = this.getTrialRow(item, flattenedVariables, measurements);
      measurementDefaultValues = {
        ...measurementDefaultValues,
        ...measurement,
      };
    });

    return measurementDefaultValues;
  }

  getMeasurementsTable(measurements) {
    const {trialTable, variables} = this.props;
    const flattenedVariables = this.flattenVariables(variables);

    const headerRow = MeasurementsTable.getHeaderRow(flattenedVariables);
    let measurementsTable = trialTable.map((item, idx) => {
      const {trialRow} = this.getTrialRow(item, flattenedVariables, measurements);
      return <div key={idx} className={'trial-table__row'}>{trialRow}</div>;
    });
    measurementsTable = [
      headerRow,
      ...measurementsTable,
    ];

    return measurementsTable;
  }

  flattenVariables(variables) {
    let flattened = [];
    variables.forEach(block => {
      block.forEach(iv => {
        flattened = [
          ...flattened,
          iv,
        ];
      });
    });
    return flattened;
  }

  calculateEffectSize() {
    const {measurements} = this.state;
    const {dispatch, clickedDesignId, activeEffects, variables, callback} = this.props;
    dispatch(updateMeasurementsForDesign(clickedDesignId, measurements));
    if (activeEffects.length) { // only calculate the effect size when at least one effect is selected
      // Population SD
      let populationMeasures = [];
      for (const id in measurements) {
        if ({}.hasOwnProperty.call(measurements, id)) {
          populationMeasures = [...populationMeasures, measurements[id]];
        }
      }
      const populationSD = standardDeviation(populationMeasures);

      // Effect SDs
      const flattenedVariables = this.flattenVariables(variables);
      let effectSDs = [];
      activeEffects.forEach(effect => {
        const [iv] = flattenedVariables.filter(iv => iv.name === effect);
        if (iv) {
          const {levels} = iv;
          let effectMeasures = [];
          levels.forEach(l => {
            const key = `${effect}[${l}]`;
            let levelMeasures = [];
            for (const id in measurements) {
              if ({}.hasOwnProperty.call(measurements, id)) {
                if (id.includes(key)) {
                  levelMeasures = [...levelMeasures, measurements[id]];
                }
              }
            }
            effectMeasures = [...effectMeasures, mean(levelMeasures)];
          });
          effectSDs = [...effectSDs, standardDeviation(effectMeasures)];
        }
      });

      let effectSizes = [];
      effectSDs.forEach(sd => {
        effectSizes = [...effectSizes, sd / populationSD];
      });
      const smallestEffectSize = round(Math.min(...effectSizes), 4);
      callback(smallestEffectSize);
    }
  }

  render() {
    const measurementsTable = this.getMeasurementsTable(this.state.measurements);
    return (
      <>
        <div className={'power-analysis__measurements-table'}>
          {measurementsTable}
        </div>
        <div>
          <Button
            text={'calculate effect size'}
            onChange={() => this.calculateEffectSize()}
          />
        </div>
      </>
    );
  }
}

MeasurementsTable.propTypes = {
  activeEffects: PropTypes.array.isRequired,
  callback: PropTypes.func,
  clickedDesign: PropTypes.object,
  clickedDesignId: PropTypes.string,
  dispatch: PropTypes.func,
  trialTable: PropTypes.array.isRequired,
  variables: PropTypes.array.isRequired,
};

function mapStateToProps(state: Object) {
  return {};
}

export default connect(mapStateToProps)(MeasurementsTable);
