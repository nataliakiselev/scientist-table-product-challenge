import * as React from 'react';
import { useState } from 'react';
import { Button, Dialog, InputGroup, Classes, HTMLSelect } from '@blueprintjs/core';
import { Cell, Column, Table2 } from '@blueprintjs/table';
import { dummyTableData } from './data/dummyData';
import { parseFormula, getMaxRowCount } from './utils/formulaUtils';
import './App.css';

const baseColumns = [
  { columnName: 'Time', columnType: 'time', columnId: 'time_col' },
  { columnName: 'Cell Density', columnType: 'data', columnId: 'var_col_1' },
  { columnName: 'Volume', columnType: 'data', columnId: 'var_col_2' },
];

const aggregationOptions = ["Maximum", "Minimum", "Average"];

const OpviaTable: React.FC = () => {
  const [columns, setColumns] = useState(baseColumns);
  const [tableData, setTableData] = useState(dummyTableData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formula, setFormula] = useState('');
  const [aggregation, setAggregation] = useState('');
  const [aggregationColumn, setAggregationColumn] = useState('');
  const [aggregationResult, setAggregationResult] = useState<number | null>(null);

  const numRows = getMaxRowCount(tableData);

  const cellRenderer = (rowIndex: number, columnIndex: number) => {
    const value = tableData[`${columnIndex}-${rowIndex}`] ?? '';
    return <Cell>{String(value)}</Cell>;
  };

  const handleAddCalculation = () => {
    const newColId = `calc_col_${columns.length}`;
    const newColName = `Calc Column ${columns.length}`;
    const updatedData = { ...tableData };

    const { parsedFormula, usedColumns } = parseFormula(formula, columns);

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
    setIsDialogOpen(false);
    setFormula('');
  };

  const handleAggregation = () => {
    if (!aggregationColumn || !aggregation) return;
    const columnIdx = columns.findIndex(c => c.columnId === aggregationColumn);
    if (columnIdx === -1) return;
    const values: number[] = [];

    for (let row = 0; row < numRows; row++) {
      const val = parseFloat(String(tableData[`${columnIdx}-${row}`]));
      if (!isNaN(val)) values.push(val);
    }

    if (values.length === 0) {
      setAggregationResult(null);
      return;
    }

    let result = null;
    if (aggregation === "Maximum") {
      result = Math.max(...values);
    } else if (aggregation === "Minimum") {
      result = Math.min(...values);
    } else if (aggregation === "Average") {
      result = values.reduce((acc, val) => acc + val, 0) / values.length;
    }

    setAggregationResult(result);
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
        <Button intent="primary" onClick={() => setIsDialogOpen(true)}>
          Add Calculation Column
        </Button>
        <HTMLSelect
          options={[{ label: 'Select Column', value: '' }, ...columns.filter(c => c.columnType !== 'time').map(c => ({ label: c.columnName, value: c.columnId }))]}
          onChange={(e) => setAggregationColumn(e.currentTarget.value)}
        />
        <HTMLSelect
          options={[{ label: 'Select Aggregation', value: '' }, ...aggregationOptions.map(opt => ({ label: opt, value: opt }))]}
          onChange={(e) => setAggregation(e.target.value)}
        />
        <Button intent="success" onClick={handleAggregation}>
          Calculate
        </Button>
        {aggregationResult !== null && (
          <div className="aggregation-result">{aggregation} Value: {aggregationResult.toFixed(2)}</div>
        )}
      </div>
      <Table2 defaultRowHeight={35} numRows={numRows}>
        {cols}
      </Table2>

      <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title="New Calculation Column">
        <div className={Classes.DIALOG_BODY}>
          <InputGroup
            placeholder="Formula e.g. Cell Density * Volume"
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
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




