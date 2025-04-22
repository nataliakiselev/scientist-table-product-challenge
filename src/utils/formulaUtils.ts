export const normalize = (str: string) => str.replace(/\s+/g, '').toLowerCase();

export const parseFormula = (formula: string, columns: { columnName: string }[]) => {
  const usedColumns: { formulaName: string; index: number }[] = [];
  let parsedFormula = formula;

  columns.forEach((col, idx) => {
    const normalizedColName = normalize(col.columnName);
    const normalizedFormula = normalize(parsedFormula);

    if (normalizedFormula.includes(normalizedColName)) {
      const regex = new RegExp(col.columnName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      parsedFormula = parsedFormula.replace(regex, `col_${usedColumns.length}`);
      usedColumns.push({ formulaName: col.columnName, index: idx });
    }
  });

  return { parsedFormula, usedColumns };
};
