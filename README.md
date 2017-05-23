redux-composers
====================

_Redux-composers_ package introduces additional reducer composers besides 
[`combineReducers`](http://redux.js.org/docs/api/combineReducers.html) from [redux](https://github.com/reactjs/redux),
which enable to compose hierarchy in different ways. We introduce 3 additional composer reducers: `chainReducers`,
`mergeReducers` and `mapReducers`.

By definition, reducer composer is a function that turns multiple reducers into
single reducer. Each type of composer manages state and reducers in different way, enabling you to build various
hierarchies. Composers can be used in various use cases and combinations with other reducers.

## Installation

```
$ npm install @shoutem/redux-composers --save
```

## Composers

### `chainReducers(reducers)`
Chain array of reducers, each reducer receiving state returned by the previous reducer. The final state will be state
returned by the last reducer in the chain. Used for responding to new actions, extending and overriding existing
actions, adding generic sorting and filtering capabilities, and grouping reducers.

###### Arguments
`reducers` (*Array*): Order of reducers execution in chain is defined by array. Each reducer should:

* return same type of state as rest of reducers in array
* take into account that other reducers in array can modify state

###### Returns
(*Function*): A reducer that invokes every reducer inside the `reducers` array in chain order, and constructs a state
object or array depending on nature of `reducers`.

###### Example

```javascript
function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, action.text])
    default:
      return state
  }
}

// extending reducer with new functionality
function todosRemove(state = [], action) {
  switch (action.type) {
    case 'REMOVE_FINISHED_TODOS':
      return _.filter(state, (todo) => !todo.isFinished)
    default:
      return state
  }
}

// generic sort reducer that can be used to sort any array
function sort(state = [], action) {
  if(!action.meta || !action.sortBy) {
    return state;
  }
  
  const sortBy = action.meta.sortBy;
  const direction = action.meta.sortDirection || 'asc';
  
  return _.orderBy(state, sortBy, direction);  
}

export default chainReducers([todos, todosRemove, sort])
```

### `mergeReducers(reducers, merger = _.merge)`
Merges the states returned by each reducer. Used for responding to new actions, extending and overriding existing
actions, adding generic sorting and filtering capabilities, and grouping reducers.

###### Arguments
`reducers` (*Array*): Order of reducers in array defines the order of merging states returned by reducers. Each reducer
should:

* return same type of state as rest of reducers in array
* take into account that other reducers in array can modify state

`merger` (*Function*): Optional argument defines method of merging new states produced by reducers. By default `_.merge`
is used, but you can use for example `_.assign` or any other function with same signature as `function(object, [sources])`.

###### Returns
(*Function*): A reducer that invokes every reducer inside the `reducers` array with original state and constructs a
state object or array by deep merging states returned by reducers. The final new state will be calculated by performing
a merge of all of the states returned by reducers with cloned instance of original state (cloning is performed only in
case if any reducer returns new state).

###### Example

```javascript
function todos(state = {}, action) {
  switch (action.type) {
    case 'ADD_TODO': {
      const { id, text } = action;
      return {
        [id]: { id, text },
      });
    }
    default:
      return state;
  }
}

// upperCase first letter in text
function upperTodos = [], action) {
  switch (action.type) {
    case 'ADD_TODO': {
      const { id, text } = action;
      const upperText = _.upperFirst(text);
      return [        
        [id]: { id, upperText },
      ]);
    }
    default:
      return state
  }
}

//result will be state with objects with this signature [id]: { id, text, upperText }
export default mergeReducers([todos, upperTodos])
```

### `mapReducers(keySelector, reducer)`
MapReducers is composer that applies `reducer` on substate that is selected based on key. Key is selected from
action based on `keySelector`. `mapReducers` can be used when you have need for multiple instances of state, but you
want to apply changes only on instance with same key as key in action. Uses map as data structure.

###### Arguments
`keySelector` (*Function|String*): It can be a function or string. Function should be defined as `keySelector(action)`
where function returns key extracted from `action`. You can also pass string which defines path to property in `action`.
Path can be defined in every convention that `_.get` understands from `lodash` library. If key doesn't exists in state
then `undefined` is passed to reducer as state argument and newly produced result from reducer is saved in the state
under the reducer's key. Returning `undefined` or `TARGET_ALL_REDUCERS` constant from `keySelector` will pass the action
to all reducers. 

`reducer` (*Function*): Applied to substate under key defined with `keySelector`. Can be normal redux reducer or reducer 
factory. In either way, defined or created reducer is applied to part of state under key defined in action. Reducer factory
is function that receives key and returns reducer function. In that way enabling to create dynamic reducers for 
different keys.
###### Returns
(*Function*): A reducer that invokes reducer on substate defined with key extracted from action.

###### Example

```javascript
// map of todo objects
function todo(state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };    
    default:
      return state;
  }
};
export default mapReducers('id', todo)
```

```javascript
// list of todos ids per category
function todoIds(state= [], action) => {
  switch (action.type) {
     case 'ADD_TODO':
       return [...state, action.id];
     default:
       return state;
  }
};
}
export default mapReducers('meta.categoryId', todoIds)
```

## Test

```
$ npm run test
```

## License

[The BSD License](https://opensource.org/licenses/BSD-3-Clause)
Copyright (c) 2016-present, [Shoutem](http://shoutem.github.io)



