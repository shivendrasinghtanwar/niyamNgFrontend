
export class HistoricValueApiResponse {
  res: HistoricValueApiResponseRecord[];
}

export class HistoricValueApiResponseRecord {
  id: Number;
  date: String;
  open: Number;
  high: Number;
  low: Number;
  close: Number;
}
