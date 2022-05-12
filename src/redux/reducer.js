import { DECREMENT, INCREMENT, RESET, UPDATE_DIFF } from "./action-types";

const reducer = (state, { type, payload }) => {
  switch (type) {
    case INCREMENT: {
      const newState = structuredClone(state);
      newState.count = payload;
      return newState;
    }
    case DECREMENT: {
      const newState = structuredClone(state);
      newState.count = payload;
      return newState;
    }
    case UPDATE_DIFF: {
      const newState = structuredClone(state);
      newState.diff = payload;
      return newState;
    }
    case RESET: {
      const newState = structuredClone(state);
      newState.count = 0;
      newState.diff = 1;
      return newState;
    }
    default: {
      return state;
    }
  }
}

export default reducer;
