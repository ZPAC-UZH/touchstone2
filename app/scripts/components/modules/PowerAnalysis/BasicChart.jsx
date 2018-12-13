import * as d3 from 'd3';
import Blockly from 'node-blockly/browser';
import PropTypes from 'prop-types';
import React from 'react';
import connect from 'react-redux/es/connect/connect';
import {round} from '../../../constants/util';
import Button from '../../Button';
import {switchToWorkingMode} from '../../../store/app/AppActions';
import {
  WORKING_MODE_POWER_ANALYSIS,
  WORKING_MODE_STANDARD,
} from '../../../store/app/workingModeConfigurations';
import NumericInput from 'react-numeric-input';
import {debounce, throttle} from 'throttle-debounce';
import {
  calculatePowerMargin,
  updateEffectSizeForDesign,
  updateMarginForDesign,
} from '../../../store/power/PowerAction';
import EffectCheckboxes from './EffectCheckboxes';
import EffectSizeRadioButtons from './EffectSizeRadioButtons';

class BasicChart extends React.Component {
  constructor(props) {
    super(props);
    this.chartContainer = React.createRef();
    this.effectSizeInput = React.createRef();

    const margin = {
      top: 10,
      right: 0,
      bottom: 50,
      left: 50,
    };

    this.state = {
      power: 0,
      participants: 0,
      effects: [],
      margin,
      height: 0,
      width: 0,
      xAxisSteps: 5,
      transitionDuration: 0,
    };

    // TODO this is defined twice
    this.EFFECTSIZE_SWITCHER_NAME = 'EFFECTSIZE_SWITCHER_NAME';
    this.EFFECTSIZE_MODE_SMALL = 'EFFECTSIZE_MODE_SMALL';
    this.EFFECTSIZE_MODE_MEDIUM = 'EFFECTSIZE_MODE_MEDIUM';
    this.EFFECTSIZE_MODE_LARGE = 'EFFECTSIZE_MODE_LARGE';
    this.EFFECTSIZE_MODE_CUSTOM = 'EFFECTSIZE_MODE_CUSTOM';

    this.chartContainerStyle = {
      width: '28vw',
      height: '150px',
    };
  }

  componentDidMount(): void {
    this.initializeChart();

    window.addEventListener('resize', () => this.onResize(), false);
    this.onResize();
  }

  componentDidUpdate() {
    this.updateChart();

    const {workingMode} = this.props;
    if (workingMode === WORKING_MODE_STANDARD && this.state.workingMode !== WORKING_MODE_STANDARD) {
      this.chartContainerStyle = {
        width: '28vw',
        height: '150px',
      };
      this.updateChartSize(workingMode);
    }

    if (workingMode === WORKING_MODE_POWER_ANALYSIS) {
      if (this.state.workingMode !== WORKING_MODE_POWER_ANALYSIS) {
        this.chartContainerStyle = {
          width: '47vw',
          height: '300px',
        };
        this.updateChartSize(workingMode);
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener(
      'resize',
      this.onResize,
    );
  }

  updateChart() {
    this.updateColor();

    this.drawYAxis();
    this.drawXAxis();
    this.drawAxisLabels();
    this.drawPowerThreshold();
    this.setTransitionDuration(750);

    const {workingMode} = this.props;
    switch (workingMode) {
      case WORKING_MODE_STANDARD:
        this.updateDataStandard();
        break;
      case WORKING_MODE_POWER_ANALYSIS:
        this.updateDataPowerAnalysis();
        this.updateEffectSizeSwitcher();
        break;
    }
  }

  setTransitionDuration(newTransitionDuration) {
    const {transitionDuration: oldTransitionDuration} = this.state;
    if (oldTransitionDuration !== newTransitionDuration) {
      this.setState(state => ({
        ...state,
        transitionDuration: newTransitionDuration,
      }));
    }
  }

  /**
   * This function should be called only once
   */
  initializeChart() {
    this.chart = d3.select(this.chartContainer.current)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%');

    const {margin} = this.state;

    this.basicLayer = this.chart.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    this.dataLayer = this.chart.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    this.participantHandleLayer = this.chart.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);


    this.lineGenerator = d3.line()
      .curve(d3.curveLinear)
      .x((d) => this.xScale(parseInt(d.participant)))
      .y((d) => this.yScale(parseFloat(d.power)));
    this.xMin = 8;
    this.xMax = 50;
    this.drawXAxis();
    this.drawYAxis();
    this.drawAxisLabels();
    this.drawPowerThreshold();
  }


  getTransition(name = '') {
    const {transitionDuration} = this.state;
    return d3.transition(name)
      .duration(transitionDuration)
      .ease(d3.easeLinear);
  }

  updateColor() {
    this.colors = [];
    this.props.designs.forEach(item => {
      this.colors = [...this.colors, {
        id: item.designId,
        color: item.color,
      }];
    });

    this.colorScale = d => {
      const [{color}] = this.colors.filter(item => item.id === d);
      return color;
    };
  }

  drawAxisLabels() {
    this.basicLayer.selectAll('.label')
      .remove();

    const {margin, width, height} = this.state;
    this.basicLayer.append('text')
      .attr('transform',
        `translate(${width / 2} ,${
          height + margin.top + 30})`)
      .style('text-anchor', 'middle')
      .text('Number of Participants')
      .attr('class', 'label')
      .style('font-size', '12px');

    this.basicLayer.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left + 10)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Power')
      .attr('class', 'label')
      .style('font-size', '12px');
  }

  drawXAxis() {
    this.basicLayer.selectAll('.axis--x')
      .remove();

    const {width, height, xAxisSteps: step} = this.state;

    let start = step;
    while (start < this.xMin) {
      start += step;
    }

    this.xScale = d3.scaleLinear()
      .range([0, width]);
    this.xScale.domain([this.xMin, this.xMax]);
    this.xAxis = d3.axisBottom(this.xScale)
      .tickValues(d3.range(start, this.xMax, step));

    this.basicLayer.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${height})`)
      .call(this.xAxis);
  }

  updateXAxisTicks(step) {
    if (this.state.xAxisSteps !== step) {
      this.setState(state => ({
        ...state,
        xAxisSteps: step,
      }));
    }
  }

  drawYAxis() {
    this.basicLayer.selectAll('.axis--y')
      .remove();

    const {height} = this.state;
    this.yScale = d3.scaleLinear()
      .range([height, 0]);
    this.yScale.domain([0, 1]);
    this.yAxis = d3.axisLeft(this.yScale)
      .tickValues(d3.range(0, 1.1, 0.2));

    this.basicLayer.append('g')
      .attr('class', 'axis axis--y')
      .call(this.yAxis);
  }

  drawPowerThreshold() {
    this.basicLayer.selectAll('.power-threshold')
      .remove();

    const redAreaMini = this.basicLayer.append('g');
    redAreaMini.append('svg:rect')
      .attr('width', this.xScale(this.xMax))
      .attr('height', this.yScale(0) - this.yScale(0.8))
      .style('fill', 'rgba(255,0,0, 0.2)')
      .attr('class', 'power-threshold')
      .attr('x', this.xScale(this.xMin))
      .attr('y', this.yScale(0.8));
  }

  /**
   * @param {array} data
   * [{
        key: designId,
        values: data,
      }, ...]
   */
  drawPowerLines(data) {
    const transition = this.getTransition('drawPowerLines');

    const lines = this.dataLayer.selectAll('.data-line')
      .data(data);
    lines.enter()
      .append('path')
      .merge(lines)
      .transition(transition)
      .attr('fill', 'none')
      .attr('stroke', d => this.colorScale(d.key))
      .attr('class', 'data-line line-path')
      .attr('d', d => this.lineGenerator(d.values));

    lines.exit()
      .remove();
  }

  drawPowerCircles(data, multiple, color) {
    const transition = this.getTransition('drawPowerCircles');

    const circleData = data.filter(d => d.participant % multiple === 0);
    const circles = this.dataLayer.selectAll('.multipleCB')
      .data(circleData);
    circles.enter()
      .append('circle')
      .attr('cx', () => this.xScale(50))
      .attr('cy', (d) => this.yScale(parseFloat(d.power)))
      .attr('r', '0')
      .merge(circles)
      .transition(transition)
      .attr('cx', (d) => this.xScale(parseInt(d.participant)))
      .attr('cy', (d) => this.yScale(parseFloat(d.power)))
      .attr('r', '3.5')
      .attr('fill', color)
      .attr('class', 'multipleCB');

    circles.exit()
      .transition(transition)
      .attr('cx', () => this.xScale(50))
      .attr('cy', (d) => this.yScale(parseFloat(d.power)))
      .attr('r', '0')
      .remove();
  }

  drawParticipantIndicator(numberOfParticipants) {
    const transition = this.getTransition('participantIndicator');

    this.participantIndicator = this.basicLayer.selectAll('.participant-participantIndicator')
      .data(['']);

    this.participantIndicator
      .enter()
      .append('line')
      .merge(this.participantIndicator)
      .transition(transition)
      .attr('x1', this.xScale(numberOfParticipants))
      .attr('y1', this.yScale(0))
      .attr('x2', this.xScale(numberOfParticipants))
      .attr('y2', this.yScale(1))
      .attr('stroke-width', 2)
      .attr('stroke', 'black')
      .attr('class', 'participant-participantIndicator');


    this.participantIndicator.exit()
      .remove();
  }

  removeParticipantIndicator() {
    if (this.participantIndicator) {
      this.basicLayer.selectAll('.participant-participantIndicator')
        .remove();
      this.participantIndicator = null;
    }
  }

  updatePower() {
    const powerForParticipant = this.powerForClickedDesign.filter(d => d.participant === this.state.participants);
    let newPower = 0;
    if (powerForParticipant.length > 0) {
      const [{power}] = powerForParticipant;
      newPower = power;
    }

    if (this.state.power !== newPower) {
      this.setState(state => ({
        ...state,
        power: newPower,
      }));
    }
  }


  updateDataStandard() {
    // GENERAL D3 UPDATE PATTERN
    // UPDATE Selection (circles): elements that are there and have data
    // ENTER Selection: data that doesn't have DOM elements yet
    // EXIT Selection: DOM elements that don't have data elements anymore

    const {powerData, designs} = this.props;
    const designId = this.props.clickedDesignId;
    if (designId && designId in powerData) {
      const powerDataForDesign = powerData[designId];
      const {data} = powerDataForDesign;
      this.powerForClickedDesign = data;
      let design = designs.filter(d => d.designId === designId);
      if (design.length) { // check if the design is available or has been deleted
        [design] = design;
        const {multiple, color, numberOfParticipants} = design;
        if (this.state.participants !== numberOfParticipants) {
          this.setState(state => ({
            ...state,
            participants: numberOfParticipants,
          }));
        }

        this.updatePower();

        this.removeParticipantHandle();
        this.removeAreaChart();

        this.updateXAxisTicks(multiple);
        this.drawPowerLines([{
          key: designId,
          values: data,
        }]);
        this.drawPowerCircles(data, multiple, color);
        this.drawParticipantIndicator(this.state.participants);
      }
    }
  }

  updateDataPowerAnalysis() {
    const {dispatch, powerData, designs} = this.props;
    const designId = this.props.clickedDesignId;
    const powerDataForDesign = powerData[designId];
    if (powerDataForDesign) {
      const {data: dataForDesign} = powerDataForDesign;
      this.powerForClickedDesign = dataForDesign;
      const [design] = designs.filter(d => d.designId === designId);
      if (design) {
        const {multiple, color, numberOfParticipants} = design;
        if (this.state.participants !== numberOfParticipants) {
          this.setState(state => ({
            ...state,
            participants: numberOfParticipants,
          }));
        }
        this.updatePower();

        let lineData = [];
        for (const k in powerData) {
          if (Object.prototype.hasOwnProperty.call(powerData, k)) {
            const {data: l} = powerData[k];
            lineData = [...lineData, {
              key: k,
              values: l,
            }];
          }
        }

        const areaPowerData = powerData[designId];
        const {margin, dataUpperMargin, dataLowerMargin} = areaPowerData;
        if (margin && dataUpperMargin && dataLowerMargin) {
          let areaData = [];
          dataUpperMargin.forEach((item, idx) => {
            areaData = [
              ...areaData,
              {
                participant: item.participant,
                upperMargin: item.power,
                lowerMargin: dataLowerMargin[idx].power,
              },
            ];
          });
          this.drawAreaChart(areaData, designId);
        }
        else {
          this.throttledCalculatePowerMargin();
        }

        this.removeParticipantIndicator();

        this.updateXAxisTicks(multiple);
        this.drawPowerLines(lineData);
        this.drawPowerCircles(dataForDesign, multiple, color);
        this.participantHandle(this.state.participants, designId);
      }
    }
  }

  throttledCalculatePowerMargin = throttle(250, false, () => {
    this.props.dispatch(calculatePowerMargin()); // eslint-disable-line no-invalid-this
  });

  drawAreaChart(dataForDesign, designId) {
    const transition = this.getTransition('areaChart');

    const areaGenerator = d3.area()
      .curve(d3.curveLinear)
      .x(d => this.xScale(d.participant))
      .y0(d => this.yScale(d.upperMargin))
      .y1(d => this.yScale(d.lowerMargin));

    const area = this.dataLayer.selectAll('.margin-area')
      .data([dataForDesign]);

    area.enter()
      .append('path')
      .merge(area)
      .transition(transition)
      .attr('fill', this.colorScale(designId))
      .style('opacity', 0.2)
      .attr('class', 'margin-area')
      .attr('d', d => areaGenerator(d));

    area.exit()
      .remove();
  }

  participantHandle(p, designId) {
    let participants = p;
    if (this.participantHandleParticipants && this.participantHandleDesignId === designId) {
      participants = this.participantHandleParticipants;
    }
    const drag = d3.drag()
      .on('start', null)
      .on('drag', () => {
        const {dx} = d3.event;
        const cur = this.participantHandleCircle.attr('cx');
        const xNew = parseFloat(this.participantHandleCircle.attr('data-x-value')) + dx;
        const X = parseFloat(cur) + dx;


        this.participantHandleCircle.attr('data-x-value', xNew);
        const newParticipantNumber = Math.round(this.xScale.invert(xNew));
        const currentParticipantNumber = Math.round(this.xScale.invert(X));
        if (currentParticipantNumber !== newParticipantNumber) {
          this.participantHandleLine.attr('x1', this.xScale(newParticipantNumber))
            .attr('x2', this.xScale(newParticipantNumber));
          this.participantHandleCircle.attr('cx', this.xScale(newParticipantNumber));
        }
      })
      .on('end', () => {
        const newParticipantNumber = Math.round(this.xScale.invert(this.participantHandleCircle.attr('cx')));
        const designBlock = Blockly.getMainWorkspace()
          .getBlockById(this.props.clickedDesignId);
        designBlock.setFieldValue(newParticipantNumber, 'numberOfParticipants');
        if (this.state.participants !== newParticipantNumber) {
          this.participantHandleParticipants = newParticipantNumber;
          this.participantHandleDesignId = designId;
          this.setState(state => ({
            ...state,
            participants: newParticipantNumber,
          }));
        }
        this.updatePower();
      });

    if (!this.participantHandleLine) {
      this.participantHandleLine = this.participantHandleLayer.append('line');
    }

    const transition = this.getTransition('participantHandle');

    this.participantHandleLine
      .transition(transition)
      .attr('x1', this.xScale(participants))
      .attr('y1', this.yScale(0))
      .attr('x2', this.xScale(participants))
      .attr('y2', this.yScale(1))
      .attr('stroke-width', 4)
      .attr('stroke', 'black');

    if (!this.participantHandleCircle) {
      this.participantHandleCircle = this.participantHandleLayer.append('circle');
    }
    this.participantHandleCircle
      .call(drag)
      .transition(transition)
      .attr('cx', this.xScale(participants))
      .attr('cy', this.yScale(0.2))
      .attr('r', 10)
      .attr('data-x-value', this.xScale(participants))
      .attr('class', 'clickable')
      .attr('stroke-width', 2)
      .attr('stroke', 'black')
      .attr('fill', 'white')
    ;
  }

  removeParticipantHandle() {
    if (this.participantHandleLine) {
      this.participantHandleLine.remove();
      this.participantHandleLine = null;
    }
    if (this.participantHandleCircle) {
      this.participantHandleCircle.remove();
      this.participantHandleCircle = null;
    }
  }

  removeAreaChart() {
    this.dataLayer.selectAll('.margin-area')
      .remove();
  }

  updateEffectSize = debounce(1000, false, effectSize => {
    const {dispatch, clickedDesignId} = this.props; // eslint-disable-line no-invalid-this
    dispatch(updateEffectSizeForDesign(clickedDesignId, effectSize));

    let effectSizeMode = this.EFFECTSIZE_MODE_CUSTOM; // eslint-disable-line no-invalid-this
    if (effectSize === 0.15) {
      effectSizeMode = this.EFFECTSIZE_MODE_SMALL; // eslint-disable-line no-invalid-this
    }
    if (effectSize === 0.25) {
      effectSizeMode = this.EFFECTSIZE_MODE_MEDIUM; // eslint-disable-line no-invalid-this
    }

    if (effectSize === 0.4) {
      effectSizeMode = this.EFFECTSIZE_MODE_LARGE; // eslint-disable-line no-invalid-this
    }

    this.setState(state => ({ // eslint-disable-line no-invalid-this
      ...state,
      effectSizeMode,
    }));
  });

  updateMargin = debounce(1000, false, margin => {
    const {dispatch, clickedDesignId} = this.props; // eslint-disable-line no-invalid-this
    dispatch(updateMarginForDesign(clickedDesignId, margin));
  });

  updateEffectSizeSwitcher() {
    const {powerData, clickedDesignId} = this.props;
    if (clickedDesignId in powerData) {
      const {parameters} = powerData[clickedDesignId];
      const {effectSize} = parameters;
      if (this.state.effectSizeMode !== this.EFFECTSIZE_MODE_CUSTOM) {
        switch (effectSize) {
          case 0.15:
            if (this.state.effectSizeMode !== this.EFFECTSIZE_MODE_SMALL) {
              this.setState(state => ({
                ...state,
                effectSizeMode: this.EFFECTSIZE_MODE_SMALL,
              }));
            }
            break;
          case 0.25:
            if (this.state.effectSizeMode !== this.EFFECTSIZE_MODE_MEDIUM) {
              this.setState(state => ({
                ...state,
                effectSizeMode: this.EFFECTSIZE_MODE_MEDIUM,
              }));
            }
            break;
          case 0.4:
            if (this.state.effectSizeMode !== this.EFFECTSIZE_MODE_LARGE) {
              this.setState(state => ({
                ...state,
                effectSizeMode: this.EFFECTSIZE_MODE_LARGE,
              }));
            }
            break;
          default:
            if (this.state.effectSizeMode !== this.EFFECTSIZE_MODE_CUSTOM) {
              this.setState(state => ({
                ...state,
                effectSizeMode: this.EFFECTSIZE_MODE_CUSTOM,
              }));
            }
        }
      }
    }
  }

  onResize = debounce(100, false, () => {
    const {width, height} = this.chartContainer.current.getBoundingClientRect(); // eslint-disable-line no-invalid-this
    const {margin} = this.state; // eslint-disable-line no-invalid-this
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    this.setState(state => ({ // eslint-disable-line no-invalid-this
      ...state,
      width: chartWidth,
      height: chartHeight,
    }));
  });

  updateChartSize(workingMode) {
    this.setState(state => ({
      ...state,
      workingMode,
    }), this.onResize());
  }


  render(): React.ReactNode {
    const {dispatch, workingMode, powerData, clickedDesignId} = this.props;


    let powerText = <p>Please select an experimental design to see its
      power</p>;

    let button;
    let effectSizeInput;
    let marginInput;
    let radioButtons;
    let checkBoxes;
    let powerAnalysis;
    if (clickedDesignId && this.state.participants > 0 && clickedDesignId in powerData) {
      const {power: pwr, participants} = this.state;
      const power = round(pwr, 2);
      const p = participants > 1 ? 'participants yield' : 'participant yields';

      const {parameters, margin} = powerData[clickedDesignId];
      const {effectSize} = parameters;

      powerText =
        <p>
          {participants} {p} a power of {power} at the
          effect
          size Cohen's f =
          {effectSize}.
        </p>;

      switch (workingMode) {
        case WORKING_MODE_STANDARD:
          button = <Button
            text={'... more'}
            additionalClassBackground={['button--float-right']}
            onChange={() => dispatch(switchToWorkingMode(WORKING_MODE_POWER_ANALYSIS))}
          />;
          break;
        case WORKING_MODE_POWER_ANALYSIS: {
          button = <Button
            text={'... less'}
            additionalClassBackground={['button--float-right']}
            onChange={() => dispatch(switchToWorkingMode(WORKING_MODE_STANDARD))}
          />;

          effectSizeInput = <NumericInput
            className={'number-input'}
            mobile
            onChange={this.updateEffectSize} step={0.05}
            value={effectSize} min={0}
            ref={this.effectSizeInput}
          />;

          marginInput = <NumericInput
            className={'number-input'}
            mobile
            onChange={this.updateMargin} step={0.01}
            value={margin} min={0}
          />;

          radioButtons =
            <EffectSizeRadioButtons
              effectSizeMode={this.state.effectSizeMode}
              updateEffectSize={this.updateEffectSize}
            />;


          const {designs} = this.props;
          const [clickedDesign] = designs.filter(design => design.designId === clickedDesignId);
          if (clickedDesign) {
            checkBoxes =
              <EffectCheckboxes
                updateEffectSize={this.updateEffectSize}
                clickedDesign={clickedDesign}
              />;
          }

          powerAnalysis = <>
            <div style={{'clear': 'both'}}>
              <p>Cohen's <i>f</i> &nbsp; {effectSizeInput} &nbsp; with a margin
                ± &nbsp; {marginInput}
              </p>
            </div>
            <div>
              {radioButtons}
              <p>Effects to be included:</p>
              {checkBoxes}
            </div>
          </>;

          break;
        }
      }
    }

    return (
      <>
        <div style={this.chartContainerStyle} ref={this.chartContainer}/>
        <div>
          <div>
            {powerText}
          </div>
          {powerAnalysis}
          <div>
            {button}
          </div>
        </div>
      </>
    );
  }
}

BasicChart.propTypes = {
  clickedDesign: PropTypes.object,
  clickedDesignId: PropTypes.string,
  designs: PropTypes.array,
  dispatch: PropTypes.func,
  powerData: PropTypes.object,
  workingMode: PropTypes.string,
};

function mapStateToProps(state: Object) {
  return {
    clickedDesignId: state.designs.clickedDesign.designId,
    clickedDesign: state.designs.clickedDesign,
    powerData: state.power.powerDistributions,
    designs: state.designs.designData,
    workingMode: state.app.workingMode,
  };
}

export default connect(mapStateToProps)(BasicChart);
