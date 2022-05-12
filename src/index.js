import React from 'react';
import ReactDOM from 'react-dom';
import { legacy_createStore as createStore } from "redux";
import './index.css';
import App from './App';
import { ReduxProvider } from './redux/react-redux';
import reducer from './redux/reducer';

const initialState = {
  count: 0,
  diff: 1,
};

const store = createStore(reducer, initialState);

ReactDOM.render(
  <ReduxProvider store={store}>
		<App />
  </ReduxProvider>,
	document.getElementById('root'),
);
