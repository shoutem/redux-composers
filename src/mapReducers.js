import _ from 'lodash';

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

export function mapReducer(keySelector, reducer) {
  validateKeySelector(keySelector);

  return (state = {}, action) => {
    const key = _.isFunction(keySelector) ? keySelector(action) : _.get(action, keySelector);
    if (!key) {
      return state;
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
    const key = _.isFunction(keySelector) ? keySelector(action) : _.get(action, keySelector);
    if (!key) {
      return state;
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
  if (_.isPlainObject(result)) {
    return mapReducer(keySelector, reducer);
  }
  return mapReducerFactory(keySelector, reducer);
}
