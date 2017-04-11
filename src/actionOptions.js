import _ from 'lodash';

/**
 * Context is additional, reserved property for saving
 * redux composers actions settings.
 *
 * @type {string}
 */
export const ACTION_OPTIONS_KEY = 'actionOptions';

// Action marked as TARGET_ALL_OPTION_KEY bypass key:reducer relationship at map reducers
// and dispatch action to all mapped reducers.
export const TARGET_ALL_OPTION_KEY = 'targetAll';
// If key selector returns TARGET_ALL_REDUCERS value, all mapped reducers will be activated
export const TARGET_ALL_REDUCERS = 'TARGET_ALL';

/**
 * Mutates action by adding `actionOptions` to the `action.meta`.
 * @param action
 * @param actionOptions
 */
export function addActionOptions(action, actionOptions = {}) {
  if (!_.isPlainObject(action)) {
    throw Error(
      `Invalid action, can not add action options to the ${typeof action}.` +
     'Action must be a object!'
    );
  }
  if (!_.isPlainObject(actionOptions)) {
    throw Error(`Action options must be an object, error for action type ${action.type}`);
  }
  _.set(action, ['meta', ACTION_OPTIONS_KEY], actionOptions);
}

export function setActionOption(action, option, value) {
  let actionOptions = getActionOptions(action);
  if (!actionOptions) {
    addActionOptions(action);
    actionOptions = getActionOptions(action);
  }
  _.set(actionOptions, option, value);
  return action;
}

export function getActionOptions(action) {
  return _.get(action, ['meta', ACTION_OPTIONS_KEY]);
}

export function isTargetAllAction(action) {
  const actionOptions = getActionOptions(action);
  return _.get(actionOptions, TARGET_ALL_OPTION_KEY);
}

export function extendActionToTargetAllMapReducers(action) {
  return setActionOption(action, TARGET_ALL_OPTION_KEY, true);
}

export function isTargetAllKey(keyValue) {
  return keyValue === TARGET_ALL_REDUCERS;
}

