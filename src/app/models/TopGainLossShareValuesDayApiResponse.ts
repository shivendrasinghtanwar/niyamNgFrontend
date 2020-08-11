export class TopGainLossShareValuesDayApiResponse {
  res: TopGainLossShareValuesDayApiResponseData;
}
export class TopGainLossShareValuesDayApiResponseData {
  topGainLossShareValuesDayGain: TopGainLossShareValuesDayApiResponseDataRecord[];
  topGainLossShareValuesDayLoss: TopGainLossShareValuesDayApiResponseDataRecord[];
}
export class TopGainLossShareValuesDayApiResponseDataRecord {
  no: Number;
  date: Number;
  company: String;
  cmp: Number;
  gain: Number;
  gain_percent: Number;
  rec_price: Number;
  sector: String;
}
