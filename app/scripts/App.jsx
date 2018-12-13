import config from 'config';
import {ConnectedRouter} from 'connected-react-router';
import PropTypes from 'prop-types';
import React from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import {Route, Switch} from 'react-router-dom';

import Footer from './components/Footer';
import historylocal from './components/modules/historylocal';

import Index from './screen/Index';
import NotFound from './screen/NotFound';

export class App extends React.Component {
  static propTypes = {
    app: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
  };


  componentDidUpdate(nextProps) {
  }

  render() {
    const {app, dispatch} = this.props;

    return (
      <ConnectedRouter history={historylocal}>
        <div
          className={{}}
        >
          <Helmet
            defer={false}
            htmlAttributes={{lang: 'de-en'}}
            encodeSpecialCharacters={true}
            defaultTitle={config.title}
            titleTemplate={`%s | ${config.name}`}
            titleAttributes={{
              itemprop: 'name',
              lang: 'de-en',
            }}
          />
          <main className="app__main">
            <Switch>
              <Route exact path="/" component={Index}/>
              <Route component={NotFound}/>
            </Switch>
          </main>
          <Footer/>
        </div>
      </ConnectedRouter>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    app: state.app,
    user: state.user,
  };
}

export default connect(mapStateToProps)(App);
