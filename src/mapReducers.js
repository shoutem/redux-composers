import _ from 'lodash';
import { setActionOption, getActionOptions } from './actionOptions';

// Action marked as TARGET_ALL_OPTION_KEY bypass key:reducer relationship at map reducers
// and dispatch action to all mapped reducers.
export const TARGET_ALL_OPTION_KEY = 'targetAll';
// If key selector returns TARGET_ALL_REDUCERS value, all mapped reducers will be activated
export const TARGET_ALL_REDUCERS = 'TARGET_ALL';

function validateKeySelector(keySelector) {
  if (!_.isFunction(keySelector)) {
    if (!_.isString(keySelector)) {
      throw new Error('KeySelector argument should be a function or a string');
    }
    if (_.isEmpty(keySelector)) {
      throw new Error('KeySelector argument is empty string.');
    }
  }
}

function resolveKey(action, keySelector) {
  const resolvedKey = _.isFunction(keySelector) ?
    keySelector(action) :
    _.get(action, keySelector);

  return resolvedKey || TARGET_ALL_REDUCERS;
}

export function isTargetAllAction(action) {
  const actionOptions = getActionOptions(action);
  return _.get(actionOptions, TARGET_ALL_OPTION_KEY);
}

export function applyToAll(action) {
  return setActionOption(action, TARGET_ALL_OPTION_KEY, true);
}

export function isTargetAllKey(keyValue) {
  return keyValue === TARGET_ALL_REDUCERS;
}

export function mapReducer(keySelector, reducer) {
  validateKeySelector(keySelector);

  return (state = {}, action) => {
    const key = resolveKey(action, keySelector);
    if (!key) {
      return state;
    }

    const targetAllKey = isTargetAllKey(key);
    const targetAllAction = isTargetAllAction(action);

    if (targetAllAction || targetAllKey) {
      return _.reduce(state, (newState, substate, stateKey) => {
        // eslint-disable-next-line no-param-reassign
        newState[stateKey] = reducer(substate, action);
        return newState;
      }, {});
    }

    return {
      ...state,
      [key]: reducer(state[key], action),
    };
  };
}

export function mapReducerFactory(keySelector, reducerFactory) {
  const reducers = {};
  validateKeySelector(keySelector);

  return (state = {}, action) => {
    const key = resolveKey(action, keySelector);
    if (!key) {
      return state;
    }

    const targetAllKey = isTargetAllKey(key);
    const targetAllAction = isTargetAllAction(action);

    if (targetAllAction || targetAllKey) {
      return _.reduce(state, (newState, substate, stateKey) => {
        const reducer = reducers[stateKey];
        // eslint-disable-next-line no-param-reassign
        newState[stateKey] = reducer(substate, action);
        return newState;
      }, {});
    }

    reducers[key] = reducers[key] || reducerFactory(key);
    return {
      ...state,
      [key]: reducers[key](state[key], action),
    };
  };
}

/**
 * MapReducers is composer that enables applying reducer on substate that is selected based
 * on key. Key is selected from action based on keySelector. It allows for one reducer to be
 * applied to substate depending on key in action or to dynamically create reducer for each
 * key and apply it on substate.
 * @param keySelector is function that returns key or path to key in action
 * @param reducer can be normal redux reducer or reducer factory. In either way defined or
 * created reducer is applied to part of state under key defined in action. Reducer factory
 * is function that receives key and returns reducer function. In that way enabling to create
 * dynamic reducers for different keys.
 * @returns {Function}
 */
export default function mapReducers(keySelector, reducer) {
  const result = reducer(undefined, {});
  if (_.isFunction(result)) {
    return mapReducerFactory(keySelector, reducer);
  }

  return mapReducer(keySelector, reducer);
}
