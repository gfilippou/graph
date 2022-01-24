import { useReducer } from 'react';
import { eventSourceReducer, initialState, AppState } from 'src/app/Store';

const State: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(eventSourceReducer, initialState);

  console.log('STATE LOG: ', state);

  return (
    <AppState.Provider value={{ state, dispatch }}>
      {children}
    </AppState.Provider>
  );
};

export default State;
