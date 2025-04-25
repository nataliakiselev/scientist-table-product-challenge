import * as React from 'react';
import { Button, Dialog, InputGroup, Classes, HTMLSelect } from '@blueprintjs/core';
import { Cell, Column, Table2 } from '@blueprintjs/table';
import { dummyTableData } from './data/dummyData';
import { getMaxRowCount } from './utils/formulaUtils';
import { useFormulaColumn } from './hooks/useFormulaColumn';
import { useAggregation } from './hooks/useAggregation';
import './App.css';

const baseColumns = [
  { columnName: 'Time', columnType: 'time', columnId: 'time_col' },
  { columnName: 'Cell Density', columnType: 'data', columnId: 'var_col_1' },
  { columnName: 'Volume', columnType: 'data', columnId: 'var_col_2' },
];

const aggregationOptions = ["Maximum", "Minimum", "Average"];

const OpviaTable: React.FC = () => {
  const [columns, setColumns] = React.useState(baseColumns);
  const [tableData, setTableData] = React.useState(dummyTableData);

  const {
    uiState,
    setUiState,
    handleAddCalculation
  } = useFormulaColumn(columns, tableData, setColumns, setTableData);

  const {
    aggregationState,
    setAggregationState,
    handleAggregation
  } = useAggregation(columns, tableData);

  const numRows = getMaxRowCount(tableData);

  const cellRenderer = (rowIndex: number, columnIndex: number) => {
    const value = tableData[`${columnIndex}-${rowIndex}`] ?? '';
    return <Cell>{String(value)}</Cell>;
  };

  const cols = columns.map((column, index) => (
    <Column
      key={`${column.columnId}`}
      cellRenderer={(rowIndex) => cellRenderer(rowIndex, index)}
      name={column.columnName}
    />
  ));

  return (
    <div>
      <div className="table-controls">
        <Button intent="primary" onClick={() => setUiState(prev => ({ ...prev, isDialogOpen: true }))}>
          Add Calculation Column
        </Button>
        <HTMLSelect
          options={[{ label: 'Select Column', value: '' }, ...columns.filter(c => c.columnType !== 'time').map(c => ({ label: c.columnName, value: c.columnId }))]}
          value={aggregationState.aggregationColumn}
          onChange={(e) => setAggregationState(prev => ({ ...prev, aggregationColumn: e.currentTarget.value }))}
        />
        <HTMLSelect
          options={[{ label: 'Select Aggregation', value: '' }, ...aggregationOptions.map(opt => ({ label: opt, value: opt }))]}
          value={aggregationState.aggregation}
          onChange={(e) => setAggregationState(prev => ({ ...prev, aggregation: e.currentTarget.value }))}
        />
        <Button intent="success" onClick={handleAggregation}>
          Calculate
        </Button>
        {aggregationState.aggregationResult !== null && (
          <div className="aggregation-result">{aggregationState.aggregation} Value: {aggregationState.aggregationResult.toFixed(2)}</div>
        )}
      </div>
      <Table2 defaultRowHeight={35} numRows={numRows} cellRendererDependencies={[tableData, columns, aggregationState]}>
        {cols}
      </Table2>

      <Dialog isOpen={uiState.isDialogOpen} onClose={() => setUiState(prev => ({ ...prev, isDialogOpen: false }))} title="New Calculation Column">
        <div className={Classes.DIALOG_BODY}>
          <InputGroup
            placeholder="New column name"
            value={uiState.customColName}
            onChange={(e) => setUiState(prev => ({ ...prev, customColName: e.target.value }))}
            style={{ marginBottom: 10 }}
          />
          <InputGroup
            placeholder="Formula e.g. Cell Density * Volume"
            value={uiState.formula}
            onChange={(e) => setUiState(prev => ({ ...prev, formula: e.target.value }))}
          />
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <Button intent="primary" onClick={handleAddCalculation}>
            Add Column
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default OpviaTable;



