import { createContext } from 'react';
import { eventSourceSpecs } from 'src/config';
import { appendIncomingPositionToAggregateDataMap } from 'src/eventSource/eventSourceDataTransformations';

export const actions = {
  SET_SELECTED_MOA: 'SET_SELECTED_MOA',
  SET_TOTAL_POSITIONS_EXPECTED: 'SET_TOTAL_POSITIONS_EXPECTED',
  SAVE_POSITION_TO_STREAM_LIST: 'SAVE_POSITION_TO_STREAM_LIST',
  RESET_ALL: 'RESET_ALL',
};

export const initialState: StoreState = {
  selectedMoa: eventSourceSpecs.availableEOAs.EOA_1,
  totalPositionsExpected: 0,
  positionsList: [],
  graphAggregateData: new Map(),
};

export const eventSourceReducer = (
  state: StoreState,
  action: Action
): StoreState => {
  switch (action.type) {
    case actions.SET_SELECTED_MOA:
      return { ...state, selectedMoa: action.payload };

    case actions.SET_TOTAL_POSITIONS_EXPECTED:
      return { ...state, totalPositionsExpected: action.payload };

    case actions.SAVE_POSITION_TO_STREAM_LIST:
      // Get the required info from incoming position
      const incomingPositionName = action.payload.details.name;
      const incomingPositionDecimals = action.payload.details.outputToken
        .decimals
        ? action.payload.details.outputToken.decimals
        : 18;
      const incomingPositionHistory = action.payload.history;
      // Get the required info from previous state
      const previousPositionsList = state.positionsList;
      const previousGraphAggregateDataMap = state.graphAggregateData;
      // Apply data transformations
      const newGraphAggregateDataMap = appendIncomingPositionToAggregateDataMap(
        previousGraphAggregateDataMap,
        incomingPositionHistory,
        incomingPositionDecimals
      );
      return {
        ...state,
        positionsList: [...previousPositionsList, incomingPositionName],
        graphAggregateData: newGraphAggregateDataMap,
      };

    case actions.RESET_ALL:
      return {
        ...state,
        totalPositionsExpected: 0,
        positionsList: [],
        graphAggregateData: new Map(),
      };

    default:
      return state;
  }
};

export const AppState = createContext<ContextProvider>({
  state: initialState,
  dispatch: () => null,
});
