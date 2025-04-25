export type Column = {
  columnName: string;
  columnType: string;
  columnId: string;
};

export type TableData = Record<string, string | number>;

export type FormulaUIState = {
  formula: string;
  customColName: string;
  isDialogOpen: boolean;
};

export type AggregationUIState = {
  aggregation: string;
  aggregationColumn: string;
  aggregationResult: number | null;
};
