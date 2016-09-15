import _ from 'lodash';

/**
 * Merges the state returned by multiple reducers. Each reducer will receive the
 * previous state from the store. The final state will be calculated by performing
 * a deep merge of all of the states returned by reducers.
 * @param reducers: Order of reducers in array defines the order of merging states returned by reducers.
 * @returns {Function}: A reducer that invokes every reducer inside the reducers array, and constructs
 * a state object or array by deep merging states returned by reducers.
 */
export default function mergeReducers(reducers) {
  return (state, action) => {
    const nextStates = reducers.map(reducer => reducer(state, action));
    return _.merge(...nextStates);
  };
}
