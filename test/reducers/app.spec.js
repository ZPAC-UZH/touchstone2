import reducer from '../../app/scripts/store/app/AppReducer';
import {
  switchToWorkingMode,
  WORKING_MODE_SWITCHER_SUCCESS,
} from '../../app/scripts/store/app/AppActions';

describe('App', () => {
  let app = reducer(undefined, {});

  it('should return the initial state', () => {
    expect(reducer(app, {}))
      .toMatchSnapshot();
  });

  it(`should handle ${WORKING_MODE_SWITCHER_SUCCESS}`, () => {
    app = reducer(app, switchToWorkingMode('standard'));
    expect(app)
      .toMatchSnapshot();
  });
});
