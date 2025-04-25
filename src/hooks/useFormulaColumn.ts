import { useState } from 'react';
import { parseFormula, getMaxRowCount } from '../utils/formulaUtils';
import { Column, TableData, FormulaUIState } from '../types';

export const useFormulaColumn = (
  columns: Column[],
  tableData: TableData,
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>,
  setTableData: React.Dispatch<React.SetStateAction<TableData>>,
) => {
  const [uiState, setUiState] = useState<FormulaUIState>({
    formula: '',
    customColName: '',
    isDialogOpen: false,
  });

  const handleAddCalculation = () => {
    const newColId = `calc_col_${columns.length}`;
    const newColName = uiState.customColName.trim() || `Calc Column ${columns.length}`;
    const updatedData = { ...tableData };

    const { parsedFormula, usedColumns } = parseFormula(uiState.formula, columns);
    const numRows = getMaxRowCount(tableData);

    for (let row = 0; row < numRows; row++) {
      const args = usedColumns.map(col => parseFloat(String(tableData[`${col.index}-${row}`] || '0')));
      try {
        const calcFunction = new Function(...usedColumns.map((_, idx) => `col_${idx}`), `return ${parsedFormula};`);
        const calculated = calcFunction(...args);
        updatedData[`${columns.length}-${row}`] = Number(calculated).toFixed(2);
      } catch (error) {
        console.error('Formula error:', error);
      }
    }

    setColumns([...columns, { columnName: newColName, columnType: 'calculated', columnId: newColId }]);
    setTableData(updatedData);
    setUiState(prev => ({ ...prev, formula: '', customColName: '', isDialogOpen: false }));
  };

  return {
    uiState,
    setUiState,
    handleAddCalculation,
  };
};
