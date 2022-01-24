const addressShortener = (address: string, digitsToKeep: number) => {
  return `${address.slice(0, digitsToKeep)}...${address.slice(-digitsToKeep)}`;
};

export default addressShortener;
