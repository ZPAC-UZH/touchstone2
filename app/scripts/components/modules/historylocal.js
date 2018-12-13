// @flow
import * as createHistory from 'history';
import qs from 'qs';

const historylocal = createHistory.createBrowserHistory();

historylocal.location = {
  ...historylocal.location,
  query: qs.parse(historylocal.location.search.substr(1)),
  state: {},
};

/* istanbul ignore next */
historylocal.listen(() => {
  historylocal.location = {
    ...historylocal.location,
    query: qs.parse(historylocal.location.search.substr(1)),
    state: historylocal.location.state || {},
  };
});

export default historylocal;
