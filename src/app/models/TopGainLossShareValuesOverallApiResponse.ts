export class TopGainLossShareValuesOverallApiResponse {
  res: TopGainLossShareValuesOverallApiResponseData;
}
export class TopGainLossShareValuesOverallApiResponseData {
  topGainLossShareValuesOverallGain: TopGainLossShareValuesOverallApiResponseDataRecord[];
  topGainLossShareValuesOverallLoss: TopGainLossShareValuesOverallApiResponseDataRecord[];
}
export class TopGainLossShareValuesOverallApiResponseDataRecord {
  no: Number;
  date: Number;
  company: String;
  cmp: Number;
  gain: Number;
  gain_percent: Number;
  rec_price: Number;
  sector: String;
}
