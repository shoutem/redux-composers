/* eslint-disable no-unused-expressions */
import _ from 'lodash';
import { expect } from 'chai';
import {
  addContext,
  getContext,
  setContextProp,
  CONTEXT,
} from '../src/context';

describe('Context', () => {
  describe('addContext', () => {
    it('adds context to action', () => {
      const action = {};
      addContext(action);
      expect(action[CONTEXT]).to.be.ok;
    });
    it('adds context to action with initial settings', () => {
      const action = {};
      const initialContext = { a: 1 };
      addContext(action, initialContext);
      expect(action[CONTEXT]).to.equal(initialContext);
    });
    it('throws error if action is not object', () => {
      const action = {};
      expect(() => addContext(1)).to.throw('Invalid action, can not add context');
    });
    it('throws error if initialContext is not object', () => {
      const action = {};
      expect(() => addContext(action, 1)).to.throw('Context initial value must be object');
    });
  });
  describe('getContext', () => {
    it('returns action context', () => {
      const action = {};
      const initialContext = { a: 1 };
      addContext(action, initialContext);
      expect(getContext(action)).to.equal(initialContext);
    });
  });
  describe('setContextProp', () => {
    it('sets property with string path', () => {
      const action = {};
      const expectedContext = { test: { path: true }};
      setContextProp(action, 'test.path', true);
      expect(getContext(action)).to.deep.equal(expectedContext);
    });
    it('sets property with array path', () => {
      const action = {};
      const expectedContext = { test: { path: true }};
      setContextProp(action, ['test', 'path'], true);
      expect(getContext(action)).to.deep.equal(expectedContext);
    });
    it('sets property to context if context doesn\'t exist', () => {
      const action = {};
      setContextProp(action, 'test', { a: 1});
      expect(getContext(action).test).to.deep.equal({ a: 1});
    });
    it('sets property to context if context exist', () => {
      const action = {};
      const initialContext = { a: {} };
      const expectedContext = {
        a: {
          b: true,
        },
      };
      addContext(action, initialContext);
      setContextProp(action, ['a', 'b'], true);
      expect(getContext(action)).to.deep.equal(expectedContext);
    });
  });
});
