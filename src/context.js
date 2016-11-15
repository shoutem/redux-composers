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

export function addContext(action, initialContext = {}) {
  if (!_.isPlainObject(action)) {
    throw Error(
      `Invalid action, can not add context to ${typeof action}.` +
     'Action must be a object!'
    );
  }
  if (!_.isPlainObject(initialContext)) {
    throw Error(`Context initial value must be object, error for action type ${action.type}`);
  }
  Object.defineProperty(action, CONTEXT, {
    value: initialContext,
    enumerable: false,
    writable: true,
  });
}

export function setContextProp(action, path, value) {
  let context = getContext(action);
  if (!context) {
    addContext(action);
    context = getContext(action);
  }
  _.set(context, path, value);
  return action;
}

export function getContext(action) {
  return action[CONTEXT];
}

export function isTargetAllAction(action) {
  const context = getContext(action);
  return _.get(context, [TARGET_ALL]);
}

export function extendActionToTargetAllMapReducers(action) {
  return setContextProp(action, [TARGET_ALL], true);
}
