import _ from 'lodash';

/**
 * Merges the state returned by multiple reducers. Each reducer will receive the
 * previous state from the store. The final state will be calculated by performing
 * a deep merge of all of the states returned by reducers.
 * @param reducers: Order of reducers in array defines the order of merging states returned by reducers.
 * @returns {Function}: A reducer that invokes every reducer inside the reducers array, and constructs
 * a state object or array by deep merging states returned by reducers.
 */
export default function mergeReducers(reducers, merger = _.merge) {
  return (state, action) => {
    const nextStates = reducers.map(reducer => reducer(state, action))
    const nextChangedStates = _.filter(nextStates, nextState => nextState !== state);

    if(_.isEmpty(nextChangedStates)) {
      return state;
    }

    const defaultState = _.cloneDeep(state);
    return merger(defaultState, ...nextChangedStates);
  };
}
