/* eslint-disable no-unused-expressions */
import _ from 'lodash';
import { expect } from 'chai';
import {
  mapReducers,
} from '../src';
import {
  reducerNormal,
  reducerOther,
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

  it('has a valid initial state with reducer factory', () => {
    const testReducer = mapReducers(
      'key',
      () => reducerNormal
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
    expect(state).to.deep.equal({5: {data: 'today'}});
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
    const initialState = {5: {data: 'yesterday'}};
    const state = testReducer(initialState, action);
    expect(state).to.deep.equal({5: {data: 'today'}});
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
    expect(state).to.deep.equal({5: {data: 'today'}});
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
    const initialState = {5: {data: 'yesterday'}};
    const state = testReducer(initialState, action);
    expect(state).to.deep.equal({5: {data: 'today'}});
  });

  it('produce new valid substate with reducer factory', () => {
    const testReducer = mapReducers(
      'meta.key',
      key => key > 5 ? reducerNormal: reducerOther
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
        3: {dataOther: 'other'},
        6: {data: 'normal'},
      }
    );
  });
});
