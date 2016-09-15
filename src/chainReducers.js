import _ from 'lodash';

/**
 * Chains multiple reducers, each reducer will get the state returned by
 * the previous reducer. The final state will be the state returned by
 * the last reducer in the chain.
 * @param reducers: Order of reducers in array defines the order of execution of reducers in chain
 * @returns {Function}: A reducer that invokes every reducer inside the reducers array in chain order,
 * and constructs a state object or array depending on nature of reducers.
 */
export default function chainReducers(reducers) {
  return (state, action) => (
    _.reduce(
      reducers,
      (chainState, reducer) => reducer(chainState, action),
      state
    )
  );
}
