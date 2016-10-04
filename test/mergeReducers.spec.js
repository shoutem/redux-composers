/* eslint-disable no-unused-expressions */
import _ from 'lodash';
import { expect } from 'chai';
import {
  mergeReducers,
} from '../src';
import {
  reducerNormal,
  reducerOther,
  reducerSquare,
  reducerSquareArray,
} from './helpers/reducers';

describe('Merge reducer', () => {
  it('has a valid initial state', () => {
    const testReducer = mergeReducers([
      reducerNormal,
      reducerOther,
    ]);
    const state = testReducer({}, {});
    expect(state).to.deep.equal({});
  });

  it('returns same state reference if no new state is generated', () => {
    const initialState = {
      a: 0,
      d: 99,
    };
    const testReducer = mergeReducers([
      () => (null),
      () => (undefined),
      () => (initialState),
    ]);

    const action = {
      type: 'test',
      payload: [1, 2],
    };

    const state = testReducer(initialState, action);
    expect(state).to.equal(initialState);
  });

  it('extends state', () => {
    const initialState = {};
    const testReducer = mergeReducers([
      reducerNormal,
      reducerOther,
    ]);

    const action = {
      type: 'test',
      payload: 2,
    };

    const state = testReducer(initialState, action);
    const expectedState = {
      data: 2,
      dataOther: 2,
    };
    expect(state).to.deep.equal(expectedState);
  });

  it('overrides state', () => {
    const initialState = {};
    const testReducer = mergeReducers([
      reducerNormal,
      reducerSquare,
    ]);

    const action = {
      type: 'test',
      payload: 2,
    };

    const state = testReducer(initialState, action);
    const expectedState = {
      data: 4,
    };
    expect(state).to.deep.equal(expectedState);
  });

  it('merge arrays', () => {
    const initialState = {};
    const testReducer = mergeReducers([
      reducerNormal,
      reducerSquareArray,
    ]);

    const action = {
      type: 'test',
      payload: [1, 2],
    };

    const state = testReducer(initialState, action);
    const expectedState = {
      data: [1, 4],
    };
    expect(state).to.deep.equal(expectedState);
  });

  it('merging object with values', () => {
    const initialState = {
      a: 0,
      d: 99,
    };
    const testReducer = mergeReducers([
      () => ({
        a: 1,
        b: 2,
        c: 3,
      }),
      () => ({
        a: 4,
        b: 5,
        c: 6,
      }),
      () => ({
        a: 7,
      }),
      () => ({}),
      () => (initialState),
    ]);

    const action = {
      type: 'test',
      payload: [1, 2],
    };

    const state = testReducer(initialState, action);
    const expectedState = {
      a: 7,
      b: 5,
      c: 6,
      d: 99,
    };
    expect(state).to.deep.equal(expectedState);
  });

  it('merging object with arrays containing values', () => {
    const initialState = {
      a: [0,1,2],
      d: [0,1,2],
    };
    const testReducer = mergeReducers([
      () => ({
        a: [3,4,5],
        b: [3,4,5],
        c: [3,4,5],
      }),
      () => ({
        b: [6,7,8],
      }),
      () => ({}),
      () => (initialState),
    ]);

    const action = {
      type: 'test',
      payload: [1, 2],
    };

    const state = testReducer(initialState, action);
    const expectedState = {
      a: [3,4,5],
      b: [6,7,8],
      c: [3,4,5],
      d: [0,1,2],
    };
    expect(state).to.deep.equal(expectedState);
  });

  it('merging object with child objects', () => {
    const initialState = {
      a: {
        o: 0,
        x: -1,
        y: -2,
        z: -3,
      },
      d: {
        o: 0,
        x: -1,
        y: -2,
        z: -3,
      },
    };
    const testReducer = mergeReducers([
      () => ({
        a: {
          x: -4,
          y: -5,
          z: -6,
        },
        b: {
          x: -4,
          y: -5,
          z: -6,
        },
        c: {
          x: -4,
          y: -5,
          z: -6,
        },
      }),
      () => ({
        b: {
          x: -7,
          y: -8,
          z: -9,
        },
      }),
      () => ({}),
      () => (initialState),
    ]);

    const action = {
      type: 'test',
      payload: [1, 2],
    };

    const state = testReducer(initialState, action);
    const expectedState = {
      a: {
        o: 0,
        x: -4,
        y: -5,
        z: -6,
      },
      b: {
        x: -7,
        y: -8,
        z: -9,
      },
      c: {
        x: -4,
        y: -5,
        z: -6,
      },
      d: {
        o: 0,
        x: -1,
        y: -2,
        z: -3,
      },
    };
    expect(state).to.deep.equal(expectedState);
  });

  it('merging object with arrays containing objects', () => {
    const initialState = {
      a: [{a:0},{a:1},{a:2}],
      d: [{a:0},{a:1},{a:2}],
    };
    const testReducer = mergeReducers([
      () => ({
        a: [{b:0},{b:1},{b:2}],
        b: [{b:0},{b:1},{b:2}],
        c: [{b:0},{b:1},{b:2}],
      }),
      () => ({
        b: [{b:3},{b:4},{b:5}],
      }),
      () => ({}),
      () => (initialState),
    ]);

    const action = {
      type: 'test',
      payload: [1, 2],
    };

    const state = testReducer(initialState, action);
    const expectedState = {
      a: [{a:0, b:0},{a:1, b:1},{a:2, b:2}], // merge cannot override a, assign can
      b: [{b:3},{b:4},{b:5}],
      c: [{b:0},{b:1},{b:2}],
      d: [{a:0},{a:1},{a:2}],
    };
    expect(state).to.deep.equal(expectedState);
  });

  it('assigning object with values', () => {
    const initialState = {
      a: 0,
      d: 99,
    };
    const testReducer = mergeReducers([
      () => ({
        a: 1,
        b: 2,
        c: 3,
      }),
      () => ({
        a: 4,
        b: 5,
        c: 6,
      }),
      () => ({
        a: 7,
      }),
      () => ({}),
      () => (initialState),
    ], _.assign);

    const action = {
      type: 'test',
      payload: [1, 2],
    };

    const state = testReducer(initialState, action);
    const expectedState = {
      a: 7,
      b: 5,
      c: 6,
      d: 99,
    };
    expect(state).to.deep.equal(expectedState);
  });

  it('assigning object with arrays containing values', () => {
    const initialState = {
      a: [0,1,2],
      d: [0,1,2],
    };
    const testReducer = mergeReducers([
      () => ({
        a: [3,4,5],
        b: [3,4,5],
        c: [3,4,5],
      }),
      () => ({
        b: [6,7,8],
      }),
      () => ({}),
      () => (initialState),
    ], _.assign);

    const action = {
      type: 'test',
      payload: [1, 2],
    };

    const state = testReducer(initialState, action);
    const expectedState = {
      a: [3,4,5],
      b: [6,7,8],
      c: [3,4,5],
      d: [0,1,2],
    };
    expect(state).to.deep.equal(expectedState);
  });

  it('assigning object with child objects', () => {
    const initialState = {
      a: {
        o: 0,
        x: -1,
        y: -2,
        z: -3,
      },
      d: {
        o: 0,
        x: -1,
        y: -2,
        z: -3,
      },
    };
    const testReducer = mergeReducers([
      () => ({
        a: {
          x: -4,
          y: -5,
          z: -6,
        },
        b: {
          x: -4,
          y: -5,
          z: -6,
        },
        c: {
          x: -4,
          y: -5,
          z: -6,
        },
      }),
      () => ({
        b: {
          x: -7,
          y: -8,
          z: -9,
        },
      }),
      () => ({}),
      () => (initialState),
    ], _.assign);

    const action = {
      type: 'test',
      payload: [1, 2],
    };

    const state = testReducer(initialState, action);
    const expectedState = {
      a: {
        x: -4,
        y: -5,
        z: -6,
      },
      b: {
        x: -7,
        y: -8,
        z: -9,
      },
      c: {
        x: -4,
        y: -5,
        z: -6,
      },
      d: {
        o: 0,
        x: -1,
        y: -2,
        z: -3,
      },
    };
    expect(state).to.deep.equal(expectedState);
  });

  it('assigning object with arrays containing objects', () => {
    const initialState = {
      a: [{a:0},{a:1},{a:2}],
      d: [{a:0},{a:1},{a:2}],
    };
    const testReducer = mergeReducers([
      () => ({
        a: [{b:0},{b:1},{b:2}],
        b: [{b:0},{b:1},{b:2}],
        c: [{b:0},{b:1},{b:2}],
      }),
      () => ({
        b: [{b:3},{b:4},{b:5}],
      }),
      () => ({}),
      () => (initialState),
    ]);

    const action = {
      type: 'test',
      payload: [1, 2],
    };

    const state = testReducer(initialState, action);
    const expectedState = {
      a: [{a:0, b:0},{a:1, b:1},{a:2, b:2}], // merge cannot override a, assign can
      b: [{b:3},{b:4},{b:5}],
      c: [{b:0},{b:1},{b:2}],
      d: [{a:0},{a:1},{a:2}],
    };
    expect(state).to.deep.equal(expectedState);
  });
});
