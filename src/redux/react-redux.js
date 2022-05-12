import { createContext, useContext, useEffect, useState } from "react";
const ReduxContext = createContext(null);

export const useDispatch = () => {
  const store = useContext(ReduxContext);
  return store.dispatch;
};

export const useStore = () => {
  const store = useContext(ReduxContext);
  return store;
};

// selector => state에서 필요한 값만 빼서 쓰겠다는 의미
export const useSelector = (selector) => {
  const store = useStore();
  const currentState = store.getState();
  const initialState = selector(currentState);
  // useState를 쓴다
  // 초기값으로 store.getState()즉, state를 가져와서 넣는다
  const [localState, setState] = useState(initialState);

  // 구독을 해야한다 => 왜? store의 state값이 바뀔때마다 구독한 친구들 컴포넌트를 re-render해줘야 하기 때문에
  useEffect(() => {
    // dispatch가 호출 될때마다 저 콜백함수가 호출된다
    const callback = () => {
      const state = store.getState();
      const selectedState = selector(state);
      setState(selectedState);
    };
    store.subscribe(callback);
  }, []);

  return localState;
  // 사용자가 원하는 값만 state에서 뽑아서 돌려 줘야한다
};

export function ReduxProvider({ store, children }) {
  return <ReduxContext.Provider value={store}>{children}</ReduxContext.Provider>
}
