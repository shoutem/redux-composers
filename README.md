redux-composers
====================

Redux-composers introduces additional composer reducers besides original `combineReducers` from redux. Original method
from redux allows to create hierarchy of reducers that represent state with numerous substates, but we think that
besides `combineReducers` there are also other composers that allow to compose parts of hierarchy in different ways.
We introduce three composer reducers: `chainReducers`, `mergeReducers` and `mapReducers`.

Composer reducer is our name for reducers that don't manage data in state directly like plain reducers. Composers are
structuring state enabling to build various hierarchies, in short they compose. Each of our composers can be used in
various use cases and combinations with other reducers.

#### `chainReducers(reducers)`
Chains multiple reducers, each reducer will get the state returned by the previous reducer. The final state will be the
state returned by the last reducer in the chain. Reducers order of execution is defined with order in array. Can be used
for extending original reducer with new functionality or overriding existing functionality. For example, adding sorting
& filtering capabilities, responding to new actions, but also if you want to group reducers around some
responsibility/functionality and then reuse them.
###### Arguments
`reducers` (*Array*): Order of reducers in array defines the order of execution of reducers in chain. Each reducer 
should:

* return same type of state as rest of reducers in array
* take into account that other reducers in array can modify state

###### Returns
(*Function*): A reducer that invokes every reducer inside the `reducers` array in chain order, and constructs a state
object or array depending on nature of `reducers`.

#### `mergeReducers(reducers)`
Merges the states returned by multiple reducers. Each reducer will receive the old state. The final new state will be
calculated by performing a deep merge of all of the states returned by reducers. Deep merge is used, that means that
objects and arrays will be merged on all-levels. Order of reducers defines order od merging. Can be used for extending
original reducer with new functionality or overriding existing functionality. For example, adding sorting & filtering
capabilities, responding to new actions, but also if you want to group reducers around some responsibility/functionality
and then reuse them.
###### Arguments
`reducers` (*Array*): Order of reducers in array defines the order of merging states returned by reducers. Each reducer
should:

* return same type of state as rest of reducers in array
* take into account that other reducers in array can modify state

###### Returns
(*Function*): A reducer that invokes every reducer inside the `reducers` array, and constructs a state
object or array by deep merging states returned by reducers.

#### `mapReducers(keySelector, reducer)`
MapReducers is composer that enables applying reducer on substate that is selected based on key. Key is selected from
action based on keySelector. If key doesn't exists in state then `undefined` is passed to reducer as state argument and
newly produced result from reducer is saved in the state under the reducer's key. MapReducers can be used when you have
need for multiple instances of state, but you want to apply changes only on instance with same key as key in action.
Uses map as data structure.
###### Arguments
`keySelector` (*Function|String*): It can be a function or string. Function should be defines as `keySelector(action)`
where function returns key extracted from `action`. You can also pass string which defines path to property in `action`.
Path can be defined in every convention that `_.get` understands from `lodash` library.

`reducer` (*Function*): Applied to substate under key defined with `keySelector`.
###### Returns
(*Function*): A reducer that invokes reducer on substate defined with key extracted from action.

## Examples

```javascript
function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, action.text])
    default:
      return state
  }
}

// extending reducer
function todosRemove(state = [], action) {
  switch (action.type) {
    case 'REMOVE_FINISHED_TODOS':
      return _.filter(state, (todo) => !todo.isFinished)
    default:
      return state
  }
}

// generic sort reducer
function sort(state = [], action) {
  if(!action.sortBy) {
    return state;
  }
  
  const sortBy = action.sortBy;
  const direction = action.sortDirection || 'asc';
  
  return _.orderBy(users, sortBy, direction);  
}

export default chainReducers([todos, todosRemove, sort])
```

```javascript
// overriding reducer
function (state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      
      return state.concat([ action.text ])
    default:
      return state
  }
}
export default mergeReducers([todos, sort])
```

```javascript
// mapReducers
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
// mapReducers
function idsFilter(filterTag) {
 return (state= [], action) => {
  if (!action.filter || action.filter !== filterTag) {
    return state;
  }
 
  switch (action.type) {
     case 'ADD_TODO':
       return [...state, action.id];
     default:
       return state;
  }
};
}
export default mapReducers('id', idsFilter)
```

## Installation

```
$ npm install @shoutem/redux-composers
```

## License

MIT


