import React, { useState } from "react";
import { useHistory } from "react-router";
import { createTable } from "../utils/api";

export default function Table() {
  const initialState = {
    table_name: "",
    capacity: 1,
    occupied: false,
  };

  const history = useHistory();
  const [tableError, setTableError] = useState(null);
  const [table, setTable] = useState(initialState);

  function handleChange({ target: { name, value } }) {
    setTable((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    setTableError(null);
    createTable(table)
      .then(() => history.push("/dashboard"))
      .catch(setTableError);
    return () => abortController.abort();
  }

  return (
    <main className="container-fluid mt-3">
      <form onSubmit={handleSubmit}>
        <h1 className="mx-2 mt-4">Create Table</h1>
        {tableError && (
          <div className="alert alert-danger">
            <h5>Please fix the following errors: </h5>
            <ul>
              {tableError.message.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="form-group">
          <label htmlFor="table_name" className="m-2">
            Table Name:
          </label>
          <input
            type="text"
            placeholder="Table"
            name="table_name"
            id="table_name"
            required={true}
            value={table.table_name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="table_name" className="m-2">
            Capacity:
          </label>
          <input
            type="number"
            placeholder= "1"
            name="capacity"
            id="capacity"
            min="1"
            required={true}
            value={table.capacity}
            onChange={handleChange}
          />
        </div>
      </form>
    </main>
  );
}
