## Instructions for Using the App

- Open the app.
- The table shows preloaded example data (Time, Cell Density, Volume).
- To add a **calculation column**:
  1. Click **"Add Calculation Column"**.
  2. Enter a formula using column names:
     - `Cell Density * Volume` 
  3. A new column will be added automatically with computed values.
- To perform a **column aggregation**:
  1. Select the column you want to aggregate from the dropdown.
  2. Choose the operation (Maximum, Minimum, Average).
  3. Click **"Calculate"** to view the result.

**Notes:**
- Formulas are **case-insensitive**.
- Use standard operators: `+`, `-`, `*`, `/`.

---

## Code Structure Notes

- The table component (`OpviaTable.tsx`) focuses on UI, user interactions, and local state management.
- Formula parsing logic (e.g., normalizing user input, replacing column names safely) is abstracted into a separate helper file:  
  **`utils/formulaUtils.ts`**.
- This keeps the code modular, improves readability, and makes formula-related features easier to maintain and extend in the future.

---

## What I Would Improve Next

1. **Extend Aggregation and Calculation Flexibility**
   - Build a more extensible framework that allows scientists to define different types of calculations or aggregations without hardcoding specific ones (e.g., sum, count, standard deviation).

2. **Persistent Storage**
   - Allow users to optionally save their created calculation columns and formulas across sessions, using LocalStorage, IndexedDB, or backend syncing.

3. **Testing**
   - Add unit tests specifically for formula parsing, normalization, evaluation logic, and edge cases. 
   - Add UI integration tests to verify calculation columns and aggregation workflows.

4. **Formula Validation and Error Handling**
   - Validate user input formulas before evaluating them.
   - Show clear, user-friendly error messages for invalid syntax or calculation issues.

5. **Custom Naming for Calculation Columns**
   - Allow users to assign custom names to new calculated columns instead of default names like "Calc Column 1" to improve clarity when many formulas are added.

6. **Editable Table Cells**
   - Allow users to edit table data manually via inline editing, using Blueprint's `EditableCell2` component for a more dynamic experience.

7. **Responsive Layout Enhancements (if needed based on user feedback)**
   - Improve layout responsiveness for better use on smaller screens and tablets, if needed.

---

## How I Would Make Rate of Change Calculations Possible

To support **Rate of Change Calculations**, such as **Rate of Cell Count Growth**, I would extend the current formula system to allow referencing other rows' data.

Example user formula:
```
(Cell Density - prev(Cell Density)) / (Time - prev(Time))
```
Here, `prev(Cell Density)` means "value of Cell Density from the previous row".

**Implementation Plan:**
- Extend the formula parser to recognize and replace `prev(columnName)` and `next(columnName)` references.
- When evaluating each row, access previous or next row values safely.
- Handle edge cases like the first row (where `prev()` is undefined) gracefully, by showing `null` or leaving it empty.
- Allow for more complex future formulas like moving averages or rolling sums.
*/