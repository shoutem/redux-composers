/* eslint-disable no-unused-expressions */
import _ from 'lodash';
import { expect } from 'chai';
import {
  addActionsOption,
  getActionOptions,
  setActionOption,
  ACTION_OPTIONS_KEY,
} from '../src/actionOptions';

describe('Action Options', () => {
  describe('addActionsOption()', () => {
    it('adds action options to action.meta', () => {
      const action = {};
      addActionsOption(action);
      expect(action.meta[ACTION_OPTIONS_KEY]).to.be.ok;
    });
    it('adds context to action with initial settings', () => {
      const action = {};
      const initialContext = { a: 1 };
      addActionsOption(action, initialContext);
      expect(action.meta[ACTION_OPTIONS_KEY]).to.equal(initialContext);
    });
    it('throws error if action is not object', () => {
      const action = {};
      expect(() => addActionsOption(1)).to.throw('Invalid action, can not add action options');
    });
    it('throws error if initialContext is not object', () => {
      const action = {};
      expect(() => addActionsOption(action, 1)).to.throw('Action options must be an object');
    });
  });
  describe('getActionOptions', () => {
    it('returns action options', () => {
      const action = {};
      const initialContext = { a: 1 };
      addActionsOption(action, initialContext);
      expect(getActionOptions(action)).to.equal(initialContext);
    });
  });
  describe('setActionOption', () => {
    it('sets property with string path', () => {
      const action = {};
      const expectedContext = { test: { path: true }};
      setActionOption(action, 'test.path', true);
      expect(getActionOptions(action)).to.deep.equal(expectedContext);
    });
    it('sets property with array path', () => {
      const action = {};
      const expectedContext = { test: { path: true }};
      setActionOption(action, ['test', 'path'], true);
      expect(getActionOptions(action)).to.deep.equal(expectedContext);
    });
    it('sets property to action options if action options doesn\'t exist', () => {
      const action = {};
      setActionOption(action, 'test', { a: 1});
      expect(getActionOptions(action).test).to.deep.equal({ a: 1});
    });
    it('sets property to action options if action options exist', () => {
      const action = {};
      const initialContext = { a: {} };
      const expectedContext = {
        a: {
          b: true,
        },
      };
      addActionsOption(action, initialContext);
      setActionOption(action, ['a', 'b'], true);
      expect(getActionOptions(action)).to.deep.equal(expectedContext);
    });
  });
});
