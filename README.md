# Seal Take-home Product Challenge

Congratulations! This is the last stage before the final interview. It's your opportunity show your product skills, so we weight it very highly.

## How to complete this stage of the interview process

1. Please clone this repo into your own private repo
2. Complete the 'Seal product problem' below
4. Invite _hfmw_ to view the repo & put a link in the form [here](https://forms.gle/E9LASH1Nyhoa3pu48)

## Seal product problem

Scientists are automatically uploading their data from bioreactors into Seal. To help you, some example data is already loaded into a table.

In the example data, each row shows the density of the cells and the total volume in the bioreactor at a given point in time.

The scientists want to calculate the cell count at any point in time, as well as being able to see the maximum cell count.

Instead of building in these features, we have identified two higher level features to build which would solve their problem, and would be useful to all of our customers:

1. `Calculation columns`, these are columns in the table that are populated based on a user defined formula e.g. A cell count column that is created by the formula: `Cell Density * Volume` 
2.  A `Column Aggregations` feature which allows a user to perform operations on a selected data column, such as showing the `Maximum Density`, `Minimum Cell Count`, etc...

You have a meeting scheduled with the scientist who is a customer. Build something they will be use on your laptop to give you feedback. Please use <a href="https://blueprintjs.com/">Blueprintjs</a>.

Put any notes and your instructions in the README as well as what you would do next to improve this. Please also answer how you would make it possible to do `Rate of change calculations` e.g. `Rate of Cell Count Growth`

#### FAQS

- Not sure about something? Please ask! Email `will@seal.run.
- How should I communicate? Please over communicate. Please ask questions.
- What are you looking for? The goal is to get feedback on the features specified. It needs to deliver the specified features well, being easy to use and making a good impression on the customer.
- Unsure whether to submit? Would you be happy to sit next to a customer and let them test it on your laptop?
- Ran out of time? Make this clear in the readme, and write out what you would do next.


## Instructions for Using the App

- Open the app.
- The table shows preloaded example data (Time, Cell Density, Volume).
- To add a **calculation column**:
  1. Click "Add Calculation Column".
  2. Enter a formula using `var_col_1`, `var_col_2` (e.g., `var_col_1 * var_col_2`).
  3. A new column will be added automatically with computed values.
- To perform a **column aggregation**:
  1. Select the column you want to aggregate.
  2. Choose the operation (Maximum, Minimum, Average).
  3. Click "Calculate" to view the result.

**Notes:**
- `var_col_1` = Cell Density (Cell Count/Litre)
- `var_col_2` = Volume (Litres)
- `time_col` = Time

---

## What I Would Improve Next

1. **Extend Aggregation and Calculation Flexibility**  
   - Build a more extensible framework that allows scientists to define different types of calculations or aggregations without hardcoding specific ones.

2. **Persistent Storage**  
   - Allow users to optionally save their created calculation columns and formulas across sessions.

3. **Testing**  
   - Add unit tests for formula parsing and evaluation.
   - Add UI integration tests to verify calculation columns and aggregation workflows.

4. **Formula Validation and Error Handling**  
   - Validate user input formulas before evaluating them.
   - Show clear error messages for invalid formulas or calculation issues (like division by zero).

5. **Custom Naming for Calculation Columns**  
   - Allow users to assign custom names to new calculated columns instead of default names like "Calc Column 1".

6. **Editable Table Cells**  
   - Allow users to edit cell data manually via inline editing.

7. **Responsive Layout Enhancements (if needed)**  
   - Improve layout responsiveness for better use on smaller screens and tablets, if scientists frequently review data on mobile devices or smaller monitors.

---

## How I Would Make Rate of Change Calculations Possible

To support **Rate of Change Calculations**, such as **Rate of Cell Count Growth**, I would extend the current formula system to allow referencing other rows' data.

Example user formula:
```
(var_col_1 - prev(var_col_1)) / (time_col - prev(time_col))
```
Here, `prev(var_col_1)` means "value of var_col_1 from the previous row".

**Implementation Plan:**
- Extend the formula parser to recognize and replace `prev(columnId)` and `next(columnId)` references.
- When evaluating each row, access previous or next row values safely.
- Handle edge cases like the first row (where `prev()` is undefined) gracefully, by showing "undefined" or `null`.
- Allow for more complex future formulas like moving averages or rolling sums.

This feature would enable scientists to compute growth rates, derivative changes over time, and other important trends directly inside the table.

