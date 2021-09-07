import React, { useState } from "react";

function TableForm({
  onSubmit,
  onCancel,
  initialState = {
    table_name: "",
    capacity: "",
  },
}) {
  const [table, setTable] = useState(initialState);

  function changeHandler({ target: { name, value } }) {
    setTable((previousTable) => ({
      ...previousTable,
      [name]: value,
    }));
  }

  function numberChangeHandler({ target: { name, value } }) {
    setTable((previousTable) => ({
      ...previousTable,
      [name]: Number(value),
    }));
  }

  function submitHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    onSubmit(table);
  }

  return (
    <>
      <form onSubmit={submitHandler}>
        <fieldset>
          <div className="row">
            <div className="form-group col">
              <label htmlFor="table_name">Table Name</label>
              <input
                type="text"
                id="table_name"
                name="table_name"
                className="form-control"
                value={table.table_name}
                minLength="2"
                required={true}
                placeholder="Table Name"
                onChange={changeHandler}
              />
            </div>
            <div className="form-group col">
              <label htmlFor="capacity">Capacity</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                className="form-control"
                aria-label="Table capacity"
                placeholder="0"
                required={true}
                value={table.capacity}
                min={1}
                onChange={numberChangeHandler}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            <span className="oi oi-check" /> Submit
          </button>
          <button
            type="button"
            className="btn btn-secondary mr-2 cancel"
            onClick={onCancel}
          >
            <span className="oi oi-x" /> Cancel
          </button>
        </fieldset>
      </form>
    </>
  );
}

export default TableForm;