import { useState } from 'react';
import { getMaxRowCount } from '../utils/formulaUtils';
import { Column, TableData } from '../types';

export const useAggregation = (columns: Column[], tableData: TableData) => {
  const [aggregationState, setAggregationState] = useState({
    aggregation: '',
    aggregationColumn: '',
    aggregationResult: null as number | null,
  });

  const handleAggregation = () => {
    if (!aggregationState.aggregation || !aggregationState.aggregationColumn) return;

    const columnIdx = columns.findIndex(c => c.columnId === aggregationState.aggregationColumn);
    if (columnIdx === -1) return;

    const numRows = getMaxRowCount(tableData);
    const values: number[] = [];

    for (let row = 0; row < numRows; row++) {
      const val = parseFloat(String(tableData[`${columnIdx}-${row}`]));
      if (!isNaN(val)) values.push(val);
    }

    if (values.length === 0) {
      setAggregationState(prev => ({ ...prev, aggregationResult: null }));
      return;
    }

    let result: number|null = null;
    if (aggregationState.aggregation === 'Maximum') {
      result = Math.max(...values);
    } else if (aggregationState.aggregation === 'Minimum') {
      result = Math.min(...values);
    } else if (aggregationState.aggregation === 'Average') {
      result = values.reduce((acc, val) => acc + val, 0) / values.length;
    }

    setAggregationState(prev => ({ ...prev, aggregationResult: result }));
  };

  return {
    aggregationState,
    setAggregationState,
    handleAggregation,
  };
};
