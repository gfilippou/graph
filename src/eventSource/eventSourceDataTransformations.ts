export const unixTimestampToDate = (unixTimestamp: string): string => {
  const timestampNumber = parseInt(unixTimestamp, 10);
  const date = new Date(timestampNumber);
  return `${date.getDate()}/${1 + date.getMonth()}/${date.getFullYear()}`;
};

export const bigIntToDecimals = (bigInt: number, decimals: number): number => {
  return bigInt / 10 ** decimals;
};

export const sumFarmsBalance = (farmsArray: any[]): number => {
  if (farmsArray.length !== 0) {
    let farmsBalancesSum = 0;
    farmsArray.forEach((item) => {
      farmsBalancesSum = farmsBalancesSum + Number(item.balance);
    });
    return farmsBalancesSum;
  } else {
    return 0;
  }
};

export const calculateTvl = (
  balance: string | number,
  farmsArray: any[],
  decimals: number,
  priceEth: string
) => {
  const aggregateFarmsBalance: number = sumFarmsBalance(farmsArray);
  const aggregateBalanceDecimal =
    (Number(balance) + aggregateFarmsBalance) / 10 ** decimals;
  return aggregateBalanceDecimal * Number(priceEth);
};

export const appendIncomingPositionToAggregateDataMap = (
  previousAggregateDataMap: Map<string, number>,
  incomingPositionHistory: IncomingPositionHistory,
  incomingPositiondecimals: number
): Map<string, number> => {
  const workingDataMap = new Map(previousAggregateDataMap);

  incomingPositionHistory.forEach((incomingHistoryItem: any) => {
    if (
      incomingHistoryItem.price &&
      Object.keys(incomingHistoryItem.price).length !== 0
    ) {
      let incomingAggregatedTvl = calculateTvl(
        incomingHistoryItem.balance,
        incomingHistoryItem.farms,
        incomingPositiondecimals,
        incomingHistoryItem.price.eth
      );
      if (workingDataMap.has(incomingHistoryItem.timestamp)) {
        const previousAggregateTvl = workingDataMap.get(
          incomingHistoryItem.timestamp
        ) as number;

        workingDataMap.set(
          incomingHistoryItem.timestamp,
          previousAggregateTvl + incomingAggregatedTvl
        );
      } else {
        workingDataMap.set(
          incomingHistoryItem.timestamp,
          incomingAggregatedTvl
        );
      }
    }
  });
  const workingDataMapSorted = new Map([...workingDataMap.entries()].sort());

  return workingDataMapSorted;
};

export const convertPositionsMapToGraphData = (
  graphAggregateDataMap: Map<string, number>
): GraphDataPoint[] => {
  const graphData: GraphDataPoint[] = [];
  for (const entry of graphAggregateDataMap) {
    graphData.push({ date: unixTimestampToDate(entry[0]), TVL: entry[1] });
  }
  return graphData;
};
