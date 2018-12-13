import PropTypes from 'prop-types';
import React from 'react';

const _hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
};

const _intToARGB = (i) => {
  const c = (i & 0x00FFFFFF)
    .toString(16)
    .toUpperCase();

  return '00000'.substring(0, 6 - c.length) + c;
};


class Annotations extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleDeletion = this._handleDeletion.bind(this);
  }

  state = {
    isClicked: false,
    value: this.props.annotation.name,
  };

  static propTypes = {
    annotation: PropTypes.object,
  };

  inputConditional = () => ({conditional}) => {
    if (conditional) {
      return this._onMouseDown();
    }
    return <></>;
  };

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  _handleSubmit(e) {
    e.preventDefault();
    const {annotation} = this.props;
    const {value, isClicked} = this.state;

    this.setState({isClicked: !isClicked});
    console.log('submit', value, annotation.id);
  }

  _handleDeletion(e) {
    e.preventDefault();
    const {annotation} = this.props;
    const {value, isClicked} = this.state;

    this.setState({isClicked: !isClicked});
    console.log('deletion', value, annotation.id);
  }


  _onMouseDown() {
    const {value} = this.state;

    return (
      <div className="annotation__input">
        <form>
          <input
            className="input__box" type="text"
            value={value}
            onChange={this.handleChange}
          />
          <input
            className="input__submit" type="submit" name="submit" value="Submit"
            onClick={this._handleSubmit}
          />
          <input
            className="input__submit" type="submit" name="delete" value="Delete"
            onClick={this._handleDeletion}
          />
        </form>
      </div>);
  }


  render() {
    const {annotation} = this.props;
    const {isClicked} = this.state;
    const WithInputClicked = this.inputConditional();

    return (
      <>
        <div
          className="annotation"
          style={{backgroundColor: `#${_intToARGB(_hashCode(annotation.name))}`}}
          onMouseDown={() => this.setState({isClicked: !isClicked})}
        >
          <div className="annotation__text">{annotation.name}</div>
        </div>
        <WithInputClicked
          conditional={isClicked}
        />
      </>
    );
  }
}


export default Annotations;
