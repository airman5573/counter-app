const { createStore, applyMiddleware, compose } = Redux;

const initialState = { counter: 0 };

//action types
const ADD = 'ADD';

//action creators
const createAction = (type, payload) => ({
  type,
  payload
});

const reducer = (state, { type, payload }) => {
  if (type === ADD) {
    return { ...state, counter: state.counter + payload };
  }
  return state;
};





//selectors
const selectCounter = (state) => state.counter;

const store = createStore(reducer, initialState);

//useDispatch will just return store.dispatch function
const useDispatch = () => store.dispatch;



//custom hook checking if component is still mounted
//  you should not set state if component is unmounted
const useIsMounted = () => {
  const isMounted = React.useRef(false);
  React.useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);
  return isMounted;
};




//default compare function
const refCompare = (a, b) => a === b;


function Counter() {
}

//useSelector will listen to store changes and set local state
//  if it changed
const useSelector = (selectFn, compareFn = refCompare) => {
  //set local state with the result from the selector
  const [state, setState] = React.useState(() =>
    selectFn(store.getState())
  );


  //to prevent setting state on unmounted component
  const mounted = useIsMounted();
  //effect to listen to store changes
  React.useEffect(() => {
    //listen to store changes and unsubscribe when unmount
    //  or functions change
    const unsubscribe = store.subscribe(() => {
      //run the selector
      const currentStoreState = selectFn(store.getState());
      //do not set state when component is unmounted
      if (!mounted.current) return;
      //call setState with callback when returning a different
      //  value the component should re render although it also
      //  re render sometimes when same value is returned
      //  I am not sure why this is but happens when pressing
      //  add count and then unrelated action
      //  bug reported here:
      //  https://github.com/facebook/react/issues/20817
      setState(
        (currentLocalState) =>
          //see if result of the selector changed
          compareFn(currentLocalState, currentStoreState)
            ? currentLocalState //do nothing, state didn't change
            : currentStoreState //state did change, assign it to local state
      );
    });
    //unsubscribe when unmounted or functions passed changed
    return unsubscribe;
  }, [compareFn, mounted, selectFn]);
  return state;
};


//Counter will re render when selectCounter(reduxState)
//  changes but will also sometimes render when it doesn't
//  not sure why but should not according to documentation
//  of setState
const Counter = () => {
  const counter = useSelector(selectCounter);
  console.log('rendering counter with', counter);
  return <div>{counter}</div>;
};


//should render only when state changes from odd to even
const OddEven = React.memo(function OddEven() {
  //should only render when isOdd changes but will render
  //  one extra time after a change and first time it
  //  doesn't change, not according to how setState should
  //  work and would be grateful if someone can explain
  //  why this happens as it's not according to setState
  //  documentation
  const isOdd = useSelector((state) =>
    Boolean(selectCounter(state) % 2)
  );
  console.log('rendering OddEven', isOdd);
  return <div>{isOdd ? 'odd' : 'even'}</div>;
});
//in this implementation no provider is needed because it doesn't
//  use React.context
const App = () => {
  const dispatch = useDispatch();
  console.log('in App render');
  return (
    <div>
      <button
        onClick={() =>
          dispatch({ type: 'unrelated action' })
        }
      >
        dispatch unrelated action (no re renders)
      </button>
      <button onClick={() => dispatch(add(1))}>
        add 1
      </button>
      <button onClick={() => dispatch(add(2))}>
        add 2
      </button>
      <Counter />
      <OddEven />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));