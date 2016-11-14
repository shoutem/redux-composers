import _ from 'lodash';

/**
 * Context is additional, reserved property for saving
 * redux composers actions settings.
 *
 * @type {string}
 */
export const CONTEXT = '@@redux-composers/context';

// Action marked as TARGET_ALL bypass key:reducer relationship at map reducers
// and dispatch action to all mapped reducers.
export const TARGET_ALL = '@@redux-composers/context.TARGET_ALL';

export function getContext(action) {
  return action[CONTEXT];
}

export function isTargetAllAction(action) {
  const context = getContext(action);
  return _.get(context, [TARGET_ALL]);
}

export function extendActionToTargetAllMapReducers(action) {
  return _.set(action, [CONTEXT, TARGET_ALL], true);
}
