import _ from 'lodash';

/**
 * Action options are additional reserved property for saving
 * redux composers actions settings.
 *
 * @type {string}
 */
export const ACTION_OPTIONS_KEY = 'actionOptions';

/**
 * Mutates action by adding `actionOptions` to the `action.meta`.
 * @param action
 * @param actionOptions
 */
export function addActionOptions(action, actionOptions = {}) {
  if (!_.isPlainObject(action)) {
    throw Error(
      `Invalid action, can not add action options to the ${typeof action}.` +
     'Action must be an object!'
    );
  }
  if (!_.isPlainObject(actionOptions)) {
    throw Error(`Action options must be an object, error for action type ${action.type}`);
  }
  _.set(action, ['meta', ACTION_OPTIONS_KEY], actionOptions);
}

export function getActionOptions(action) {
  return _.get(action, ['meta', ACTION_OPTIONS_KEY]);
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

