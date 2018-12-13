import {switchToWorkingMode} from '../../app/scripts/store/app/AppActions';

describe('App', () => {
  it('switch to working mode standard', () => {
    expect(switchToWorkingMode('standard'))
      .toMatchSnapshot();
  });
});
