/* eslint-disable no-unused-expressions */
import _ from 'lodash';
import { expect } from 'chai';
import {
  mapReducers,
  applyToAll,
  TARGET_ALL_REDUCERS,
} from '../src';
import {
  reducerNormal,
  reducerOther,
  reducerArray,
} from './helpers/reducers';

describe('Map reducers', () => {
  it('has a valid initial state', () => {
    const testReducer = mapReducers(
      'key',
      reducerNormal
    );
    const state = testReducer(undefined, {});
    expect(state).to.deep.equal({});
  });

  it('has a valid initial state with array reducer', () => {
    const testReducer = mapReducers(
      'key',
      () => reducerArray
    );
    const state = testReducer(undefined, {});
    expect(state).to.deep.equal({});
  });

  it('produce new valid substate with correct key path', () => {
    const testReducer = mapReducers(
      'meta.key',
      reducerNormal
    );
    const action = {
      type: 'test',
      meta: {
        key: 5
      },
      payload: 'today',
    };
    const state = testReducer(undefined, action);
    expect(state).to.deep.equal({ 5: { data: 'today' } });
  });

  it('produce new valid array substate with correct key path', () => {
    const testReducer = mapReducers(
      'meta.key',
      reducerArray
    );
    const action = {
      type: 'test',
      meta: {
        key: 5
      },
      payload: ['today', 'tomorrow'],
    };
    const state = testReducer(undefined, action);
    expect(state).to.deep.equal({ 5: ['today', 'tomorrow'] });
  });

  it('produce overwritten valid substate with correct key path', () => {
    const testReducer = mapReducers(
      'meta.key',
      reducerNormal
    );
    const action = {
      type: 'test',
      meta: {
        key: 5
      },
      payload: 'today',
    };
    const initialState = { 5: { data: 'yesterday' } };
    const state = testReducer(initialState, action);
    expect(state).to.deep.equal({ 5: { data: 'today' } });
  });

  it('produce new valid substate with correct key func', () => {
    const keySelector = (action) => action.meta.key;

    const testReducer = mapReducers(
      keySelector,
      reducerNormal
    );
    const action = {
      type: 'test',
      meta: {
        key: 5
      },
      payload: 'today',
    };
    const state = testReducer(undefined, action);
    expect(state).to.deep.equal({ 5: { data: 'today' } });
  });

  it('produce overwrite valid substate with correct key func', () => {
    const keySelector = (action) => action.meta.key;

    const testReducer = mapReducers(
      keySelector,
      reducerNormal
    );
    const action = {
      type: 'test',
      meta: {
        key: 5
      },
      payload: 'today',
    };
    const initialState = { 5: { data: 'yesterday' } };
    const state = testReducer(initialState, action);
    expect(state).to.deep.equal({ 5: { data: 'today' } });
  });

  it('handles all map reducers actions', () => {
    const testReducer = mapReducers(
      'meta.key',
      reducerNormal
    );
    const actionOther = {
      type: 'test',
      meta: {
        key: 3
      },
      payload: 'other',
    };
    const actionNormal = {
      type: 'test',
      meta: {
        key: 6
      },
      payload: 'normal',
    };

    let state = testReducer(undefined, actionOther);
    state = testReducer(state, actionNormal);

    const allReducersAction = {
      type: 'test',
      payload: 'allReducersAffected',
    };
    state = testReducer(state, applyToAll(allReducersAction));
    expect(state).to.deep.equal(
      {
        3: { data: 'allReducersAffected' },
        6: { data: 'allReducersAffected' },
      }
    );
  });


  describe('reducer factory', () => {
    it('has a valid initial state', () => {
      const testReducer = mapReducers(
        'key',
        () => reducerNormal
      );
      const state = testReducer(undefined, {});
      expect(state).to.deep.equal({});
    });

    it('produce new valid substate', () => {
      const testReducer = mapReducers(
        'meta.key',
        key => key > 5 ? reducerNormal : reducerOther
      );
      const actionOther = {
        type: 'test',
        meta: {
          key: 3
        },
        payload: 'other',
      };

      const actionNormal = {
        type: 'test',
        meta: {
          key: 6
        },
        payload: 'normal',
      };
      let state = testReducer(undefined, actionOther);
      state = testReducer(state, actionNormal);
      expect(state).to.deep.equal(
        {
          3: { dataOther: 'other' },
          6: { data: 'normal' },
        }
      );
    });

    describe('Target all mapped reducers', () => {
      it('reduces all mapReducer reducers when the key selector has target all value', () => {
        const testReducer = mapReducers(
          'meta.key',
          reducerNormal
        );
        const actionOther = {
          type: 'test',
          meta: {
            key: 3
          },
          payload: 'other',
        };
        const actionNormal = {
          type: 'test',
          meta: {
            key: 6
          },
          payload: 'normal',
        };

        let state = testReducer(undefined, actionOther);
        state = testReducer(state, actionNormal);

        const dummyAction = {
          type: 'test',
          meta: {
            key: TARGET_ALL_REDUCERS,
          },
          payload: 'allReducersAffected',
        };
        state = testReducer(state, dummyAction);
        expect(state).to.deep.equal(
          {
            3: { data: 'allReducersAffected' },
            6: { data: 'allReducersAffected' },
          }
        );
      });
      it('reduces all mapReducer reducers when the action is applied to all', () => {
        const testReducer = mapReducers(
          'meta.key',
          reducerNormal
        );
        const actionOther = {
          type: 'test',
          meta: {
            key: 3
          },
          payload: 'other',
        };
        const actionNormal = {
          type: 'test',
          meta: {
            key: 6
          },
          payload: 'normal',
        };

        let state = testReducer(undefined, actionOther);
        state = testReducer(state, actionNormal);

        const allReducersAction = {
          type: 'test',
          payload: 'allReducersAffected',
        };
        state = testReducer(state, applyToAll(allReducersAction));
        expect(state).to.deep.equal(
          {
            3: { data: 'allReducersAffected' },
            6: { data: 'allReducersAffected' },
          }
        );
      });
      it('reduces all mapReducerFactory reducers when the key selector has target all value', () => {
        const testReducer = mapReducers(
          'meta.key',
          key => reducerNormal
        );
        const actionOther = {
          type: 'test',
          meta: {
            key: 3
          },
          payload: 'other',
        };
        const actionNormal = {
          type: 'test',
          meta: {
            key: 6
          },
          payload: 'normal',
        };

        let state = testReducer(undefined, actionOther);
        state = testReducer(state, actionNormal);

        const dummyAction = {
          type: 'test',
          meta: {
            key: TARGET_ALL_REDUCERS,
          },
          payload: 'allReducersAffected',
        };
        state = testReducer(state, dummyAction);
        expect(state).to.deep.equal(
          {
            3: { data: 'allReducersAffected' },
            6: { data: 'allReducersAffected' },
          }
        );
      });
      it('reduces all mapFactoryReducer reducers when the action is applied to target all', () => {
        const testReducer = mapReducers(
          'meta.key',
          key => reducerNormal
        );
        const actionOther = {
          type: 'test',
          meta: {
            key: 3
          },
          payload: 'other',
        };
        const actionNormal = {
          type: 'test',
          meta: {
            key: 6
          },
          payload: 'normal',
        };

        let state = testReducer(undefined, actionOther);
        state = testReducer(state, actionNormal);

        const allReducersAction = {
          type: 'test',
          payload: 'allReducersAffected',
        };
        state = testReducer(state, applyToAll(allReducersAction));
        expect(state).to.deep.equal(
          {
            3: { data: 'allReducersAffected' },
            6: { data: 'allReducersAffected' },
          }
        );
      });
    });
  });
});
