type StoreState = {
  selectedMoa: string;
  totalPositionsExpected: number;
  positionsList: string[];
  graphAggregateData: Map<string, number>;
};

type ContextProvider = {
  state: StoreState;
  dispatch: React.Dispatch<any>;
};

type Action = {
  type: string;
  payload?: any;
};

type GraphDataPoint = {
  date: string;
  TVL: number;
};

type GraphData = GraphDataPoint[];

type IncomingPositionHistory = {
  timestamp: string;
  balance: string;
  farms: { marketAddress: string; balance: number }[];
}[];
