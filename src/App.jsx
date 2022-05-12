import './App.css';
import createAction from './redux/createAction';

import ButtonGroup from './ButtonGroup';
import ShowCount from './ShowCount';
import InputRange from './InputRange';
import { DECREMENT, INCREMENT, RESET, UPDATE_DIFF } from './redux/action-types';
import { useDispatch, useSelector } from './redux/react-redux';

function App() {
  const [count, diff] = useSelector((state) => [state.count, state.diff]);
  const dispatch = useDispatch();

	const onIncrement = () => dispatch(createAction(INCREMENT, count + (diff || 1)));
  const onDecrement = () => dispatch(createAction(DECREMENT, count - (diff || 1)));
	const onReset = () => dispatch(createAction(RESET));

	const handleDiff = ({ target }) => dispatch(createAction(UPDATE_DIFF, (target.valueAsNumber)));

	return (
		<div className="App">
			<main className="App-main">
				<ShowCount count={count} diff={diff} />
				<InputRange handleDiff={handleDiff} diff={diff} />
				<ButtonGroup onDecrement={onDecrement} onReset={onReset} onIncrement={onIncrement} />
			</main>
		</div>
	);
}

export default App;
