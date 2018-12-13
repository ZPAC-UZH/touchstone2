import Blockly from 'node-blockly/browser';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {updateCurrentWorkspace} from '../store/designs/DesignsAction';
import Button from './Button';
import Logo from './Logo';
import {triggerDownload} from './modules/TrialTable/TrialTableHelper';
import * as moment from 'moment';
import Modal from 'react-modal';
import SVG from 'react-inlinesvg';

class Header extends React.PureComponent {
  constructor(props) {
    super(props);
    this.designFileInputButton = React.createRef();
    this.workspaceFileInputButton = React.createRef();
    this.state = {
      aboutModalIsOpen: false,
      tutorialModalIsOpen: false,
    };
  }

  /**
   * Processes one uploaded file
   * @param {event} event
   */
  importDesign(event) {
    const fileList = event.target.files;
    const {0: file} = fileList;
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = () => {
      const xmlString = fileReader.result;
      const xmlBlock = Blockly.Xml.textToDom(`<xml>${xmlString}</xml>`);
      const {workspaceXml} = this.props;
      const workspace = Blockly.Xml.textToDom(workspaceXml);
      workspace.appendChild(xmlBlock.firstChild);
      const workspaceString = Blockly.Xml.domToText(workspace);
      this.props.dispatch(updateCurrentWorkspace(workspaceString));
    };
  }

  clickFileUploadButton() {
    const current = this.designFileInputButton;
    current.click();
  }

  exportWorkspace() {
    const {workspaceXml} = this.props;
    const fileType = 'data:application/xml;charset=utf-8';

    const timestamp = moment()
      .format('YYMMDD HHmmss');
    const fileName = `workspace - ${timestamp}.xml`;

    triggerDownload(workspaceXml, fileType, fileName);
  }

  importWorkspace(event) {
    const fileList = event.target.files;
    const {0: file} = fileList;
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = () => {
      const xmlString = fileReader.result;
      this.props.dispatch(updateCurrentWorkspace(xmlString));
    };
  }

  clickImportWorkspaceButton() {
    const current = this.workspaceFileInputButton;
    current.click();
  }

  openAboutModal() {
    this.setState({aboutModalIsOpen: true});
  }

  closeAboutModal() {
    this.setState({aboutModalIsOpen: false});
  }

  openTutorialModal() {
    this.setState({tutorialModalIsOpen: true});
  }

  closeTutorialModal() {
    this.setState({tutorialModalIsOpen: false});
  }

  render() {
    return (
      <header className="app__header">
        <div className="app__header__left">
          <Logo/>
          <div>
            <p>Import:</p>
            <Button
              text="Design XML"
              onChange={() => this.clickFileUploadButton()}
            />
            <input
              hidden={true} ref={input => (this.designFileInputButton = input)}
              onChange={(event) => this.importDesign(event)} type={'file'}
            />

            <Button
              text="Workspace XML"
              onChange={() => this.clickImportWorkspaceButton()}
            />
            <input
              hidden={true}
              ref={input => (this.workspaceFileInputButton = input)}
              onChange={(event) => this.importWorkspace(event)} type={'file'}
            />

            <p>Export:</p>
            <Button
              text="Workspace XML"
              onChange={() => this.exportWorkspace()}
            />
          </div>
        </div>


        <div className="app__header__right">
          <Button
            text="Tutorial"
            onChange={() => this.openTutorialModal()}
          />
          <Button
            text="About"
            onChange={() => this.openAboutModal()}
          />
        </div>

        <Modal
          isOpen={this.state.aboutModalIsOpen}
          onRequestClose={() => this.closeAboutModal()}
          contentLabel="About"
          className="ts-modal"
        >
          <Button
            text="X" onChange={() => this.closeAboutModal()}
            additionalClassBackground={['ts-modal__modal-close']}
          />
          <div className="ts-modal__header" style={{padding: '0 5rem'}}>
            <Logo/>
            <p>A project of the <a href="#" target="_blank">People and Computing
              Lab</a> at University of
              Zurich,
              Switzerland, and the <a href="#" target="_blank">ExSitu
                group</a> at Univ. Paris-Sud, CNRS, Inria,
              Université Paris-Saclay Orsay, France</p>
          </div>

          <div
            style={{
              padding: '0 5rem',
              marginBottom: '3rem',
            }}
          >
            <h2>Citing Touchstone2</h2>
            <p>Alexander Eiselmayer, Chat Wacharamanotham, Michel Beaudouin-
              Lafon, and Wendy E. Mackay. 2019. <i>Touchstone2</i>: An
              Interactive
              Environment for Exploring Trade-offs in HCI Experiment Design. In
              <i>CHI Conference on Human Factors in Computing Systems
                Proceedings
                (CHI 2019), May 4–9, 2019, Glasgow, Scotland Uk</i>. ACM, New
              York, NY,
              USA, 11 pages. <a
                href="https://doi.org/10.1145/3290605.3300447"
                target="_blank"
              >https://doi.org/10.1145/3290605.3300447</a>
            </p>
            <h2>Main Contributors</h2>
            <ul>
              <li>Alexander Eiselmayer</li>
              <li>Julian Iff</li>
              <li>Chat Wacharamanotham</li>
            </ul>

            <h2>Sourcecode</h2>
            <div>
              <a
                href="https://github.com/ZPAC-UZH/Touchstone2" target="_blank"
                rel="noopener noreferrer"
              >
                <Button text="Touchstone2 UI"/>
              </a>
              <a
                href="https://github.com/ZPAC-UZH/TSL" target="_blank"
                rel="noopener noreferrer"
              >
                <Button text="TSL Parser"/>
              </a>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={this.state.tutorialModalIsOpen}
          onRequestClose={() => this.closeTutorialModal()}
          contentLabel="Tutorial"
          className="ts-modal"
        >
          <Button
            text="X" onChange={() => this.closeTutorialModal()}
            additionalClassBackground={['ts-modal__modal-close']}
          />
          <div className="ts-modal__header" style={{padding: '0 5rem'}}>
            <Logo/>
            <h1>Tutorial</h1>
          </div>

          <div
            style={{
              padding: '0 5rem',
              marginBottom: '3rem',
            }}
          >
            <p>An experiment is represented by a set of bricks.</p>
            <div className={'tutorial-image'}>
              <SVG src={require('assets/media/images/tutorial/tutorial-1.svg')}>
                <img
                  src={require('assets/media/images/tutorial/tutorial-1.png')}
                  alt="Tutorial 1"
                />
              </SVG>
            </div>
            <p>You can add new bricks from the <i>Add Brick</i> menu or by
              duplicating any existing brick.</p>
            <div className="inline-images">
              <img
                className="tutorial-2"
                src={require('assets/media/images/tutorial/tutorial-2.png')}
                alt="Tutorial 2"
              />
              <img
                className="tutorial-3"
                src={require('assets/media/images/tutorial/tutorial-3.png')}
                alt="Tutorial 3"
              />
            </div>

            <p>Trial tables are previewed on the right and generated below.</p>

            <div className={'tutorial-image'}>
              <img
                src={require('assets/media/images/tutorial/tutorial-4.png')}
                alt="Tutorial 4"
              />
            </div>

            <p>Clicking on a row or a cell highlights matching patters.</p>

            <div className={'tutorial-image'}>
              <img
                src={require('assets/media/images/tutorial/tutorial-5.png')}
                alt="Tutorial 5"
              />
            </div>
            <div className="ts-modal__footer">
              <Button
                text="close" onChange={() => this.closeTutorialModal()}
              />
            </div>
          </div>
        </Modal>

      </header>

    );
  }
}

Header.propTypes = {
  dispatch: PropTypes.func,
  workspaceXml: PropTypes.string,
};

/**
 * Map state to props
 * @param {object} state
 * @return {{trialtable: *}}
 */
function mapStateToProps(state) {
  return {
    workspaceXml: state.designs.workspaceXML,
  };
}

export default connect(mapStateToProps)(Header);
